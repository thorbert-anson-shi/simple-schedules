import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import * as crypto from 'crypto';

jest.setTimeout(30000);

const JWT_SECRET = "jwt secret let's hope this is safe";

function hmacSha256(secret: string, data: string): string {
  return crypto.createHmac('sha256', secret).update(data).digest('base64url');
}

function base64url(obj: object): string {
  return Buffer.from(JSON.stringify(obj)).toString('base64url');
}

function createSignedJwt(payload: object, secret: string): string {
  const header = base64url({ alg: 'HS256', typ: 'JWT' });
  const body = base64url(payload);
  const sig = hmacSha256(secret, `${header}.${body}`);
  return `${header}.${body}.${sig}`;
}

describe('Auth & Authorization (e2e)', () => {
  let app: INestApplication<App>;
  let adminToken: string;
  let customerToken: string;

  let adminUser: { sub: number; role: string };
  let customerUser: { sub: number; role: string };

  beforeAll(async () => {
    const testEmail = `e2e_cust_${Date.now()}@test.com`;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    const adminLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@staging.com', password: 'adminpassword123' });
    adminToken = adminLogin.body.access_token;

    const decodedAdmin = Buffer.from(
      adminToken.split('.')[1],
      'base64url',
    ).toString();
    adminUser = JSON.parse(decodedAdmin);

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: testEmail, password: 'StrongP@ss1' })
      .expect(201);

    const custLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: testEmail, password: 'StrongP@ss1' });
    customerToken = custLogin.body.access_token;

    const decodedCust = Buffer.from(
      customerToken.split('.')[1],
      'base64url',
    ).toString();
    customerUser = JSON.parse(decodedCust);
  }, 30000);

  afterAll(async () => {
    await app.close();
  });

  describe('Authentication', () => {
    describe('Missing / malformed credentials', () => {
      it('returns 401 without Authorization header', () =>
        request(app.getHttpServer()).get('/schedule').expect(401));

      it('returns 401 with empty Authorization header', () =>
        request(app.getHttpServer())
          .get('/schedule')
          .set('Authorization', '')
          .expect(401));

      it('returns 401 with token missing Bearer prefix', () =>
        request(app.getHttpServer())
          .get('/schedule')
          .set('Authorization', customerToken)
          .expect(401));

      it('returns 401 with garbage token', () =>
        request(app.getHttpServer())
          .get('/schedule')
          .set('Authorization', 'Bearer not-a-valid-token')
          .expect(401));

      it('returns 401 with wrong scheme (Basic)', () =>
        request(app.getHttpServer())
          .get('/schedule')
          .set('Authorization', `Basic ${customerToken}`)
          .expect(401));
    });

    describe('Token tampering', () => {
      it('returns 401 with token signed with wrong secret', () => {
        const tampered = createSignedJwt(
          {
            sub: adminUser.sub,
            role: 'ADMIN',
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 300,
          },
          'wrong-secret',
        );
        return request(app.getHttpServer())
          .get('/schedule')
          .set('Authorization', `Bearer ${tampered}`)
          .expect(401);
      });

      it('returns 401 with alg:none token', () => {
        const header = base64url({ alg: 'none', typ: 'JWT' });
        const body = base64url({
          sub: 1,
          role: 'ADMIN',
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 300,
        });
        const fakeToken = `${header}.${body}.`;
        return request(app.getHttpServer())
          .get('/schedule')
          .set('Authorization', `Bearer ${fakeToken}`)
          .expect(401);
      });
    });

    describe('Expired token', () => {
      it('returns 401 with expired token', () => {
        const expired = createSignedJwt(
          {
            sub: adminUser.sub,
            role: 'ADMIN',
            iat: Math.floor(Date.now() / 1000) - 10,
            exp: Math.floor(Date.now() / 1000) - 1,
          },
          JWT_SECRET,
        );
        return request(app.getHttpServer())
          .get('/schedule')
          .set('Authorization', `Bearer ${expired}`)
          .expect(401);
      });
    });

    describe('Valid token', () => {
      it('returns 200 with valid admin token', () =>
        request(app.getHttpServer())
          .get('/schedule')
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200));

      it('returns 200 with valid customer token', () =>
        request(app.getHttpServer())
          .get('/schedule')
          .set('Authorization', `Bearer ${customerToken}`)
          .expect(200));
    });
  });

  describe('Authorization', () => {
    describe('Admin-only: POST /schedule', () => {
      const payload = {
        staff_id: 1,
        start_date: '2030-01-01T09:00:00Z',
        end_date: '2030-01-01T17:00:00Z',
        num_weeks: 1,
      };

      it('returns 403 for CUSTOMER', () =>
        request(app.getHttpServer())
          .post('/schedule')
          .set('Authorization', `Bearer ${customerToken}`)
          .send(payload)
          .expect(403));

      it('returns 201 for ADMIN', () =>
        request(app.getHttpServer())
          .post('/schedule')
          .set('Authorization', `Bearer ${adminToken}`)
          .send(payload)
          .expect(201));
    });

    describe('Admin-only: DELETE /schedule', () => {
      it('returns 403 for CUSTOMER', () =>
        request(app.getHttpServer())
          .delete('/schedule')
          .set('Authorization', `Bearer ${customerToken}`)
          .send({
            staff_id: 1,
            start_date: '2030-01-01T00:00:00Z',
            end_date: '2030-01-02T23:59:59Z',
          })
          .expect(403));

      it('returns 403 for CUSTOMER on /schedule/block', () =>
        request(app.getHttpServer())
          .delete('/schedule/block')
          .set('Authorization', `Bearer ${customerToken}`)
          .send({
            start_date: '2030-06-01T00:00:00Z',
            end_date: '2030-06-30T23:59:59Z',
          })
          .expect(403));
    });

    describe('Multi-role: GET /schedule', () => {
      it('returns 200 for CUSTOMER', () =>
        request(app.getHttpServer())
          .get('/schedule')
          .set('Authorization', `Bearer ${customerToken}`)
          .expect(200));

      it('returns 200 for ADMIN', () =>
        request(app.getHttpServer())
          .get('/schedule')
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200));
    });

    describe('Booking role constraints', () => {
      it('returns 403 for CUSTOMER using customerId param on GET /booking', () =>
        request(app.getHttpServer())
          .get('/booking?customerId=1')
          .set('Authorization', `Bearer ${customerToken}`)
          .expect(403));

      it('returns 200 for ADMIN using customerId param on GET /booking', () =>
        request(app.getHttpServer())
          .get('/booking?customerId=1')
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200));

      it('returns 400 for ADMIN without customerId on GET /booking', () =>
        request(app.getHttpServer())
          .get('/booking')
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(400));
    });
  });
});

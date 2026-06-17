import { Module } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { ConfigModule, ConfigProvider } from '../config';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'DB_CLIENT',
      useFactory: (config: ConfigProvider) => drizzle(config.env.DATABASE_URL),
      inject: [ConfigProvider],
    },
  ],
  exports: ['DB_CLIENT'],
})
export class DatabaseModule {}

import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  checkHealth(): string {
    return 'Service is healthy';
  }
}

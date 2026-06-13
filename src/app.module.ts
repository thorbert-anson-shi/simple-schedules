import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleController } from './schedule/schedule.controller';
import { ScheduleModule } from './schedule/schedule.module';

@Module({
  imports: [ScheduleModule],
  controllers: [AppController, ScheduleController],
  providers: [AppService],
})
export class AppModule {}

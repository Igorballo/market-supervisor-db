import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { CronsService } from './crons.service';
import { CronsController } from './crons.controller';
import { CronExecutorService } from './cron-executor.service';
import { Cron } from '../entities/cron.entity';
import { SearchModule } from '../search/search.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cron]),
    ScheduleModule.forRoot(),
    SearchModule,
  ],
  controllers: [CronsController],
  providers: [CronsService, CronExecutorService],
  exports: [CronsService, CronExecutorService],
})
export class CronsModule {} 
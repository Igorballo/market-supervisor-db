import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CronsService } from './crons.service';
import { CronsController } from './crons.controller';
import { Cron } from '../entities/cron.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cron])],
  controllers: [CronsController],
  providers: [CronsService],
  exports: [CronsService],
})
export class CronsModule {} 
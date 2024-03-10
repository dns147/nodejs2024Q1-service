import { Module } from '@nestjs/common';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';
import { connectionStorage } from 'src/db/dataBase';

@Module({
  controllers: [TrackController],
  providers: [TrackService, connectionStorage],
})
export class TrackModule {}

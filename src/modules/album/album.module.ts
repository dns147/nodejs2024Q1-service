import { Module } from '@nestjs/common';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';
import { connectionStorage } from 'src/db/dataBase';
import { TrackService } from '../track/track.service';

@Module({
  controllers: [AlbumController],
  providers: [AlbumService, TrackService, connectionStorage],
})
export class AlbumModule {}

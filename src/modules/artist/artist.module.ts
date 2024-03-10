import { Module } from '@nestjs/common';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { connectionStorage } from 'src/db/dataBase';
import { TrackService } from '../track/track.service';
import { AlbumService } from '../album/album.service';

@Module({
  controllers: [ArtistController],
  providers: [ArtistService, TrackService, AlbumService, connectionStorage],
})
export class ArtistModule {}

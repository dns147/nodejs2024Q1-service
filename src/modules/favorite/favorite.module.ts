import { Module } from '@nestjs/common';
import { FavoriteController } from './favorite.controller';
import { FavoriteService } from './favorite.service';
import { connectionStorage } from 'src/db/dataBase';
import { TrackService } from '../track/track.service';
import { AlbumService } from '../album/album.service';
import { ArtistService } from '../artist/artist.service';

@Module({
  controllers: [FavoriteController],
  providers: [
    FavoriteService,
    TrackService,
    AlbumService,
    ArtistService,
    connectionStorage,
  ],
})
export class FavoriteModule {}

import { Module } from '@nestjs/common';
import { FavoriteController } from './favorite.controller';
import { FavoriteService } from './favorite.service';
import { TrackService } from '../track/track.service';
import { AlbumService } from '../album/album.service';
import { ArtistService } from '../artist/artist.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [FavoriteController],
  providers: [FavoriteService, TrackService, AlbumService, ArtistService],
  imports: [PrismaModule],
})
export class FavoriteModule {}

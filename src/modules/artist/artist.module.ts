import { Module } from '@nestjs/common';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { TrackService } from '../track/track.service';
import { AlbumService } from '../album/album.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [ArtistController],
  providers: [ArtistService, TrackService, AlbumService],
  imports: [PrismaModule],
})
export class ArtistModule {}

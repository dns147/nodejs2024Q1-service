import { Module } from '@nestjs/common';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';
import { TrackService } from '../track/track.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [AlbumController],
  providers: [AlbumService, TrackService],
  imports: [PrismaModule],
})
export class AlbumModule {}

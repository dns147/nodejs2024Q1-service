import { Module } from '@nestjs/common';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [TrackController],
  providers: [TrackService],
  imports: [PrismaModule],
})
export class TrackModule {}

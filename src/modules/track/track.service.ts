import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTrackDto, TrackDto, UpdateTrackDto } from './dto/track.dto';
import { validate as uuidValidate, v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TrackService {
  constructor(private prisma: PrismaService) {}

  async getAllTracks(): Promise<TrackDto[]> {
    const storage = await this.prisma.track.findMany();

    return storage;
  }

  async getTrackById(trackId: string): Promise<TrackDto | undefined> {
    if (!uuidValidate(trackId)) {
      throw new HttpException(
        'trackId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }

    const storage = await this.prisma.track.findMany();
    const trackById = storage.find(({ id }) => id === trackId);

    if (!trackById) {
      throw new HttpException("track doesn't exist", HttpStatus.NOT_FOUND);
    }

    return trackById;
  }

  async createTrack(createTrackDto: CreateTrackDto): Promise<TrackDto> {
    const { name, artistId, albumId, duration } = createTrackDto;

    if (
      !name ||
      !duration ||
      typeof name !== 'string' ||
      typeof duration !== 'number'
    ) {
      throw new HttpException(
        "body doesn't contain required fields",
        HttpStatus.BAD_REQUEST,
      );
    }

    const newTrack: TrackDto = {
      id: uuidv4(),
      name: name,
      artistId: artistId,
      albumId: albumId,
      duration: duration,
    };

    await this.prisma.track.create({ data: newTrack });

    return newTrack;
  }

  async updateTrack(trackId: string, updateTrackDto: UpdateTrackDto) {
    if (!uuidValidate(trackId)) {
      throw new HttpException(
        'trackId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }

    const { name, duration } = updateTrackDto;

    if (
      !name ||
      !duration ||
      typeof name !== 'string' ||
      typeof duration !== 'number'
    ) {
      throw new HttpException(
        "record with trackId doesn't exist",
        HttpStatus.BAD_REQUEST,
      );
    }

    const trackUpdate = {
      name: name,
      duration: duration,
    };

    await this.prisma.track.update({
      where: { id: trackId },
      data: trackUpdate,
    });
  }

  async deleteTrack(trackId: string) {
    if (!uuidValidate(trackId)) {
      throw new HttpException(
        'trackId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }

    const storage = await this.prisma.track.findMany();

    if (!storage.find(({ id }) => id === trackId)) {
      throw new HttpException(
        "record with trackId doesn't exist",
        HttpStatus.NOT_FOUND,
      );
    }

    await this.prisma.track.delete({ where: { id: trackId } });
  }

  async deleteAlbumFromTracks(albumId: string) {
    const storage = await this.prisma.track.findMany();

    const tracks = storage.map((track) => {
      if (track.albumId === albumId) {
        track.albumId = null;
      }

      return track;
    });

    await this.prisma.track.update({
      where: { id: albumId },
      data: tracks[0],
    });
  }

  async deleteArtistFromTracks(artistId: string) {
    const storage = await this.prisma.track.findMany();

    const tracks = storage.map((track) => {
      if (track.artistId === artistId) {
        track.artistId = null;
      }

      return track;
    });

    await this.prisma.track.update({
      where: { id: artistId },
      data: tracks[0],
    });
  }
}

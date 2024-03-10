import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateTrackDto, TrackDto, UpdateTrackDto } from './dto/track.dto';
import { DBStorage } from 'src/db/dataBase';
import { validate as uuidValidate, v4 as uuidv4 } from 'uuid';
import { MEMORY_STORAGE } from 'src/helpers/consts';

@Injectable()
export class TrackService {
  constructor(@Inject(MEMORY_STORAGE) private readonly storage: DBStorage) {}

  async getAllTracks(): Promise<TrackDto[]> {
    const storage = await this.storage.getStorage();

    return storage.tracks;
  }

  async getTrackById(trackId: string): Promise<TrackDto | undefined> {
    if (!uuidValidate(trackId)) {
      throw new HttpException(
        'trackId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }

    const storage = await this.storage.getStorage();
    const trackById = storage.tracks.find(({ id }) => id === trackId);

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

    const storage = await this.storage.getStorage();
    const tracks: TrackDto[] = storage.tracks;
    tracks.push(newTrack);

    await this.storage.updateStorage({ ...storage, tracks });

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

    const storage = await this.storage.getStorage();

    const tracks = storage.tracks.map((track) => {
      if (track.id === trackId) {
        return {
          ...track,
          name: name,
          duration: duration,
        };
      } else {
        return track;
      }
    });

    await this.storage.updateStorage({ ...storage, tracks });
  }

  async deleteTrack(trackId: string) {
    if (!uuidValidate(trackId)) {
      throw new HttpException(
        'trackId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }

    const storage = await this.storage.getStorage();

    if (!storage.tracks.find(({ id }) => id === trackId)) {
      throw new HttpException(
        "record with trackId doesn't exist",
        HttpStatus.NOT_FOUND,
      );
    }

    const tracks = storage.tracks.filter(({ id }) => id !== trackId);

    await this.storage.updateStorage({ ...storage, tracks });
  }
}

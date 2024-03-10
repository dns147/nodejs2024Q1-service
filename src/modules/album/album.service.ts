import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { AlbumDto, CreateAlbumDto, UpdateAlbumDto } from './dto/album.dto';
import { DBStorage } from 'src/db/dataBase';
import { validate as uuidValidate, v4 as uuidv4 } from 'uuid';
import { MEMORY_STORAGE } from 'src/helpers/consts';
import { TrackService } from '../track/track.service';

@Injectable()
export class AlbumService {
  constructor(
    private readonly trackService: TrackService,
    @Inject(MEMORY_STORAGE) private readonly storage: DBStorage,
  ) {}

  async getAllAlbums(): Promise<AlbumDto[]> {
    const storage = await this.storage.getStorage();

    return storage.albums;
  }

  async getAlbumById(albumId: string): Promise<AlbumDto | undefined> {
    if (!uuidValidate(albumId)) {
      throw new HttpException(
        'albumId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }

    const storage = await this.storage.getStorage();
    const albumById = storage.albums.find(({ id }) => id === albumId);

    if (!albumById) {
      throw new HttpException("album doesn't exist", HttpStatus.NOT_FOUND);
    }

    return albumById;
  }

  async createAlbum(createAlbumDto: CreateAlbumDto): Promise<AlbumDto> {
    const { name, year, artistId } = createAlbumDto;

    if (
      !name ||
      !year ||
      typeof name !== 'string' ||
      typeof year !== 'number'
    ) {
      throw new HttpException(
        "body doesn't contain required fields",
        HttpStatus.BAD_REQUEST,
      );
    }

    const newAlbum: AlbumDto = {
      id: uuidv4(),
      name: name,
      year: year,
      artistId: artistId,
    };

    const storage = await this.storage.getStorage();
    const albums: AlbumDto[] = storage.albums;
    albums.push(newAlbum);

    await this.storage.updateStorage({ ...storage, albums });

    return newAlbum;
  }

  async updateAlbum(albumId: string, updateAlbumDto: UpdateAlbumDto) {
    if (!uuidValidate(albumId)) {
      throw new HttpException(
        'albumId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }

    const { name, year, artistId } = updateAlbumDto;

    if (
      !name ||
      !year ||
      typeof name !== 'string' ||
      typeof year !== 'number'
    ) {
      throw new HttpException(
        "record with albumId doesn't exist",
        HttpStatus.BAD_REQUEST,
      );
    }

    const storage = await this.storage.getStorage();

    const albums = storage.albums.map((album) => {
      if (album.id === albumId) {
        return {
          ...album,
          name: name,
          year: year,
          artistId: artistId,
        };
      }

      return album;
    });

    await this.storage.updateStorage({ ...storage, albums });
  }

  async deleteAlbum(albumId: string) {
    if (!uuidValidate(albumId)) {
      throw new HttpException(
        'albumId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }

    const storage = await this.storage.getStorage();

    if (!storage.albums.find(({ id }) => id === albumId)) {
      throw new HttpException(
        "record with albumId doesn't exist",
        HttpStatus.NOT_FOUND,
      );
    }

    const albums = storage.albums.filter(({ id }) => id !== albumId);

    await this.storage.updateStorage({ ...storage, albums });

    await this.trackService.deleteAlbumFromTracks(albumId);
  }
}

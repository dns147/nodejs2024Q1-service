import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ArtistDto, CreateArtistDto, UpdateArtistDto } from './dto/artist.dto';
import { DBStorage } from 'src/db/dataBase';
import { validate as uuidValidate, v4 as uuidv4 } from 'uuid';
import { MEMORY_STORAGE } from 'src/helpers/consts';
import { TrackService } from '../track/track.service';
import { AlbumService } from '../album/album.service';

@Injectable()
export class ArtistService {
  constructor(
    private readonly trackService: TrackService,
    private readonly albumService: AlbumService,
    @Inject(MEMORY_STORAGE) private readonly storage: DBStorage,
  ) {}

  async getAllArtists(): Promise<ArtistDto[]> {
    const storage = await this.storage.getStorage();

    return storage.artists;
  }

  async getArtistById(artistId: string): Promise<ArtistDto | undefined> {
    if (!uuidValidate(artistId)) {
      throw new HttpException(
        'artistId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }

    const storage = await this.storage.getStorage();
    const artistById = storage.artists.find(({ id }) => id === artistId);

    if (!artistById) {
      throw new HttpException("artist doesn't exist", HttpStatus.NOT_FOUND);
    }

    return artistById;
  }

  async createArtist(createArtistDto: CreateArtistDto): Promise<ArtistDto> {
    const { name, grammy } = createArtistDto;

    if (
      !name ||
      !grammy ||
      typeof name !== 'string' ||
      typeof grammy !== 'boolean'
    ) {
      throw new HttpException(
        "body doesn't contain required fields",
        HttpStatus.BAD_REQUEST,
      );
    }

    const newArtist: ArtistDto = {
      id: uuidv4(),
      name: name,
      grammy: grammy,
    };

    const storage = await this.storage.getStorage();
    const artists: ArtistDto[] = storage.artists;
    artists.push(newArtist);

    await this.storage.updateStorage({ ...storage, artists });

    return newArtist;
  }

  async updateArtist(artistId: string, updateArtistDto: UpdateArtistDto) {
    if (!uuidValidate(artistId)) {
      throw new HttpException(
        'artistId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }

    const { name, grammy } = updateArtistDto;

    if (
      !name ||
      !grammy ||
      typeof name !== 'string' ||
      typeof grammy !== 'boolean'
    ) {
      throw new HttpException(
        "record with artistId doesn't exist",
        HttpStatus.BAD_REQUEST,
      );
    }

    const storage = await this.storage.getStorage();

    const artists = storage.artists.map((artist) => {
      if (artist.id === artistId) {
        return {
          ...artist,
          name: name,
          grammy: grammy,
        };
      }

      return artist;
    });

    await this.storage.updateStorage({ ...storage, artists });
  }

  async deleteArtist(artistId: string) {
    if (!uuidValidate(artistId)) {
      throw new HttpException(
        'artistId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }

    const storage = await this.storage.getStorage();

    if (!storage.artists.find(({ id }) => id === artistId)) {
      throw new HttpException(
        "record with artistId doesn't exist",
        HttpStatus.NOT_FOUND,
      );
    }

    const artists = storage.artists.filter(({ id }) => id !== artistId);

    await this.storage.updateStorage({ ...storage, artists });

    await this.trackService.deleteArtistFromTracks(artistId);
    await this.albumService.deleteArtistFromAlbums(artistId);
  }
}

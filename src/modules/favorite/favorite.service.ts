import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { FavoriteDto, FavoritesResponse } from './dto/favorite.dto';
import { DBStorage } from 'src/db/dataBase';
import { validate as uuidValidate } from 'uuid';
import { MEMORY_STORAGE } from 'src/helpers/consts';
import { TrackService } from '../track/track.service';
import { AlbumService } from '../album/album.service';
import { ArtistService } from '../artist/artist.service';
import { ArtistDto } from '../artist/dto/artist.dto';
import { AlbumDto } from '../album/dto/album.dto';
import { TrackDto } from '../track/dto/track.dto';

@Injectable()
export class FavoriteService {
  constructor(
    private readonly trackService: TrackService,
    private readonly albumService: AlbumService,
    private readonly artistService: ArtistService,
    @Inject(MEMORY_STORAGE) private readonly storage: DBStorage,
  ) {}

  async getAllFavorites(): Promise<FavoritesResponse> {
    const storage = await this.storage.getStorage();

    const artists: ArtistDto[] = (
      await this.artistService.getAllArtists()
    ).filter(({ id }) => storage.favorites.artists.includes(id));

    const albums: AlbumDto[] = (await this.albumService.getAllAlbums()).filter(
      ({ id }) => storage.favorites.albums.includes(id),
    );

    const tracks: TrackDto[] = (await this.trackService.getAllTracks()).filter(
      ({ id }) => storage.favorites.tracks.includes(id),
    );

    return { artists, albums, tracks };
  }

  async addTrackToFavorites(trackId: string) {
    if (!uuidValidate(trackId)) {
      throw new HttpException(
        'trackId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }

    const storage = await this.storage.getStorage();
    const trackById = storage.tracks.find(({ id }) => id === trackId);

    if (!trackById) {
      throw new HttpException(
        "track doesn't exist",
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const favorites: FavoriteDto = storage.favorites;
    favorites.tracks.push(trackId);

    await this.storage.updateStorage({ ...storage, favorites });
  }

  async deleteTrackFromFavorites(trackId: string) {
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
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const tracks = storage.favorites.tracks.filter((id) => id !== trackId);

    await this.storage.updateStorage({
      ...storage,
      favorites: { ...storage.favorites, tracks },
    });
  }

  async addAlbumToFavorites(albumId: string) {
    if (!uuidValidate(albumId)) {
      throw new HttpException(
        'albumId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }

    const storage = await this.storage.getStorage();
    const albumById = storage.albums.find(({ id }) => id === albumId);

    if (!albumById) {
      throw new HttpException(
        "album doesn't exist",
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const favorites: FavoriteDto = storage.favorites;
    favorites.albums.push(albumId);

    await this.storage.updateStorage({ ...storage, favorites });
  }

  async deleteAlbumFromFavorites(albumId: string) {
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
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const albums = storage.favorites.albums.filter((id) => id !== albumId);

    await this.storage.updateStorage({
      ...storage,
      favorites: { ...storage.favorites, albums },
    });
  }

  async addArtistToFavorites(artistId: string) {
    if (!uuidValidate(artistId)) {
      throw new HttpException(
        'artistId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }

    const storage = await this.storage.getStorage();
    const artistById = storage.artists.find(({ id }) => id === artistId);

    if (!artistById) {
      throw new HttpException(
        "artist doesn't exist",
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const favorites: FavoriteDto = storage.favorites;
    favorites.artists.push(artistId);

    await this.storage.updateStorage({ ...storage, favorites });
  }

  async deleteArtistFromFavorites(artistId: string) {
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
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const artists = storage.favorites.artists.filter((id) => id !== artistId);

    await this.storage.updateStorage({
      ...storage,
      favorites: { ...storage.favorites, artists },
    });
  }
}

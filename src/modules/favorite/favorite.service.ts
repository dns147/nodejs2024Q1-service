import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FavoritesResponse } from './dto/favorite.dto';
import { validate as uuidValidate, v4 as uuidv4 } from 'uuid';
import { ArtistDto } from '../artist/dto/artist.dto';
import { AlbumDto } from '../album/dto/album.dto';
import { TrackDto } from '../track/dto/track.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoriteService {
  constructor(private prisma: PrismaService) {}

  async getAllFavorites(): Promise<FavoritesResponse> {
    const storageArtists = await this.prisma.favorites.findMany({
      where: { type: 'artist' },
    });

    const artists: ArtistDto[] = await Promise.all(
      storageArtists.map(
        async ({ dataId }) =>
          await this.prisma.artist.findUnique({
            where: { id: dataId },
          }),
      ),
    );

    const storageAlbums = await this.prisma.favorites.findMany({
      where: { type: 'album' },
    });

    const albums: AlbumDto[] = await Promise.all(
      storageAlbums.map(
        async ({ dataId }) =>
          await this.prisma.album.findUnique({
            where: { id: dataId },
          }),
      ),
    );

    const storageTracks = await this.prisma.favorites.findMany({
      where: { type: 'track' },
    });

    const tracks: TrackDto[] = await Promise.all(
      storageTracks.map(
        async ({ dataId }) =>
          await this.prisma.track.findUnique({
            where: { id: dataId },
          }),
      ),
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

    const storage = await this.prisma.track.findMany();
    const trackById = storage.find(({ id }) => id === trackId);

    if (!trackById) {
      throw new HttpException(
        "track doesn't exist",
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const favorite = await this.prisma.favorites.findFirst({
      where: { dataId: trackId },
    });

    if (favorite === null) {
      const params = {
        id: uuidv4(),
        type: 'track',
        dataId: trackId,
      };

      await this.prisma.favorites.create({ data: params });
    }
  }

  async deleteTrackFromFavorites(trackId: string) {
    if (!uuidValidate(trackId)) {
      throw new HttpException(
        'trackId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }

    const favorite = await this.prisma.favorites.findFirst({
      where: {
        type: 'track',
        dataId: trackId,
      },
    });

    if (!favorite) {
      throw new HttpException(
        "record with trackId doesn't exist",
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    await this.prisma.favorites.deleteMany({
      where: {
        type: 'track',
        dataId: trackId,
      },
    });
  }

  async addAlbumToFavorites(albumId: string) {
    if (!uuidValidate(albumId)) {
      throw new HttpException(
        'albumId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }

    const storage = await this.prisma.album.findMany();
    const albumById = storage.find(({ id }) => id === albumId);

    if (!albumById) {
      throw new HttpException(
        "album doesn't exist",
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const favorite = await this.prisma.favorites.findFirst({
      where: { dataId: albumId },
    });

    if (favorite === null) {
      const params = {
        id: uuidv4(),
        type: 'album',
        dataId: albumId,
      };

      await this.prisma.favorites.create({ data: params });
    }
  }

  async deleteAlbumFromFavorites(albumId: string) {
    if (!uuidValidate(albumId)) {
      throw new HttpException(
        'albumId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }

    const favorite = await this.prisma.favorites.findFirst({
      where: {
        type: 'album',
        dataId: albumId,
      },
    });

    if (!favorite) {
      throw new HttpException(
        "record with albumId doesn't exist",
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    await this.prisma.favorites.deleteMany({
      where: {
        type: 'album',
        dataId: albumId,
      },
    });
  }

  async addArtistToFavorites(artistId: string) {
    if (!uuidValidate(artistId)) {
      throw new HttpException(
        'artistId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }

    const storage = await this.prisma.artist.findMany();
    const artistById = storage.find(({ id }) => id === artistId);

    if (!artistById) {
      throw new HttpException(
        "artist doesn't exist",
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const favorite = await this.prisma.favorites.findFirst({
      where: { dataId: artistId },
    });

    if (favorite === null) {
      const params = {
        id: uuidv4(),
        type: 'artist',
        dataId: artistId,
      };

      await this.prisma.favorites.create({ data: params });
    }
  }

  async deleteArtistFromFavorites(artistId: string) {
    if (!uuidValidate(artistId)) {
      throw new HttpException(
        'artistId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }

    const favorite = await this.prisma.favorites.findFirst({
      where: {
        type: 'artist',
        dataId: artistId,
      },
    });

    if (!favorite) {
      throw new HttpException(
        "record with artistId doesn't exist",
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    await this.prisma.favorites.deleteMany({
      where: {
        type: 'artist',
        dataId: artistId,
      },
    });
  }
}

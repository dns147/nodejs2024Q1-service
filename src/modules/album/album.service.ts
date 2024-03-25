import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AlbumDto, CreateAlbumDto, UpdateAlbumDto } from './dto/album.dto';
import { validate as uuidValidate, v4 as uuidv4 } from 'uuid';
import { TrackService } from '../track/track.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AlbumService {
  constructor(
    private readonly trackService: TrackService,
    private prisma: PrismaService,
  ) {}

  async getAllAlbums(): Promise<AlbumDto[]> {
    const storage = await this.prisma.album.findMany();

    return storage;
  }

  async getAlbumById(albumId: string): Promise<AlbumDto | undefined> {
    if (!uuidValidate(albumId)) {
      throw new HttpException(
        'albumId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }

    const storage = await this.prisma.album.findMany();
    const albumById = storage.find(({ id }) => id === albumId);

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

    await this.prisma.album.create({ data: newAlbum });

    return newAlbum;
  }

  async updateAlbum(
    albumId: string,
    updateAlbumDto: UpdateAlbumDto,
  ): Promise<AlbumDto> {
    if (!uuidValidate(albumId)) {
      throw new HttpException(
        'albumId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }

    const storage = await this.prisma.album.findMany();
    const albumById = storage.find(({ id }) => id === albumId);

    if (!albumById) {
      throw new HttpException("album doesn't exist", HttpStatus.NOT_FOUND);
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

    let updatedAlbum: AlbumDto;

    const albums = storage.map((album) => {
      if (album.id === albumId) {
        updatedAlbum = {
          ...album,
          name: name,
          year: year,
          artistId: artistId,
        };

        return updatedAlbum;
      }

      return album;
    });

    await this.prisma.album.update({
      where: { id: albumId },
      data: albums[0],
    });

    return updatedAlbum;
  }

  async deleteAlbum(albumId: string) {
    if (!uuidValidate(albumId)) {
      throw new HttpException(
        'albumId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }

    const storage = await this.prisma.album.findMany();

    if (!storage.find(({ id }) => id === albumId)) {
      throw new HttpException(
        "record with albumId doesn't exist",
        HttpStatus.NOT_FOUND,
      );
    }

    await this.prisma.album.delete({ where: { id: albumId } });

    await this.trackService.deleteAlbumFromTracks(albumId);
  }

  async deleteArtistFromAlbums(artistId: string) {
    const storage = await this.prisma.album.findMany();

    const albums = storage.map((album) => {
      if (album.artistId === artistId) {
        album.artistId = null;
      }

      return album;
    });

    await this.prisma.album.update({
      where: { id: artistId },
      data: albums[0],
    });
  }
}

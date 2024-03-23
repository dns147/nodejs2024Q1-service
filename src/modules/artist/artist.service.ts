import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ArtistDto, CreateArtistDto, UpdateArtistDto } from './dto/artist.dto';
import { validate as uuidValidate, v4 as uuidv4 } from 'uuid';
import { TrackService } from '../track/track.service';
import { AlbumService } from '../album/album.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ArtistService {
  constructor(
    private readonly trackService: TrackService,
    private readonly albumService: AlbumService,
    private prisma: PrismaService,
  ) {}

  async getAllArtists(): Promise<ArtistDto[]> {
    const storage = await this.prisma.artist.findMany();

    return storage;
  }

  async getArtistById(artistId: string): Promise<ArtistDto | undefined> {
    if (!uuidValidate(artistId)) {
      throw new HttpException(
        'artistId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }

    const storage = await this.prisma.artist.findMany();
    const artistById = storage.find(({ id }) => id === artistId);

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

    await this.prisma.artist.create({ data: newArtist });

    return newArtist;
  }

  async updateArtist(
    artistId: string,
    updateArtistDto: UpdateArtistDto,
  ): Promise<ArtistDto> {
    if (!uuidValidate(artistId)) {
      throw new HttpException(
        'artistId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }

    const storage = await this.prisma.artist.findMany();
    const artistById = storage.find(({ id }) => id === artistId);

    if (!artistById) {
      throw new HttpException("artist doesn't exist", HttpStatus.NOT_FOUND);
    }

    const { name, grammy } = updateArtistDto;

    if (!name || grammy === undefined || typeof name !== 'string') {
      throw new HttpException(
        "record with artistId doesn't exist",
        HttpStatus.BAD_REQUEST,
      );
    }

    let updatedArtists: ArtistDto;

    const artists = storage.map((artist) => {
      if (artist.id === artistId) {
        updatedArtists = {
          ...artist,
          name: name,
          grammy: grammy,
        };

        return updatedArtists;
      }

      return artist;
    });

    await this.prisma.artist.update({
      where: { id: artistId },
      data: artists,
    });

    return updatedArtists;
  }

  async deleteArtist(artistId: string) {
    if (!uuidValidate(artistId)) {
      throw new HttpException(
        'artistId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }

    const storage = await this.prisma.artist.findMany();

    if (!storage.find(({ id }) => id === artistId)) {
      throw new HttpException(
        "record with artistId doesn't exist",
        HttpStatus.NOT_FOUND,
      );
    }

    await this.prisma.artist.delete({ where: { id: artistId }});

    await this.trackService.deleteArtistFromTracks(artistId);
    await this.albumService.deleteArtistFromAlbums(artistId);
  }
}

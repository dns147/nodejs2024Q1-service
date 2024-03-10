import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AlbumDto, CreateAlbumDto, UpdateAlbumDto } from './dto/album.dto';
import { AlbumService } from './album.service';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Get()
  async getAllAlbums(): Promise<AlbumDto[]> {
    const albums = await this.albumService.getAllAlbums();

    return albums;
  }

  @Get(':id')
  async getAlbumById(@Param('id') id: string): Promise<AlbumDto | undefined> {
    const album = await this.albumService.getAlbumById(id);

    return album;
  }

  @Post()
  @HttpCode(201)
  async createAlbum(@Body() createAlbumDto: CreateAlbumDto): Promise<AlbumDto> {
    const album = await this.albumService.createAlbum(createAlbumDto);

    return album;
  }

  @Put(':id')
  async updateAlbum(
    @Param('id') id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ) {
    await this.albumService.updateAlbum(id, updateAlbumDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteAlbum(@Param('id') id: string) {
    await this.albumService.deleteAlbum(id);
  }
}

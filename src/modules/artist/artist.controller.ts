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
import { ArtistDto, CreateArtistDto, UpdateArtistDto } from './dto/artist.dto';
import { ArtistService } from './artist.service';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  async getAllArtists(): Promise<ArtistDto[]> {
    return await this.artistService.getAllArtists();
  }

  @Get(':id')
  async getArtistById(@Param('id') id: string): Promise<ArtistDto | undefined> {
    return await this.artistService.getArtistById(id);
  }

  @Post()
  @HttpCode(201)
  async createArtist(@Body() createArtistDto: CreateArtistDto): Promise<ArtistDto> {
    return await this.artistService.createArtist(createArtistDto);
  }

  @Put(':id')
  async updateArtist(
    @Param('id') id: string,
    @Body() updateArtistDto: UpdateArtistDto,
  ) {
    await this.artistService.updateArtist(id, updateArtistDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteArtist(@Param('id') id: string) {
    await this.artistService.deleteArtist(id);
  }
}

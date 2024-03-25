import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { FavoritesResponse } from './dto/favorite.dto';
import { FavoriteService } from './favorite.service';

@Controller('favs')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Get()
  async getAllFavorites(): Promise<FavoritesResponse> {
    return await this.favoriteService.getAllFavorites();
  }

  @Post('track/:id')
  @HttpCode(HttpStatus.CREATED)
  async addTrackToFavorites(@Param('id') id: string) {
    await this.favoriteService.addTrackToFavorites(id);
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTrackFromFavorites(@Param('id') id: string) {
    await this.favoriteService.deleteTrackFromFavorites(id);
  }

  @Post('album/:id')
  @HttpCode(HttpStatus.CREATED)
  async addAlbumToFavorites(@Param('id') id: string) {
    await this.favoriteService.addAlbumToFavorites(id);
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAlbumFromFavorites(@Param('id') id: string) {
    await this.favoriteService.deleteAlbumFromFavorites(id);
  }

  @Post('artist/:id')
  @HttpCode(HttpStatus.CREATED)
  async addArtistToFavorites(@Param('id') id: string) {
    await this.favoriteService.addArtistToFavorites(id);
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteArtistFromFavorites(@Param('id') id: string) {
    await this.favoriteService.deleteArtistFromFavorites(id);
  }
}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { TrackModule } from './modules/track/track.module';
import { AlbumModule } from './modules/album/album.module';
import { ArtistModule } from './modules/artist/artist.module';
import { FavoriteModule } from './modules/favorite/favorite.module';

@Module({
  imports: [UserModule, TrackModule, AlbumModule, ArtistModule, FavoriteModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

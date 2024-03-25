import { AlbumDto } from 'src/modules/album/dto/album.dto';
import { ArtistDto } from 'src/modules/artist/dto/artist.dto';
import { TrackDto } from 'src/modules/track/dto/track.dto';

export interface FavoriteDto {
  artists: string[]; // favorite artists ids
  albums: string[]; // favorite albums ids
  tracks: string[]; // favorite tracks ids
}

export interface FavoritesResponse {
  artists: ArtistDto[];
  albums: AlbumDto[];
  tracks: TrackDto[];
}

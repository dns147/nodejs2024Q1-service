import { MEMORY_STORAGE } from 'src/helpers/consts';
import { AlbumDto } from 'src/modules/album/dto/album.dto';
import { ArtistDto } from 'src/modules/artist/dto/artist.dto';
import { TrackDto } from 'src/modules/track/dto/track.dto';
import { UserDto } from 'src/modules/user/dto/user.dto';

export interface IStorage {
  users: UserDto[];
  tracks: TrackDto[];
  albums: AlbumDto[];
  artists: ArtistDto[];
}

export class DBStorage {
  storage: IStorage = {
    users: [],
    tracks: [],
    albums: [],
    artists: [],
  };

  async getStorage(): Promise<IStorage> {
    return new Promise((res) => {
      res(this.storage);
    });
  }

  async updateStorage(newStorage: IStorage) {
    this.storage = { ...newStorage };
  }
}

export const connectionStorage = {
  provide: MEMORY_STORAGE,
  useFactory: () => new DBStorage(),
};

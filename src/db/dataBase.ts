import { MEMORY_STORAGE } from 'src/helpers/consts';
import { AlbumDto } from 'src/modules/album/dto/album.dto';
import { ArtistDto } from 'src/modules/artist/dto/artist.dto';
import { FavoriteDto } from 'src/modules/favorite/dto/favorite.dto';
import { TrackDto } from 'src/modules/track/dto/track.dto';
import { UserDto } from 'src/modules/user/dto/user.dto';

export interface IStorage {
  users: UserDto[];
  tracks: TrackDto[];
  albums: AlbumDto[];
  artists: ArtistDto[];
  favorites: FavoriteDto;
}

export class DBStorage {
  private static instance: DBStorage;

  storage: IStorage = {
    users: [],
    tracks: [],
    albums: [],
    artists: [],
    favorites: {
      artists: [],
      albums: [],
      tracks: [],
    },
  };

  public static getInstance(): DBStorage {
    if (!this.instance) {
      this.instance = new DBStorage();
    }

    return this.instance;
  }

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
  useFactory: () => DBStorage.getInstance(),
};

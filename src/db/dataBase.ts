import { MEMORY_STORAGE } from 'src/helpers/consts';
import { TrackDto } from 'src/modules/track/dto/track.dto';
import { UserDto } from 'src/modules/user/dto/user.dto';

export interface IStorage {
  users: UserDto[];
  tracks: TrackDto[];
}

export class DBStorage {
  storage: IStorage = {
    users: [],
    tracks: [],
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

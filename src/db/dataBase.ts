import { MEMORY_STORAGE } from "src/helpers/consts";
import { UserDto } from "src/modules/user/dto/user.dto";

export interface IStorage {
  users: UserDto[];
}

export class DBStorage {
  storage: IStorage = {
    users: [],
  };

  async getStorage(): Promise<IStorage> {
    return new Promise((res, _rej) => {
      res(this.storage);
    });
  }

  async updateStorage(users: UserDto[]) {
    const storage = await this.getStorage();
    this.storage = { ...storage, users };
  }
};

export const connectionStorage = {
  provide: MEMORY_STORAGE,
  useFactory: () => new DBStorage(),
};

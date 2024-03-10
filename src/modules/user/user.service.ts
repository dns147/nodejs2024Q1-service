import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
  CreateUserDto,
  UpdatePasswordDto,
  UserDto,
  UserResponseDto,
} from './dto/user.dto';
import { DBStorage } from 'src/db/dataBase';
import { validate as uuidValidate, v4 as uuidv4 } from 'uuid';
import { getTimestamp } from 'src/helpers/utils';
import { MEMORY_STORAGE } from 'src/helpers/consts';

@Injectable()
export class UserService {
  constructor(@Inject(MEMORY_STORAGE) private readonly storage: DBStorage) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserDto> {
    const { login, password } = createUserDto;

    if (
      !login ||
      !password ||
      typeof login !== 'string' ||
      typeof password !== 'string'
    ) {
      throw new HttpException(
        "body doesn't contain required fields",
        HttpStatus.BAD_REQUEST,
      );
    }

    const timestamp = getTimestamp();
    const newUser: UserDto = {
      id: uuidv4(),
      login: login,
      password: password,
      version: 1,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const storage = await this.storage.getStorage();
    const users: UserDto[] = storage.users;
    users.push(newUser);

    await this.storage.updateStorage({ ...storage, users });

    return newUser;
  }

  async getAllUsers(): Promise<UserDto[]> {
    const storage = await this.storage.getStorage();

    return storage.users;
  }

  async getUserById(userId: string): Promise<UserDto | undefined> {
    if (!uuidValidate(userId)) {
      throw new HttpException(
        'userId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }

    const storage = await this.storage.getStorage();
    const userById = storage.users.find(({ id }) => id === userId);

    if (!userById) {
      throw new HttpException("user doesn't exist", HttpStatus.NOT_FOUND);
    }

    return userById;
  }

  async updatePassword(userId: string, updatePasswordDto: UpdatePasswordDto) {
    if (!uuidValidate(userId)) {
      throw new HttpException(
        'userId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }

    const { oldPassword, newPassword } = updatePasswordDto;

    if (
      !oldPassword ||
      !newPassword ||
      typeof oldPassword !== 'string' ||
      typeof newPassword !== 'string'
    ) {
      throw new HttpException(
        "record with userId doesn't exist",
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.getUserById(userId);

    if (!(user.password === oldPassword)) {
      throw new HttpException('oldPassword is wrong', HttpStatus.FORBIDDEN);
    }

    const storage = await this.storage.getStorage();

    const users = storage.users.map((user) => {
      if (user.id === userId) {
        return {
          ...user,
          password: newPassword,
          updatedAt: getTimestamp(),
          version: user.version + 1,
        };
      } else {
        return user;
      }
    });

    await this.storage.updateStorage({ ...storage, users });
  }

  async deleteUser(userId: string) {
    if (!uuidValidate(userId)) {
      throw new HttpException(
        'userId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }

    const storage = await this.storage.getStorage();

    if (!storage.users.find(({ id }) => id === userId)) {
      throw new HttpException(
        "record with userId doesn't exist",
        HttpStatus.NOT_FOUND,
      );
    }

    const users = storage.users.filter(({ id }) => id !== userId);

    await this.storage.updateStorage({ ...storage, users });
  }

  getResponseUser(user: UserDto): UserResponseDto {
    const { id, login, version, createdAt, updatedAt } = user;

    return { id, login, version, createdAt, updatedAt };
  }
}

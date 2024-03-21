import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  CreateUserDto,
  UpdatePasswordDto,
  UserDto,
  UserResponseDto,
} from './dto/user.dto';
import { validate as uuidValidate, v4 as uuidv4 } from 'uuid';
import { getTimestamp } from 'src/helpers/utils';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

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

    await this.prisma.user.create({ data: newUser });

    return newUser;
  }

  async getAllUsers(): Promise<UserDto[]> {
    const storage = await this.prisma.user.findMany();

    return storage;
  }

  async getUserById(userId: string): Promise<UserDto | undefined> {
    if (!uuidValidate(userId)) {
      throw new HttpException(
        'userId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }

    const storage = await this.prisma.user.findMany();
    const userById = storage.find(({ id }) => id === userId);

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

    const userUpdate = {
      password: newPassword,
      updatedAt: getTimestamp(),
      version: user.version + 1,
    };

    await this.prisma.user.update({
      where: { id: userId },
      data: userUpdate,
    });
  }

  async deleteUser(userId: string) {
    if (!uuidValidate(userId)) {
      throw new HttpException(
        'userId is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }

    const storage = await this.prisma.user.findMany();

    if (!storage.find(({ id }) => id === userId)) {
      throw new HttpException(
        "record with userId doesn't exist",
        HttpStatus.NOT_FOUND,
      );
    }

    await this.prisma.user.delete({ where: { id: userId }});
  }

  getResponseUser(user: UserDto): UserResponseDto {
    const { id, login, version, createdAt, updatedAt } = user;

    return { id, login, version, createdAt, updatedAt };
  }
}

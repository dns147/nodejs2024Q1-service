import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  CreateUserDto,
  UpdatePasswordDto,
  UserResponseDto,
} from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers(): Promise<UserResponseDto[]> {
    const users = await this.userService.getAllUsers();

    users.map((user) => {
      const { id, login, version, createdAt, updatedAt } = user;
      const userResponse: UserResponseDto = {
        id,
        login,
        version,
        createdAt,
        updatedAt,
      };

      return userResponse;
    });

    return users;
  }

  @Get(':id')
  async getUserById(
    @Param('id') id: string,
  ): Promise<UserResponseDto | undefined> {
    const user = await this.userService.getUserById(id);

    return this.userService.getResponseUser(user);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto);

    return this.userService.getResponseUser(user);
  }

  @Put(':id')
  async updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<UserResponseDto> {
    await this.userService.updatePassword(id, updatePasswordDto);

    const user = await this.userService.getUserById(id);

    return this.userService.getResponseUser(user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id') id: string) {
    await this.userService.deleteUser(id);
  }
}

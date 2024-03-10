import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { connectionStorage } from 'src/db/dataBase';

@Module({
  controllers: [UserController],
  providers: [UserService, connectionStorage],
})
export class UserModule {}

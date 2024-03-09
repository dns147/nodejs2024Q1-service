import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT;
  
  await app.listen(port);

  console.log(`Server is listening http://localhost:${port}`);
}

bootstrap();

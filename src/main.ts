import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { readFileSync } from 'fs';
import { parse } from 'yaml';
import { serve, setup } from 'swagger-ui-express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT;

  //const config = new DocumentBuilder()
    // .setTitle('Service')
    // .setDescription('REST Service')
    // .setVersion('1.0')
    // .addTag('Service')
    // .build();

  //const document = SwaggerModule.createDocument(app, config);
  
  const file = readFileSync('./doc/api.yaml', 'utf8');
  const swaggerDocument = parse(file);

  //SwaggerModule.setup('api', app, document);

  app.use('/api-docs', serve, setup(swaggerDocument));

  await app.listen(port);

  console.log(`Server is listening http://localhost:${port}`);
  console.log(`You can use swagger http://localhost:${port}/api-docs`);
}

bootstrap();

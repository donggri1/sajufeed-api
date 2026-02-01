import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

// main.ts는 NestJS 애플리케이션의 진입점입니다.
// AppModule을 불러와서 애플리케이션을 생성하고 지정된 포트에서 서버를 시작합니다.

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
  .setTitle('Sajufeed API')
  .setDescription('The Sajufeed API description')
    .setVersion('1.0')
    .addTag('sajufeed')
  .build();

  const document = SwaggerModule.createDocument(app,config);
  SwaggerModule.setup('api',app,document);



  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

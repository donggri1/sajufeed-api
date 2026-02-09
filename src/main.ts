import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
// main.ts는 NestJS 애플리케이션의 진입점입니다.
// AppModule을 불러와서 애플리케이션을 생성하고 지정된 포트에서 서버를 시작합니다.

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true, //쿠키 헤더 주고받는허용
  });
  app.use(cookieParser());

  app.use(
    session({
      resave: false, // 요청이 올 때 세션에 수정사항이 없어도 다시 저장할지 여부
      saveUninitialized: false, // 초기화되지 않은 세션을 저장할지 여부
      secret: process.env.COOKIE_SECRET || 'secret', // 쿠키 암호화 키 (환경변수 권장)
      cookie: {
        httpOnly: true, // 자바스크립트로 쿠키 접근 불가 (보안)
      },
    }),
  );

  app.use(passport.initialize())
  app.use(passport.session())

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

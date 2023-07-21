import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpResponse } from './api/http.response';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('실용적인 테스트 예제')
    .setDescription('API 목록')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [HttpResponse],
  });
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
}

bootstrap()
  .then(() => {
    // TODO: 서버 실행 성공 로그
  })
  .catch((err) => {
    // TODO: 우아하게 종료 + 프로세스 재시작
  });

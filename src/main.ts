import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    // 클라에서 보낸 데이터 요소 중에 dto에 필요없는 것은 넣질 않는다.
    whitelist: true,
    // 클라에서 보낸 데이터 요소중에 없는 것을 명시한다.
    forbidNonWhitelisted: true,
    // 들어오는 param 형태를 string이 아닌 number로 들어오게 한다.
    transform: true,
  }));
  await app.listen(3000);
}
bootstrap();

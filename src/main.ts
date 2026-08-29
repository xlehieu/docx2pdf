import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: true });
  app.enableCors();
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Mở trình duyệt: http://localhost:${port}  để upload và convert docx -> pdf`);
  console.log(`(API cũ vẫn dùng được: POST http://localhost:${port}/convert)`);
}
bootstrap();

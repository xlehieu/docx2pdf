import { Module } from '@nestjs/common';
import { ConvertModule } from './convert/convert.module';
import { ViewsModule } from './views/views.module';

@Module({
  imports: [ConvertModule, ViewsModule],
})
export class AppModule {}

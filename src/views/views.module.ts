import { Module } from '@nestjs/common';
import { ViewsController } from './views.controller';
import { ConvertModule } from '../convert/convert.module';

@Module({
  imports: [ConvertModule],
  controllers: [ViewsController],
})
export class ViewsModule {}

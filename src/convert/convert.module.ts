import { Module } from '@nestjs/common';
import { ConvertController } from './convert.controller';
import { ConvertService } from './convert.service';
import { PdfController } from './pdf.controller';
import { PdfService } from './pdf.service';

@Module({
  controllers: [ConvertController, PdfController],
  providers: [ConvertService, PdfService],
  exports: [ConvertService, PdfService],
})
export class ConvertModule {}

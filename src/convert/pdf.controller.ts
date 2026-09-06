import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { PdfService, CopyPdfResult } from './pdf.service';

export class CopyPdfDto {
  sourcePath: string;
  password: string;
  outputDir?: string;
}

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Post('copy')
  async copy(@Body() body: CopyPdfDto): Promise<CopyPdfResult> {
    try {
      return await this.pdfService.copyProtectedPdf(
        body?.sourcePath,
        body?.password,
        body?.outputDir,
      );
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
}
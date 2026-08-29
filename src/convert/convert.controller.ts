import { Body, Controller, Post } from '@nestjs/common';
import { ConvertService, ConvertResult } from './convert.service';

export class ConvertDto {
  files: string[]; // mảng đường dẫn file .docx
  outputDir?: string; // thư mục lưu pdf, mặc định ./output
}

@Controller('convert')
export class ConvertController {
  constructor(private readonly convertService: ConvertService) {}

  @Post()
  async convert(@Body() body: ConvertDto): Promise<{ results: ConvertResult[] }> {
    const outputDir = body.outputDir || './output';
    const results = await this.convertService.convertMany(body.files, outputDir);
    return { results };
  }
}

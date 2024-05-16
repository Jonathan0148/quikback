import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from '../../utils/media.handle';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard';

@ApiBearerAuth()
@ApiTags('upload')
@UseGuards(JwtAuthGuard)
@Controller('upload')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', {storage}))
  async upload(@UploadedFile() file:Express.Multer.File) {
    return this.fileService.upload(file);
  }
}
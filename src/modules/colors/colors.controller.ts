import { Controller, Get, Post, Body, Put, Param, Delete, ParseIntPipe, UsePipes, ValidationPipe, UseGuards, HttpCode, Query } from '@nestjs/common';
import { ColorsService } from './colors.service';
import { CreateColorDto } from './dto/create-color.dto';
import { ApiPaginatedResponse } from 'src/config/constanst';
import { PageOptionsDto } from 'src/dtos-globals/page-options.dto';
import { PageDto } from 'src/dtos-globals/page.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard';

@ApiBearerAuth()
@ApiTags('colors')
@UseGuards(JwtAuthGuard)
@Controller('colors')
export class ColorsController {
  constructor(private readonly colorsService: ColorsService) {}
  @Get()
  @HttpCode(200)
  @ApiPaginatedResponse(CreateColorDto)
  async findAll(@Query() pageOptionsDto: PageOptionsDto): Promise<PageDto<CreateColorDto>> {
    return this.colorsService.findAll(pageOptionsDto);
  }

  @HttpCode(200)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.colorsService.findOne(id);
  }

  @HttpCode(201)
  @Post()
  @UsePipes(new ValidationPipe({whitelist: true}))
  async create(@Body() dto: CreateColorDto) {
    return await this.colorsService.create(dto);
  }

  @HttpCode(201)
  @UsePipes(new ValidationPipe({whitelist: true}))
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateColorDto) {
    return await this.colorsService.update(id, dto);
  }

  @HttpCode(200)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.colorsService.remove(id);
  }
}
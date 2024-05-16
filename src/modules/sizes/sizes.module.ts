import { Module } from '@nestjs/common';
import { SizesService } from './sizes.service';
import { SizesController } from './sizes.controller';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Size } from './entities/size.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Size])
  ],
  controllers: [SizesController],
  providers: [SizesService, JwtService],
})
export class SizesModule {}

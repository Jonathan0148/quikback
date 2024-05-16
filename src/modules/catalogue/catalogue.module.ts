import { Module } from '@nestjs/common';
import { CatalogueService } from './catalogue.service';
import { CatalogueController } from './catalogue.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Catalogue } from './entities/catalogue.entity';
import { JwtStrategy } from 'src/jwt/jwt.strategy';
import { ColorCatalogue } from './entities/colors-catalogue.entity';
import { ImageCatalogue } from './entities/images-catalogue.entity';
import { StockSize } from './entities/stock-sizes.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Catalogue, ImageCatalogue, ColorCatalogue, StockSize])
  ],
  controllers: [CatalogueController],
  providers: [CatalogueService, JwtStrategy],
})
export class CatalogueModule {}

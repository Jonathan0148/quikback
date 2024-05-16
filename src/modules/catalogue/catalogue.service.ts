import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCatalogueDto } from './dto/create-catalogue.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageOptionsDto } from 'src/dtos-globals/page-options.dto';
import { PageDto } from 'src/dtos-globals/page.dto';
import { PageMetaDto } from 'src/dtos-globals/page-meta.dto';
import { Catalogue } from './entities/catalogue.entity';
import { ImageCatalogue } from './entities/images-catalogue.entity';
import { ColorCatalogue } from './entities/colors-catalogue.entity';
import { StockSize } from './entities/stock-sizes.entity';

@Injectable()
export class CatalogueService {
  constructor(
    @InjectRepository(Catalogue) private catalogueRepository: Repository<Catalogue>,
    @InjectRepository(ImageCatalogue) private imageCatalogueRepository: Repository<ImageCatalogue>,
    @InjectRepository(ColorCatalogue) private colorCatalogueRepository: Repository<ColorCatalogue>,
    @InjectRepository(StockSize) private stockSizeRepository: Repository<StockSize>
  ) { }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<any>> {
    const queryBuilder = this.catalogueRepository.createQueryBuilder("catalogue")
      .leftJoinAndSelect('catalogue.user', 'user')
      .leftJoinAndSelect('catalogue.imageCatalogue', 'imageCatalogue')
      // .leftJoinAndSelect('catalogue.colorCatalogue', 'colorCatalogue')
      // .leftJoinAndSelect('colorCatalogue.stockSize', 'stockSize')
      .andWhere(qb => {
        qb.where('(catalogue.name LIKE :term)', {
          term: `%${pageOptionsDto.term}%`
        })
      })
      .orderBy("catalogue.id", pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);


    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: number) {
    const data = await this.catalogueRepository.createQueryBuilder("catalogue")
      .leftJoinAndSelect('catalogue.user', 'user')
      .leftJoinAndSelect('catalogue.imageCatalogue', 'imageCatalogue')
      // .leftJoinAndSelect('catalogue.colorCatalogue', 'colorCatalogue')
      // .leftJoinAndSelect('colorCatalogue.stockSize', 'stockSize')
      .where("catalogue.id= :id", { id: id })
      .getOne();

    if (!data) throw new NotFoundException('No existe un catálogo con el id '+id);

    return data;
  }

  async create(dto: CreateCatalogueDto): Promise<Catalogue | any> {
    const data = this.catalogueRepository.create({
      user_id: dto.user_id,
      name: dto.name,
      description: dto.description,
      price: dto.price
    });

    await this.catalogueRepository.save(data);

    if (dto.imageCatalogue.length) this.createImagesCatalogue(data.id, dto.imageCatalogue);

    this.createColorsCatalogue(data.id, dto.colorCatalogue);

    return {message: 'Catálogo registrado exitosamente'};
  }

  async update(id: number, dto: CreateCatalogueDto): Promise<any> {
    const data = await this.findOne(id);
  
    if (!data) throw new NotFoundException({ message: 'No existe el catálogo solicitado' });
  
    await this.catalogueRepository.update(id, {
      user_id: dto.user_id,
      name: dto.name,
      description: dto.description,
      price: dto.price
    });
  
    await this.deleteImagesCatalogue(id);
    await this.createImagesCatalogue(data.id, dto.imageCatalogue);
  
    await this.deleteColorsCatalogue(id);
    await this.createColorsCatalogue(data.id, dto.colorCatalogue);
  
    return { message: 'Catálogo actualizado exitosamente' };
  }  

  private async createImagesCatalogue(catalogueId: number, images: string[]) {
    for (const image of images) {
      const imageCreate = this.imageCatalogueRepository.create({
        catalogue_id: catalogueId,
        url: image
      });

      await this.imageCatalogueRepository.save(imageCreate);
    }
  }

  private async createColorsCatalogue(catalogueId: number, colors: any[]) {
    for (const color of colors) {
      const colorCreate = this.colorCatalogueRepository.create({
        catalogue_id: catalogueId,
        color_id: color.color_id
      });

      await this.colorCatalogueRepository.save(colorCreate);

      await this.createStockSizes(colorCreate.id, color.stockSize);
    }
  }

  private async createStockSizes(colorCatalogueId: number, sizes: any[]) {
    for (const size of sizes) {
      const stockSizeCreate = this.stockSizeRepository.create({
        color_catalogue_id: colorCatalogueId,
        size_id: size.size_id,
        stock: size.stock
      });

      await this.stockSizeRepository.save(stockSizeCreate);
    }
  }

  private async deleteImagesCatalogue(catalogueId: number) {
    const imageCatalogue = await this.imageCatalogueRepository.createQueryBuilder('imageCatalogue')
      .where({ catalogue_id: catalogueId })
      .getMany();
    
    for (const image of imageCatalogue) {
      await this.imageCatalogueRepository.delete({ id: image.id });
    }
  }  

  private async deleteColorsCatalogue(catalogueId: number) {
    const colorCatalogue = await this.colorCatalogueRepository.createQueryBuilder('colorCatalogue')
      .where({ catalogue_id: catalogueId })
      .getMany();

    for (const color of colorCatalogue) {
      await this.deleteStockSize(color.id);
      await this.colorCatalogueRepository.delete({ id: color.id });
    }
  }

  private async deleteStockSize(catalogueId: number) {
    const stockSize = await this.stockSizeRepository.createQueryBuilder('stockSize')
      .where({ color_catalogue_id: catalogueId })
      .getMany();

    for (const stock of stockSize) {
      await this.stockSizeRepository.delete({ id: stock.id });
    }
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.deleteImagesCatalogue(id);
    await this.deleteColorsCatalogue(id);

    await this.catalogueRepository.delete(id);

    return {message: 'Catálogo eliminado exitosamente'};
  }
}
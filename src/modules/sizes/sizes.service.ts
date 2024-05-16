import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSizeDto } from './dto/create-size.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageOptionsDto } from 'src/dtos-globals/page-options.dto';
import { PageDto } from 'src/dtos-globals/page.dto';
import { PageMetaDto } from 'src/dtos-globals/page-meta.dto';
import { Size } from './entities/size.entity';

@Injectable()
export class SizesService {
  constructor(
    @InjectRepository(Size) private sizeRepository: Repository<Size>
  ) { }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<Size>> {
    const queryBuilder = this.sizeRepository.createQueryBuilder("size")
      .andWhere(qb => {
        qb.where('(size.name LIKE :term)', {
          term: `%${pageOptionsDto.term}%`
        })
      })
      .orderBy("size.id", pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);


    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: number) {
    const data = await this.sizeRepository.createQueryBuilder("size")
      .where("size.id= :id", { id: id })
      .getOne();

    if (!data) throw new NotFoundException('No existe una talla con el id '+id);

    return data;
  }

  async findByName(name: string): Promise<Size> {
    return await this.sizeRepository.findOneBy({name})
  }

  async create(dto: CreateSizeDto): Promise<Size | any> {
    const exists = await this.findByName(dto.name);
    if (exists) throw new NotFoundException('Ya existe la talla '+dto.name);

    const data = this.sizeRepository.create(dto);
    await this.sizeRepository.save(data);

    return {message: 'Talla registrada exitosamente'};
  }

  async update(id:number, dto: CreateSizeDto): Promise<any> {
    const data = await this.findOne(id);

    if (!data) throw new NotFoundException({message: 'No existe la talla solicitada'});
    
    const exists = await this.findByName(dto.name);
    if (exists) throw new NotFoundException('Ya existe la talla '+dto.name);

    await this.sizeRepository.update(id, dto);

    return {message: 'Talla actualizada exitosamente'};
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.sizeRepository.delete(id);

    return {message: 'Talla eliminada exitosamente'};
  }
}
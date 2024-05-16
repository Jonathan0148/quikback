import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateColorDto } from './dto/create-color.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageOptionsDto } from 'src/dtos-globals/page-options.dto';
import { PageDto } from 'src/dtos-globals/page.dto';
import { PageMetaDto } from 'src/dtos-globals/page-meta.dto';
import { Color } from './entities/color.entity';

@Injectable()
export class ColorsService {
  constructor(
    @InjectRepository(Color) private colorRepository: Repository<Color>
  ) { }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<Color>> {
    const queryBuilder = this.colorRepository.createQueryBuilder("color")
      .andWhere(qb => {
        qb.where('(color.name LIKE :term)', {
          term: `%${pageOptionsDto.term}%`
        })
      })
      .orderBy("color.id", pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);


    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: number) {
    const data = await this.colorRepository.createQueryBuilder("color")
      .where("color.id= :id", { id: id })
      .getOne();

    if (!data) throw new NotFoundException('No existe un color con el id '+id);

    return data;
  }

  async findByName(name: string): Promise<Color> {
    return await this.colorRepository.findOneBy({name})
  }

  async create(dto: CreateColorDto): Promise<Color | any> {
    const exists = await this.findByName(dto.name);
    if (exists) throw new NotFoundException('Ya existe el color '+dto.name);

    const data = this.colorRepository.create(dto);
    await this.colorRepository.save(data);

    return {message: 'Color registrado exitosamente'};
  }

  async update(id:number, dto: CreateColorDto): Promise<any> {
    const data = await this.findOne(id);

    if (!data) throw new NotFoundException({message: 'No existe el color solicitado'});
    
    const exists = await this.findByName(dto.name);
    if (exists) throw new NotFoundException('Ya existe el color '+dto.name);

    await this.colorRepository.update(id, dto);

    return {message: 'Color actualizado exitosamente'};
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.colorRepository.delete(id);

    return {message: 'Color eliminado exitosamente'};
  }
}
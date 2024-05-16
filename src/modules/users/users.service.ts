import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserLoginDto } from 'src/dtos-globals/user-login.dto';
import { PageOptionsDto } from 'src/dtos-globals/page-options.dto';
import { User } from './entities/user.entity';
import { PageDto } from 'src/dtos-globals/page.dto';
import { PageMetaDto } from 'src/dtos-globals/page-meta.dto';
import { hash, compare } from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>
  ) { }
  
  async changePassword(changePasswordDto: ChangePasswordDto){
    const { user_id, currentPassword, newPassword, repetPassword } = changePasswordDto;
    const userInfo = await this.userRepository.findOneBy({id: user_id});

    const checkPassword = await compare(currentPassword, (await userInfo).password);
    if (!checkPassword) throw new HttpException('Contraseña incorrecta', 403);

    if (newPassword !== repetPassword) throw new HttpException('Contraseñas no coinciden', 403);

    const hashPassword = await hash(newPassword, 10);
    await this.userRepository.update(user_id, 
      {
        password:hashPassword
      });
    
    return {message: 'Contraseña cambiada exitosamente'};
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<User>> {
    const queryBuilder = await this.userRepository.createQueryBuilder("users")
      .leftJoinAndSelect('users.role', 'role')
      .andWhere(qb => {
        qb.where('(users.name LIKE :name OR users.email LIKE :email)', {
          name: `%${pageOptionsDto.term}%`,
          email: `%${pageOptionsDto.term}%`
        })
      })
      .orderBy("users.id", pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);
  
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
  
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
  
    return new PageDto(entities, pageMetaDto);
  }    

  async findOne(id: number) {
    const data = await this.userRepository.createQueryBuilder("users")
      .leftJoinAndSelect('users.role', 'role')
      .where("users.id= :id", { id: id })
      .getOne();

    if (!data) throw new NotFoundException('No existe el usuario con el id '+id);
    return data;
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOneBy({email})
  }

  async findByEmailRestric(email: string, id: number): Promise<User> {
    return await this.userRepository.createQueryBuilder('user')
      .where({ email: email})
      .andWhere('user.id <> :id', { id: id })
      .getOne();
  }  

  async create(dto: CreateUserDto): Promise<User | any> {
    const existsEmail = await this.findByEmail(dto.email);
    if (existsEmail) throw new NotFoundException('Ya existe un usuario con el correo ingresado');

    const { password } = dto;
    const plainToHash = await hash(password, 10);
    const dtoCreate = {
      ...dto, 
      password:plainToHash
    };
    
    const data = this.userRepository.create(dtoCreate);
    await this.userRepository.save(data);

    return {message: '¡Usuario registrado!, ahora puede iniciar sesión'};
  }

  async update(id:number, dto: UpdateUserDto): Promise<any> {
    const data = await this.findOne(id);

    if (!data) throw new NotFoundException({message: 'No existe el usuario solicitado'});

    const existsEmail = await this.findByEmailRestric(dto.email, id);
    if (existsEmail) throw new NotFoundException('Ya existe un usuario con el correo ingresado');

    await this.userRepository.update(id, {
      name: dto.name,
      role_id: dto.role_id,
      phone: dto.phone,
      avatar: dto.avatar,
      is_active: dto.is_active
    });

    return {message: 'Usuario actualizado exitosamente'};
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.userRepository.delete(id);

    return {message: 'Usuario eliminado exitosamente'};
  }
}
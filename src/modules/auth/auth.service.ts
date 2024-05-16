import { HttpException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { Role } from '../users/entities/role.entity';
import { RecoverPassDto } from './dto/recover-pass.dto';
import { SendGridService } from '@anchan828/nest-sendgrid';
import * as moment from 'moment';
import 'moment-timezone';
import { ValidateCode } from './dto/validate-code.dto';
import { RestorePassDto } from './dto/restore-pass.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        private jwtService:JwtService,
        private readonly sendGrid: SendGridService
    ) { }

    async findByEmail(email: string): Promise<User> {
      return await this.userRepository.createQueryBuilder('user')
        .leftJoinAndSelect('user.role', 'role')
        .where({email: email})
        .getOne();
    }

    async login(userObject: LoginAuthDto) {
      const { email, password, loginRole } = userObject;
      
      const findUser = await this.findByEmail(email);
      if (!findUser) throw new NotFoundException('No existe un usuario con ese correo');
      
      const checkPassword = await compare(password, (await findUser).password);
      if (!checkPassword) throw new HttpException('Contraseña incorrecta', 403)

      if (loginRole == 'cliente' && findUser.role_id == 4) {
        throw new NotFoundException('No existe un cliente con ese correo');
      }
      if (loginRole == 'emprendedor' && findUser.role_id == 3) {
        throw new NotFoundException('No existe un emprendedor con ese correo');
      }

      const payload = { id: (await findUser).id, name: (await findUser.name), role: (await findUser.role.description), email: (await findUser.email), phone: (await findUser.phone), avatar: (await findUser.avatar)}
      const token = this.jwtService.sign(payload);
      const data = {
        token
      };
      
      return data;
    }

    async recoverPass(userObject: RecoverPassDto){
      const { email } = userObject;
  
      const findUser = await this.findByEmail(email);
      if (!findUser) throw new NotFoundException('No existe un usuario con ese email');

      findUser.code_pass = this.generateCode().toString();
      const utcDate = moment.utc();
      const localDate = utcDate.clone().tz('America/Bogota');
      findUser.date_code = localDate.format('YYYY-MM-DD HH:mm:ss');

      this.userRepository.save(findUser);
  
      this.sendEmailLink(findUser.email, findUser.name, findUser.code_pass);
      
      const hiddenMail = this.hiddenMail(findUser.email);
      return {message: `Por favor ingresa el código de confirmación enviado a <b>${hiddenMail}</b>`};
    }

    private generateCode(): string {
      const randomNumber = Math.floor(Math.random() * 10000);
      const paddedCode = randomNumber.toString().padStart(4, '0');
      return paddedCode;
  }

    private async sendEmailLink(email:string, name:string, code_pass:string) {
      await this.sendGrid.send({
        to: email,
        from: process.env.FROM_EMAIL,
        subject: "Restablecimiento de Clave",
        html: `<p>Estimado <strong>${name}</strong></p><br>
        <p>Usted ha solicitado el restablecimiento de su contraseña en QUIK. Para restablecer su contraseña debe de digitar el código:</p><br>
        ${code_pass}<br><br>
        <p><b>Importante: </b>Ten en cuenta que el código de verificación tiene una validez de 15 minutos. Pasado este tiempo, el código expirará y necesitarás solicitar uno nuevo para completar tu proceso de verificación</p><br><br>
        <p>Cordial saludo.</p>`,
      });
    }
  
    private hiddenMail(email: string){
      const hiddenCharacters = 3;
      return email.replace(/[a-z0-9\-_.]+@/ig, (c) => c.substr(0, hiddenCharacters) + c.split('').slice(hiddenCharacters, -1).map(v => '*').join('') + '@');
    }

    async validateCode(validateCode:ValidateCode){
      const { email, code } = validateCode;
  
      const findUser = await this.findByEmail(email);
      if (!findUser) throw new NotFoundException('No existe un usuario con ese email');

      const utcDate = moment.utc();
      const localDate = utcDate.clone().tz('America/Bogota');
      const date = localDate.format('YYYY-MM-DD HH:mm:ss');

      const isValid = this.validateHourDifference(findUser.date_code, date);

      if (!isValid) throw new NotFoundException('El código ha expirado');
  
      if (code !== findUser.code_pass) throw new NotFoundException('El código digitado no es el correcto')
  
      return {message: 'Los códigos coinciden'};
    }

    private validateHourDifference(consult: string, actual: string): boolean {
      const consultationDate = new Date(consult);
      const currentDate = new Date(actual);
  
      const timeDifferenceInMs = currentDate.getTime() - consultationDate.getTime();
      const timeDifferenceInMin = timeDifferenceInMs / (1000 * 60);
  
      return timeDifferenceInMin <= 15;
    }
  
    async restorePass(restorePass: RestorePassDto){
      const { email, newPassword, passwordConfirmation} = restorePass;
      
      const findUser = await this.findByEmail(email);
      if (!findUser) throw new NotFoundException('No existe un usuario con ese email');
  
      if (newPassword !== passwordConfirmation) throw new NotFoundException('Las contraseñas no coinciden');
  
      const plainToHash = await hash(newPassword, 10);
      findUser.password = plainToHash;
      findUser.code_pass = null;
      findUser.date_code = null;
      this.userRepository.save(findUser);
  
      return {message: 'Su contraseña se ha cambiado exitosamente, ahora puede iniciar sesión'};
    }
}
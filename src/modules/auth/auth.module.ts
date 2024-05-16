import { Logger, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { Role } from '../users/entities/role.entity';
import { SendGridModule } from '@anchan828/nest-sendgrid';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
    TypeOrmModule.forFeature([User, Role]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '2h' },
    }),
    SendGridModule.forRoot({
      apikey: process.env.SEND_GRID_ACCESS_KEY
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, Logger],
})
export class AuthModule {}

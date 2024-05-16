import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RecoverPassDto } from './dto/recover-pass.dto';
import { ValidateCode } from './dto/validate-code.dto';
import { RestorePassDto } from './dto/restore-pass.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @Post('login')
  loginUser(@Body() dto: LoginAuthDto) {
    return this.authService.login(dto);
  }

  @HttpCode(200)
  @Post('recover-pass')
  recoverPass(@Body() recoverPassDto: RecoverPassDto) {
    return this.authService.recoverPass(recoverPassDto);
  }

  @Post('validate-code')
  validateCode(@Body() dto: ValidateCode) {
    return this.authService.validateCode(dto);
  }

  @Post('restore-pass')
  restorePass(@Body() dto: RestorePassDto){
    return this.authService.restorePass(dto);
  }
}
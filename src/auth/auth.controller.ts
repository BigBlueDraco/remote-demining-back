import {
  Body,
  Controller,
  Headers,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login';
import { SingupDto } from './dto/singup';
import { JwtAuthGuard } from './guards/JwtGuard';
import { PassworGroupDto } from './dto/password-group';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('singup')
  @UsePipes(ValidationPipe)
  singup(@Body() createdUser: SingupDto) {
    return this.authService.singup(createdUser);
  }
  @Post('login')
  @UsePipes(ValidationPipe)
  login(@Body() createdUser: LoginDto) {
    return this.authService.login(createdUser);
  }

  @Post('forgot-password')
  @UsePipes(ValidationPipe)
  forgotPassword(@Body() forgotPassword: { email: string }) {
    return this.authService.forgotPassword(forgotPassword.email);
  }
  @Post('forgot-password/:id/:token')
  @UsePipes(ValidationPipe)
  resetPassword(
    @Param('id') id: string,
    @Param('token') token: string,
    @Body() resetPassword: PassworGroupDto,
  ) {
    return this.authService.resetPassword(id, token, resetPassword);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  @UsePipes(ValidationPipe)
  changePassword(
    @Headers() headers,
    @Body()
    changePassword: PassworGroupDto,
  ) {
    const jwt = headers.authorization.split(' ')[1];
    return this.authService.changePassword(jwt, changePassword);
  }

  @UseGuards(JwtAuthGuard)
  @Post('auth-ping')
  test(@Body() createdUser: CreateUserDto) {
    return true;
  }
}

import {
  Body,
  Controller,
  Headers,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login';
import { SingupDto } from './dto/singup';
import { JwtAuthGuard } from './guards/JwtGuard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('singup')
  singup(@Body() createdUser: SingupDto) {
    return this.authService.singup(createdUser);
  }
  @Post('login')
  login(@Body() createdUser: LoginDto) {
    return this.authService.login(createdUser);
  }

  @Post('forgot-password')
  forgotPassword(@Body() forgotPassword: { email: string }) {
    return this.authService.forgotPassword(forgotPassword.email);
  }
  @Post('forgot-password/:id/:token')
  resetPassword(
    @Param('id') id: string,
    @Param('token') token: string,
    @Body() resetPassword: { password: string; confirmPassword: string },
  ) {
    return this.authService.resetPassword(id, token, resetPassword);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  changePassword(
    @Headers() headers,
    @Body()
    changePassword: {
      password: string;
      confirmPassword: string;
    },
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

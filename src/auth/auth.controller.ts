import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { JwtAuthGuard } from './guards/JwtGuard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('singup')
  singup(@Body() createdUser: CreateUserDto) {
    return this.authService.singup(createdUser);
  }
  @Post('login')
  login(@Body() createdUser: CreateUserDto) {
    return this.authService.login(createdUser);
  }

  @UseGuards(JwtAuthGuard)
  @Post('authPing')
  test(@Body() createdUser: CreateUserDto) {
    return true;
  }
}

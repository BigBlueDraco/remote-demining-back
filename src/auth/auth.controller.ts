import {
  Body,
  Controller,
  Headers,
  HttpCode,
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
import {
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthUserRes } from './dto/auth-user-res';
import { forgotPasswordDto } from './dto/forgot-password';
import { ResetPasswordParams } from './dto/reset-password';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('singup')
  @ApiResponse({ status: 201, description: 'User created', type: AuthUserRes })
  @ApiConflictResponse({ description: 'User wit email already exists' })
  @ApiInternalServerErrorResponse({ description: 'Oh, somthing went wrong' })
  @UsePipes(ValidationPipe)
  singup(@Body() createdUser: SingupDto): Promise<AuthUserRes> {
    return this.authService.singup(createdUser);
  }
  @Post('login')
  @ApiResponse({ status: 200, description: 'All good', type: AuthUserRes })
  @ApiConflictResponse({ description: 'User data is unvalid' })
  @ApiInternalServerErrorResponse({ description: 'Oh, somthing went wrong' })
  @UsePipes(ValidationPipe)
  @HttpCode(200)
  async login(@Body() createdUser: LoginDto): Promise<AuthUserRes> {
    return await this.authService.login(createdUser);
  }

  @Post('forgot-password')
  @UsePipes(ValidationPipe)
  @ApiResponse({ status: 200, description: 'Email with link sended' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiInternalServerErrorResponse({ description: 'Oh, somthing went wrong' })
  @HttpCode(200)
  forgotPassword(@Body() forgotPassword: forgotPasswordDto) {
    return this.authService.forgotPassword(forgotPassword.email);
  }

  @Post('forgot-password/:id/:token')
  @ApiOperation({
    summary: 'Reset forgot password',
    description:
      'This endpoint is created for the user goes to the link received in the mail. The link will send it to your client along the path CLIENT_URL/forgot-password/:id/:token and only in this way you will receive a valid id and token',
  })
  @ApiResponse({
    status: 200,
    description: 'Password updated',
    type: AuthUserRes,
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiInternalServerErrorResponse({ description: 'Oh, somthing went wrong' })
  @UsePipes(ValidationPipe)
  @HttpCode(200)
  resetPassword(
    @Param() params: ResetPasswordParams,
    @Body() resetPassword: PassworGroupDto,
  ) {
    return this.authService.resetPassword(
      params.id,
      params.token,
      resetPassword,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  @ApiResponse({
    status: 200,
    description: 'Password updated',
    type: AuthUserRes,
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse({ description: 'Oh, somthing went wrong' })
  @UsePipes(ValidationPipe)
  @HttpCode(200)
  changePassword(
    @Headers() headers,
    @Body()
    changePassword: PassworGroupDto,
  ) {
    const jwt = headers.authorization.split(' ')[1];
    return this.authService.changePassword(jwt, changePassword);
  }

  @UseGuards(JwtAuthGuard)
  @Post('ping')
  test(@Body() createdUser: CreateUserDto) {
    return true;
  }
}

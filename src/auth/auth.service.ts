import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { hash, compare } from 'bcrypt';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config/dist/config.service';
import * as jwt from 'jsonwebtoken';
import * as url from 'url';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  async singup(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    const existUser = await this.userService.findOneByEmail(
      email.toLowerCase(),
    );
    if (existUser) {
      throw new HttpException(
        `User with email: ${email.toLowerCase()} already exists`,
        HttpStatus.CONFLICT,
      );
    }

    const hashedPassword = await hash(password, 10);
    const newUser = await this.userService.create({
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    return {
      access_token: this.jwtService.sign({
        email: newUser.email,
      }),
      user: { email: newUser.email },
    };
  }
  async login(loginUser: CreateUserDto) {
    const { email, password } = loginUser;
    const existUser = await this.userService.findOneByEmail(
      email.toLowerCase(),
    );
    const isValidPassword = await compare(
      loginUser.password,
      existUser.password,
    );
    if (!isValidPassword) {
      throw new HttpException(`Unvalid user data`, HttpStatus.CONFLICT);
    }
    return {
      access_token: this.jwtService.sign({
        email: existUser.email,
      }),
      user: { email: existUser.email },
    };
  }
  async forgotPassword(email: string) {
    const existUser = await this.userService.findOneByEmail(email);
    if (!existUser) {
      throw new HttpException(`User not found`, HttpStatus.CONFLICT);
    }
    const clientURL = this.configService.get<string>('CLIENT_URL');
    const secret =
      this.configService.get<string>('SECRET') + existUser.password;
    const payload = {
      email: existUser.email,
      id: existUser.id,
    };
    const expiresIn = '1h';
    const token = jwt.sign(payload, secret, { expiresIn });
    const resolvedUrl = url.resolve(
      `${clientURL}`,
      `forgot-password/${existUser.id}/${token}`,
    );
    await this.mailService.sendForgotPasswordMail({
      email: existUser.email,
      url: resolvedUrl,
    });
    return 'Email send';
  }
}

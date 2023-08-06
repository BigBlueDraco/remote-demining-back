import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { MailService } from 'src/mail/mail.service';
import { UserService } from 'src/user/user.service';
import * as url from 'url';
import { LoginDto } from './dto/login';
import { PassworGroupDto } from './dto/password-group';
import { SingupDto } from './dto/singup';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  async singup(createUserDto: SingupDto) {
    try {
      const { email, ...passwordGroup } = createUserDto;
      this.checkPasswordConfirming(passwordGroup);
      const existUser = await this.userService.findOneByEmail(
        email.toLowerCase(),
      );
      if (existUser) {
        throw new HttpException(
          `User with email: ${email.toLowerCase()} already exists`,
          HttpStatus.CONFLICT,
        );
      }
      const hashedPassword = await hash(passwordGroup.password, 10);
      const newUser = await this.userService.create({
        email: email.toLowerCase(),
        password: hashedPassword,
      });

      return {
        access_token: this.jwtService.sign({
          id: newUser.id,
          email: newUser.email,
        }),
        user: { email: newUser.email },
      };
    } catch (e) {
      throw e;
    }
  }
  async login(loginUser: LoginDto) {
    try {
      const { email, password } = loginUser;
      const existUser = await this.userService.findOneByEmail(
        email.toLowerCase(),
      );
      const isValidPassword = await compare(password, existUser.password);
      if (!isValidPassword) {
        throw new HttpException(`Unvalid user data`, HttpStatus.CONFLICT);
      }
      return {
        access_token: this.jwtService.sign({
          id: existUser.id,
          email: existUser.email,
        }),
        user: { email: existUser.email },
      };
    } catch (e) {
      throw e;
    }
  }

  async forgotPassword(email: string) {
    try {
      const existUser = await this.userService.findOneByEmail(
        email.toLowerCase(),
      );
      if (!existUser) {
        throw new HttpException(`User not found`, HttpStatus.NOT_FOUND);
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
    } catch (e) {
      throw e;
    }
  }
  async resetPassword(
    id: string,
    token: string,
    forgotPassword: PassworGroupDto,
  ) {
    try {
      this.checkPasswordConfirming(forgotPassword);
      const user = await this.userService.findOneById(id);
      if (!user) {
        throw new HttpException(`User not found`, HttpStatus.NOT_FOUND);
      }
      const secret = this.configService.get<string>('SECRET') + user.password;
      const payload: any = await jwt.verify(token, secret);
      const hashedPassword = await hash(forgotPassword, 10);
      return await this.userService.update(payload.id, {
        password: hashedPassword,
      });
    } catch (e) {
      throw e;
    }
  }
  checkPasswordConfirming(passwordGroup: PassworGroupDto) {
    const { password, confirmPassword } = passwordGroup;
    if (password !== confirmPassword) {
      throw new HttpException(
        `Password and Confirm Password must be equle`,
        HttpStatus.CONFLICT,
      );
    }
  }
  async changePassword(jwt: string, changePassword: PassworGroupDto) {
    try {
      const payload: any = this.jwtService.decode(jwt);
      this.checkPasswordConfirming(changePassword);
      const user = await this.userService.findOneById(payload?.id);
      if (!user) {
        throw new HttpException(`User not found`, HttpStatus.NOT_FOUND);
      }
      const hashedPassword = await hash(changePassword.password, 10);
      const newUser = await this.userService.update(payload?.id, {
        password: hashedPassword,
      });
      const { password: pass, ...rest } = newUser;
      const { password: pass2, ...res } = rest['_doc'];
      return res;
    } catch (e) {
      throw e;
    }
  }
}

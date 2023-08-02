import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const { email, password } = createUserDto;
      const createdUser = new this.userModel({
        email: email.toLowerCase(),
        password: password,
      });
      const result = await createdUser.save();
      return result;
    } catch (err) {
      throw err;
    }
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOneByEmail(email: string) {
    const user = await this.userModel.findOne({ email: email.toLowerCase() });
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

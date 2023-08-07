import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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
      throw new InternalServerErrorException(`${err}`);
    }
  }

  async findOneByEmail(email: string) {
    try {
      const user = await this.userModel.findOne({ email: email.toLowerCase() });
      return user;
    } catch (err) {
      throw err;
    }
  }
  async findOneById(id: string) {
    try {
      const user = await this.userModel.findById(id);
      return user;
    } catch (err) {
      throw err;
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(
        id,
        updateUserDto,
        { new: true },
      );
      return updatedUser;
    } catch (err) {
      throw err;
    }
  }
}

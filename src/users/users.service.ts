import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  // 引数として入力されたユーザー名と同じユーザー名のユーザーを取ってくるメソッド。
  async findOne(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { username } });
  }

  // 会員登録をするためのメソッド。
  async create(createUserDto: CreateUserDto): Promise<User> {
    // createUserDtoからユーザー名とパスワードを取得。
    const { username, password } = createUserDto;
    // ソルトを生成。
    const salt = await bcrypt.genSalt();
    // 生成したソルトを用いてパスワードをハッシュ化。
    const hashedPassword = await bcrypt.hash(password, salt);
    // ユーザー名とハッシュ化したパスワードで新規ユーザーを登録。
    const user = this.userRepository.create({
      username,
      password: hashedPassword,
    });
    await this.userRepository.save(user);
    return user;
  }
}

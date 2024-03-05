import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';
import { CredentialsDto } from '../users/dto/credentials.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  // 会員登録をするためのメソッド。userServiceのcreateメソッドを呼び出す。
  async signUp(createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.create(createUserDto);
  }
  // ログインをするためのメソッド。
  async login(credentialsDto: CredentialsDto) {
    // credentialsDtoから入力されたユーザー名とパスワードを取得する。
    const { username, password } = credentialsDto;
    // userServiceのfindOneメソッドを用いて、入力されたユーザーを取ってくる。
    const user = await this.userService.findOne(username);
    // ユーザーが存在しなければエラーを出力する。
    if (!user) {
      throw new NotFoundException('ユーザーが存在しません。');
    }
    // ユーザーが存在し、かつパスワードが正しければ、
    if (user && (await bcrypt.compare(password, user.password))) {
      // そのユーザーのユーザー名とidからトークンを生成する。
      const payload = { username: user.username, sub: user.id };
      const accessToken = this.jwtService.sign(payload, {expiresIn: "1h"});
      // 生成したトークンを返す。
      return { accessToken };
    }
    throw new UnauthorizedException(
      'ユーザー名またはパスワードを確認してください。',
    );
  }

  /*
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  } */
}

import { Body, Controller, Post, Render, Get, Redirect } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';
import { CredentialsDto } from '../users/dto/credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // ユーザー登録およびログイン画面
  @Get()
  @Render('auth')
  auth() {}

  // 会員登録ボタンが押されたときの動作。
  // authにPOSTした方が良いかも(?)
  @Post('signup')
  @Redirect('/articles')
  async signUp(@Body() createUserDto: CreateUserDto): Promise<User> {
    // 入力内容をcreateUserDtoとして、会員登録を行うメソッドsignUpに引数として渡す。
    return await this.authService.signUp(createUserDto);
  }

  // ログインボタンが押されたときの動作。
  @Post('login')
  @Render('login')
  async login(
    @Body() credentialsDto: CredentialsDto,
  ): Promise<{ accessToken: string }> {
    // 入力内容をcredentialsDtoとして、ログインを行うメソッドloginに引数として渡す。
    const token = await this.authService.login(credentialsDto);
    return await token;
  }
}

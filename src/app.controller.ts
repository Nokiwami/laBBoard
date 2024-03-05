import { Controller, Get, Redirect } from '@nestjs/common';
import { AppService } from './app.service';

// テスト時、http://localhost:3000/で呼び出されるところ
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // http://localhost:3000/にGetリクエストが飛んできたら、http://localhost:3000/articlesにリダイレクトする。>controller/articles.controller.tsへ
  @Get()
  @Redirect('/articles')
  welcome(): void {}
}

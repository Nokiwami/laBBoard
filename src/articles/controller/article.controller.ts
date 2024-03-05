import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Param,
  Render,
  Redirect,
  Body,
  Req,
  Res,
  ParseIntPipe,
} from '@nestjs/common';
import { ArticleService } from '../service/article.service';
import { Articles } from '../../entities/articles.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
// import { CreateArticleDto } from '../dto/create-article.dto';
import { UpdateArticleDto } from '../dto/update-article.dto';
import { Answers } from '../../entities/answers.entity';
import { Response } from 'express';

// これ以前はapp.controller.tsに書かれている。
// /articles以降のことについて記載
@Controller('/articles')
export class ArticleController {
  // article.service.tsからArticleServiceのインスタンスを生成?->内部メソッドを使えるように
  constructor(private ArticleService: ArticleService) {}

  MethodOverride;
  // /articlesにGetリクエストが飛んできたら
  @Get()
  @Render('top.ejs') // ejsからhtmlコードを返す。今回は全ての	Articlesの表示
  async getAll(@Req() req): Promise<object> {
    const articles: Articles[] = await this.ArticleService.getAll(); // 全記事を取得する。参照:article.service.ts
    // リクエストヘッダとして送られてくるユーザー名をuser変数に代入。
    // いずれはすべての、認証が必要なHTTPリクエストそれぞれで認証を行うので、これもいずれ変更。axiosを使えば可能(?)
    const user = req.user;
    return { articles, user };
  }

  // /articles/addにGetリクエストが飛んできたら
  // app-pageとかにした方がいい? //した
  @Get('/add-page')
  @Render('add')
  add(@Req() req) {
    const user = req.user;
    return { user };
  }

  @Get('/logout')
  @Redirect('/articles')
  logout(@Res() res: Response) {
    res.clearCookie('jwt');
  }

  // /articles/addにPostリクエストが飛んできたら
  // /articles/addではなく、/articlesに変更を行う。//した
  @Post('/')
  @Redirect('/articles') // 追加する処理後はtop画面に戻る。
  async create(
    @Body() UpdateArticleDto: UpdateArticleDto,
    @Req() req,
  ): Promise<void> {
    // returnedは変更する->型指定ができるように。現在のreturnedはformタグより送られたレスポンスボディが入っている
    const addart = new Articles(); // インスタンス生成
    addart.title = UpdateArticleDto.title;
    addart.content = UpdateArticleDto.content; // 入力されたデータを代入して、
    addart.user = req.user.username;
    await this.ArticleService.create(addart); // データベースに追加、参照:article.service.ts
    // ここの作業はUpdateArticleDtoの変更ですべて省略可能になる。
  }

  // /articles/:idにGetリクエストが飛んできたらidに対応する画面を表示する。
  @Get('/:article_id')
  @Render('page')
  async getOne(@Req() req, @Param('article_id', ParseIntPipe) id: number) {
    const article: Articles = await this.ArticleService.getOne(id); // データベースからリクエストのidのものをとってくる、参照:article.service.ts
    const user = req.user;
    return { article, user }; // page.ejsにとってきたarticleを送る。
  }

  // /articles/:id/editにGetリクエストが飛んできたら、idの記事の変更画面に映る
  // editはedit-pageとかにする? //した
  @Get('/:article_id/edit-page')
  @Render('edit')
  async editOne(
    @Req() req,
    @Param('article_id', ParseIntPipe) id: number,
  ): Promise<object> {
    const article: Articles = await this.ArticleService.getOne(id); // データベースからリクエストのidのものをとってくる、参照:article.service.ts
    const user = req.user;
    return { article, user }; // edit.ejsにとってきたarticleを送る。
  }

  // PATCHリクエストにして、urlは/articles/:idにする。
  // PATCHはPUTとは違い空気を読んでの置き換えができる。
  // 現段階でできなかった。Post /:idで対応する。
  @Post('/:article_id')
  @Redirect('/articles')
  async edit(
    @Param('article_id', ParseIntPipe) id: number,
    @Body() UpdateArticleDto: UpdateArticleDto,
  ): Promise<UpdateResult> {
    const article: Articles = await this.ArticleService.getOne(id); //
    article.title = UpdateArticleDto.title;
    article.content = UpdateArticleDto.content;
    return await this.ArticleService.update(id, article);
    // /articles/addと全く一緒のことが起こるのでスルー
  }

  @Post('/:article_id/good')
  @Redirect('/articles/${articleId}')
  async plusOne(
    @Param('article_id', ParseIntPipe) articleId: number,
    @Body() body: { answerId: number },
  ) {
    const answerId = body.answerId;
    const answer: Answers = await this.ArticleService.getOneAns(answerId);
    answer.good += 1;
    await this.ArticleService.updateAnswer(answerId, answer);
    return { url: `/articles/${articleId}` };
  }

  // 実験
  // 削除まではできるけど、リダイレクトがうまくいかない
  // 仕方がないので仕様として削除した後は上のlab_noteをおすことに決める。
  @Put('/:article_id')
  async editArticle(
    @Param('article_id', ParseIntPipe) id: number,
    @Body() UpdateArticleDto: UpdateArticleDto,
  ): Promise<UpdateResult> {
    const article: Articles = await this.ArticleService.getOne(id); //
    article.title = UpdateArticleDto.title;
    article.content = UpdateArticleDto.content;
    return await this.ArticleService.update(id, article);
    // /articles/addと全く一緒のことが起こるのでスルー
  }

  @Post('/:article_id/answer')
  @Render('page')
  async addAnswer(@Param('article_id', ParseIntPipe) id: number, @Req() req) {
    // 将来的にはDTOを使用する。
    const addart = new Answers(); // インスタンス生成
    const articleForAnswer: Articles = await this.ArticleService.getOne(id); // データベースからリクエストのidのものをとってくる、参照:article.service.ts
    addart.content = req.body.content; // 入力されたデータを代入して、
    const user = req.user;
    addart.user = user.username;
    addart.good = 0;
    addart.article = articleForAnswer;
    await this.ArticleService.createAnser(addart); // データベースに追加、参照:article.service.ts
    const article = await this.ArticleService.getOne(id); // 更新されたarticleを取ってくる
    return { article, user }; // page.ejsにとってきたarticleを送る
  }

  // /articles/:id/deleteにGetリクエスト
  // deleteはdelete-pageとかに変更? //した
  @Get('/:article_id/delete-page')
  @Render('delete')
  async deleteOne(
    @Param('article_id', ParseIntPipe) id: number,
    @Req() req,
  ): Promise<object> {
    const article: Articles = await this.ArticleService.getOne(id); // データベースからリクエストのidのものをとってくる、参照:article.service.ts
    const user = req.user;
    return { article, user }; // delete.ejsにaricleを送信
  }

  // PostからDeleteに変更する。urlは/articles/:idにする。
  @Post('/:article_id/delete')
  @Redirect('/articles')
  async delete(@Param('article_id', ParseIntPipe) id: number): Promise<void> {
    await this.ArticleService.delete(id); // データベースから消去、参照:article.service.ts
  }

  // 実験
  // 削除まではできるけど、リダイレクトがうまくいかない
  // 仕方がないので仕様として削除した後は上のlab_noteをおすことに決める。
  @Delete('/:article_id')
  async deleteArticle(
    @Param('article_id', ParseIntPipe) id: number,
  ): Promise<DeleteResult> {
    return await this.ArticleService.delete(id);
  }
}

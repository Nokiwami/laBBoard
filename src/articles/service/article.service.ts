import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Articles } from '../../entities/articles.entity';
import { Answers } from '../../entities/answers.entity';

//データベースを操作する部分
@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Articles) private articleRepository: Repository<Articles>,
    @InjectRepository(Answers) private answerRepository: Repository<Answers>,
  ) {} //Repositoryはtypeormの機能。Articlesクラスを突っ込んだことで、このデータベースの操作をすることができる。

  // 全部とってくる
  async getAll(): Promise<Articles[]> {
    return await this.articleRepository.find();
  }

  // 一つデータセットを作る
  async create(article: Articles): Promise<Articles> {
    return await this.articleRepository.save(article);
  }

  // 一つ回答のデータセットを作る
  async createAnser(answer: Answers): Promise<Answers> {
    return await this.answerRepository.save(answer);
  }

  // あたいを一つとってくる
  async getOne(id: number): Promise<Articles> {
    return await this.articleRepository.findOne({
      where: { article_id: id },
      relations: ['answers'],
    });
  }

  async getOneAns(id: number): Promise<Answers> {
    return await this.answerRepository.findOne({
      where: { id: id },
    });
  }

  // データベースの一つの値の編集
  async update(id: number, article: Articles): Promise<UpdateResult> {
    delete article.answers;
    return await this.articleRepository.update(id, article);
  }

  async updateAnswer(answerId: number, updatedAnswer: Answers): Promise<void> {
    await this.answerRepository.update(answerId, updatedAnswer);
  }

  // 返り値をDeleteResultに変更、removeをdeleteに変更したい
  // 消去
  async delete(id: number): Promise<DeleteResult> {
    return this.articleRepository.delete(id);
  }
}

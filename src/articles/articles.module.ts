import { Module } from '@nestjs/common';
import { ArticleService } from './service/article.service';
import { ArticleController } from './controller/article.controller';
import { Articles } from '../entities/articles.entity';
import { Answers } from '../entities/answers.entity'
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Articles, Answers])], // ?
  providers: [ArticleService], // controllerにメソッドを提供するものを指定する(上の方でarticles.service.tsから取得)
  controllers: [ArticleController], // 提供される側のもの(articles.controller.tsから取得)
})
export class ArticlesModule {}

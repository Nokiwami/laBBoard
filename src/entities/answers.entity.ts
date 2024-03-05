import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Articles } from './articles.entity';

@Entity()
export class Answers {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  user: string;

  @Column()
  good: number;

  @ManyToOne(() => Articles, (article) => article.answers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  article: Articles;
}

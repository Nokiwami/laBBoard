import { Entity, PrimaryGeneratedColumn, Column , OneToMany} from 'typeorm';
import { Answers } from './answers.entity'

@Entity()
export class Articles {
  @PrimaryGeneratedColumn()
  article_id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  user: string;

  @OneToMany(() => Answers, (answer) => answer.article, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    cascade: true,
  })
  answers: Answers[];
}

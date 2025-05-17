import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { IPost } from './post.interface';
import { UserEntity } from '../user/user.entity';

@Entity('post')
export class PostEntity implements IPost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({})
  description: string;

  @Column({})
  publicationDate: Date;

  @Column() // Добавляем колонку для хранения идентификатора пользователя
  authorId: number;

  @ManyToOne(() => UserEntity, (user) => user.posts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'authorId' }) // Уточняем имя колонки для связи
  author: UserEntity;

  constructor(post: IPost) {
    if (post) {
      this.name = post.name;
      this.description = post.description;
      this.publicationDate = post.publicationDate;
      this.authorId = post.authorId;
    }
  }
}

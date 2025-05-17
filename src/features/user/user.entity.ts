import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { IUser } from './user.interface';
import { compare, genSalt, hash } from 'bcryptjs';
import { PostEntity } from '../../features/post/post.entity';

@Entity('users')
export class UserEntity implements IUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({})
  password: string;

  @OneToMany(() => PostEntity, (post) => post.author, { cascade: true }) // Уточнение названия поля, которое представляет отношение
  posts: PostEntity[];

  constructor(user: Omit<IUser, 'password'>) {
    if (user) {
      this.id = user.id;
      this.name = user.name;
      this.email = user.email;
    }
  }

  public async setPassword(password: string) {
    const salt = await genSalt(10);
    this.password = await hash(password, salt);
    return this;
  }

  public async setHashPassword(password: string) {
    this.password = password;
    return this;
  }

  public async validatePassword(password: string) {
    return await compare(password, this.password);
  }
}

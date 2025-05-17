import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './post.entity';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PostRepository } from './repo/post.repository';
import { UserModule } from '@src/features/user/user.module';
import { TokensModule } from '@src/features/tokens/tokens.module';
@Module({
  imports: [
    UserModule,
    TokensModule,
    TypeOrmModule.forFeature([PostEntity]),
  ],
  providers: [PostService, PostRepository],
  controllers: [PostController],
})
export class PostModule {}

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSource } from './ormconfig';
import { UserModule } from './features/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { TokensModule } from './features/tokens/tokens.module';
import { PostModule } from '@src/features/post/post.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.development.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: () => dataSource.options,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: () => ({
        store: redisStore,
        host: 'redis' || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        ttl: 36000, // по умолчанию 60 секунд
      }),
    }),
    UserModule,
    JwtModule,
    TokensModule,
    PostModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

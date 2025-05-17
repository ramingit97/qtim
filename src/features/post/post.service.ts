import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { Between } from 'typeorm';

import { PostRepository } from './repo/post.repository';
import { PostEntity } from './post.entity';
import { IPost } from './post.interface';
import { PostFilterDto } from '@src/features/post/dto/post-filter-dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PostUpdateDto } from '@src/features/post/dto/post-update-dto';

@Injectable()
export class PostService {
  constructor(
    private readonly restRepo: PostRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(data: IPost) {
    const newEntity = await new PostEntity(data);
    return await this.restRepo.create(newEntity);
  }

  async findAll(filterDto: PostFilterDto) {
    const { skip = 0, limit = 10, ...filter } = filterDto;

    const cacheKey = `posts:${JSON.stringify(filter)}`;
    const cached = await this.cacheManager.get<IPost[]>(cacheKey);
    if (cached) {
      return cached.slice(skip, skip + limit);
    }

    const where: any = {};

    if (filter.authorId) {
      where.authorId = filter.authorId;
    }

    if (filter.publicationDate) {
      const parsed = dayjs(
        filter.publicationDate,
        ['YYYY-MM-DD', 'MM-DD-YYYY'],
        true,
      );

      if (!parsed.isValid()) {
        throw new BadRequestException('Invalid publicationDate format');
      }

      const startOfDay = parsed.startOf('day').toDate();
      const endOfDay = parsed.endOf('day').toDate();

      where.publicationDate = Between(startOfDay, endOfDay);
    }

    // лучше вытащим из базы и сделаем slice для кеша тоже, из оперативной памяти быстрее вытаскивать данные чем из базы
    const posts = await this.restRepo.findAll(where, 0, 1000);
    await this.cacheManager.set(cacheKey, posts, 3600); // кэш на 60 секунд
    return posts.slice(skip, skip + limit);
  }

  async update(id: number, dto: PostUpdateDto) {
    const updated = await this.restRepo.update(id, dto);
    await this.cacheManager.clear(); // можно заменить на точечную инвалидацию
    return updated;
  }

  async delete(id: number) {
    return await this.restRepo.delete(id);
  }
}

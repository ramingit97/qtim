import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PostEntity } from '../post.entity';
import { PostUpdateDto } from '@src/features/post/dto/post-update-dto';

@Injectable()
export class PostRepository {
  constructor(
    @InjectRepository(PostEntity)
    private restRepo: Repository<PostEntity>,
  ) {}

  async create(user: PostEntity) {
    return await this.restRepo.save(user);
  }

  async findAll(where: any, skip = 0, limit = 10) {
    return this.restRepo.find({
      where,
      skip,
      take: limit,
      relations: {
        author: true,
      },
    });
  }

  async findById(id: number) {
    return await this.restRepo.findOne({ where: { id } });
  }

  async delete(id: number) {
    return await this.restRepo.delete({ id });
  }

  async update(id: number, data: PostUpdateDto) {
    const updateResult = await this.restRepo.update(id, data);
    if (updateResult.affected === 0) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return await this.restRepo.findOneBy({ id });
  }
}

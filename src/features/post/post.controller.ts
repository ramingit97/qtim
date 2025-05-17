import {
  Body,
  Controller,
  Get,
  Param,
  Post, Put, Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PostService } from './post.service';
import { AuthGuard } from '@src/guards/auth.guard';
import { PostCreateDto } from './dto/post-create.dto';
import { PostFilterDto } from '@src/features/post/dto/post-filter-dto';
import { PostUpdateDto } from '@src/features/post/dto/post-update-dto';

@Controller('post')
export class PostController {
  constructor(private service: PostService) {}

  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Post('create')
  async createPost(@Body() data: PostCreateDto, @Req() req) {
    const post = {
      ...data,
      authorId: req.user.id,
    };
    return await this.service.create(post);
  }

  @UseGuards(AuthGuard)
  @Get('')
  async findAll(@Query() filterDto: PostFilterDto) {
    console.log('params', filterDto);
    return await this.service.findAll(filterDto);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() data: PostUpdateDto) {
    return await this.service.update(id, data);
  }

  @Post('delete/:id')
  async delete(@Param('id') id: number) {
    return await this.service.delete(id);
  }
}

import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { PostRepository } from './repo/post.repository';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { PostUpdateDto } from './dto/post-update-dto';

describe('PostService', () => {
  let service: PostService;
  let repoMock: Record<string, jest.Mock>;
  let cacheMock: Record<string, jest.Mock>;

  beforeEach(async () => {
    repoMock = {
      update: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    };

    cacheMock = {
      get: jest.fn(),
      set: jest.fn(),
      clear: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        { provide: PostRepository, useValue: repoMock },
        { provide: CACHE_MANAGER, useValue: cacheMock },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
  });

  describe('create', () => {
    it('should create a new post', async () => {
      const data = {
        name: 'Post title',
        description: 'Some content',
        authorId: 42,
        publicationDate: new Date(),
      };
      const newEntity = { ...data }; // эмулируем PostEntity

      const createdResult = { id: 1, ...data };
      repoMock.create.mockResolvedValue(createdResult);

      const result = await service.create(newEntity);

      expect(repoMock.create).toHaveBeenCalledWith(
        expect.objectContaining(data),
      );
      expect(result).toEqual(createdResult);
    });
  });

  describe('update', () => {
    it('should update a post and clear cache', async () => {
      const id = 1;
      const dto: PostUpdateDto = { name: 'New Name' };
      const expectedResult = { id, name: 'New Title' };

      repoMock.update.mockResolvedValue(expectedResult);
      cacheMock.clear.mockResolvedValue(undefined);

      const result = await service.update(id, dto);

      expect(repoMock.update).toHaveBeenCalledWith(id, dto);
      expect(cacheMock.clear).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });
});

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseUUIDPipe,
  UsePipes,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { PostDto } from './dto/post.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostService } from './post.service';
import { User } from '../entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../shared/decorators/current-user.decorator';
import { Serializer } from '../shared/decorators/serializer.decorator';
import { FileSizeValidationPipe } from '../shared/pipes/file-validation.pipe';

@UseGuards(JwtAuthGuard)
@Controller('posts')
@Serializer(PostDto)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(new FileSizeValidationPipe())
  create(
    @CurrentUser() currentUser: User,
    @UploadedFile('file')
    file: Express.Multer.File,
    @Body() createPostDto: CreatePostDto,
  ): Promise<PostDto> {
    return this.postService.create(
      createPostDto,
      currentUser.id,
      file.buffer,
      file.mimetype,
    );
  }

  @Get()
  async findAll(@CurrentUser() { id }): Promise<PostDto[]> {
    return await this.postService.findAll(id);
  }

  @Get(':id')
  findOne(
    @CurrentUser() currentUser: User,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<PostDto> {
    const userId = currentUser.id;
    return this.postService.findOneOrFail(userId, id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(new FileSizeValidationPipe())
  update(
    @CurrentUser() currentUser: User,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFile('file') file: Express.Multer.File,
  ): Promise<PostDto> {
    return this.postService.update(
      currentUser.id,
      id,
      updatePostDto,
      file.buffer,
      file.mimetype,
    );
  }

  @Delete(':id')
  async remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CurrentUser() currentUser: User,
  ): Promise<boolean> {
    return await this.postService.remove(currentUser.id, id);
  }
}

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
  Res,
  HttpStatus,
  Header,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

import { PostDto } from './dto/post.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostService } from './post.service';
import { User } from '../entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../shared/decorators/current-user.decorator';
import { Serializer } from '../shared/decorators/serializer.decorator';
import { FileSizeValidationPipe } from '../shared/pipes/file-validation.pipe';
import { PoliciesGuard } from '../shared/guards/policies.guard';
import { CheckPermissions } from '../shared/decorators/check-permission.decorator';
import { ActionEnum } from '../casl/casl.enum';
import { Post as PostEntity } from '../entities/post.entity';
import { convertFileName } from '../shared/utils/app.util';

@UseGuards(JwtAuthGuard, PoliciesGuard)
@Controller('posts')
@Serializer(PostDto)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @CheckPermissions([ActionEnum.Create, PostEntity.name])
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
      currentUser,
      file.buffer,
      file.mimetype,
    );
  }

  @Get()
  @CheckPermissions([ActionEnum.Read, PostEntity.name])
  async findAll(@CurrentUser() { id }): Promise<PostDto[]> {
    return await this.postService.findAll(id);
  }

  @Get('excel')
  @Header('Content-Type', 'text/xlsx')
  async exportExcel(@CurrentUser() { id }: User, @Res() response: Response) {
    const file = await this.postService.exportExcel(id);

    response.download(`${file}`);
  }

  @Get(':id')
  @CheckPermissions([ActionEnum.Read, PostEntity.name])
  findOne(
    @CurrentUser() currentUser: User,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<PostDto> {
    const userId = currentUser.id;
    return this.postService.findOneOrFail(userId, id);
  }

  @Get(':id/download')
  async downloadPostPdf(
    @Res() response: Response,
    @Param('id', new ParseUUIDPipe()) id: string,
    @CurrentUser() { id: userId }: User,
  ) {
    const post = await this.postService.findOneOrFail(userId, id);
    const pdfName = convertFileName(post.title);

    const stream = response.writeHead(HttpStatus.OK, {
      'Content-Type': 'application/pdf',
      'Content-disposition': `attachment;filename=${pdfName}.pdf`,
    });

    return this.postService.downloadPostPdf(stream, post);
  }

  @Patch(':id')
  @CheckPermissions([ActionEnum.Update, PostEntity.name])
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
  @CheckPermissions([ActionEnum.Update, PostEntity.name])
  async remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CurrentUser() currentUser: User,
  ): Promise<boolean> {
    return await this.postService.remove(currentUser, id);
  }
}

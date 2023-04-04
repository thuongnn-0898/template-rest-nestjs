import {
  Request,
  Controller,
  Post,
  UseGuards,
  Get,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';

import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from '../entities/user.entity';
import { CurrentUser } from '../shared/decorators/current-user.decorator';
import { UserDto } from '../user/dtos/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Request() { user }: { user: User }) {
    return this.authService.signIn(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user: UserDto) {
    return user;
  }
}

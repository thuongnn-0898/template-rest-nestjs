import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-local';

import { AuthService } from '../auth.service';
import { User } from '../../entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'username',
      passReqToCallback: true,
    });
  }

  async validate(
    _: Request,
    username: string,
    password: string,
  ): Promise<User> {
    return await this.authService.validateUser(username, password);
  }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      passReqToCallback: true,
      secretOrKey: process.env.JWT_SECRET,
      jsonWebTokenOptions: {
        algorithms: ['HS256'],
      },
    });
  }

  async validate(req: Request) {
    const user = await this.userService.findByUsername(req.body.username);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}

import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthErrorConstant } from '../../errors/auth-errors.constant';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    if (info instanceof Error) {
      throw new UnauthorizedException(AuthErrorConstant.invalidAccessToken);
    }

    return super.handleRequest(err, user, info, context, status);
  }
}

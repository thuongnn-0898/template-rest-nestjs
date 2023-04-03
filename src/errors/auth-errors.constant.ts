import { User } from '../entities/user.entity';

export const AuthErrorConstant = {
  wrongLoginInfo: {
    code: 'auth-2001',
    resource: User.name,
  },
};

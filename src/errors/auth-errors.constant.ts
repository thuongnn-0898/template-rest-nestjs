import { User } from '../entities/user.entity';

export const AuthErrorConstant = {
  wrongLoginInfo: {
    code: 'auth-2001',
    resource: User.name,
  },

  invalidAccessToken: {
    code: 'auth-2002',
    resource: User.name,
  },

  invalidRequestInfo: {
    code: 'auth-2003',
    resource: User.name,
  },
};

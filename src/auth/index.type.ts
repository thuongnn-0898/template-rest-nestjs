import { User } from '../entities/user.entity';

export type Payload = {
  email: string;
  exp: number;
  iat: number;
  sub: string;
};

export type RequestType = Request & {
  company: User;
  accessToken: string;
};

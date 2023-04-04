import { plainToInstance } from 'class-transformer';

import { ErrorDto } from '../dtos/error.dto';
import { ErrorConstant } from '../constants/error.constant';

export const internalServerError = (): ErrorDto => {
  const { code, message } = ErrorConstant.internalServer;

  return plainToInstance(ErrorDto, { code, message });
};

import { plainToInstance } from 'class-transformer';

import { ErrorDto } from '../dtos/error.dto';
import { ErrorConstant } from '../constants/error.constant';

export class ErrorUtil {
  static internalServerError = (): ErrorDto => {
    const { code, message } = ErrorConstant.internalServer;

    return plainToInstance(ErrorDto, { code, message });
  };

  static badRequest(
    errorType: string,
    property?: string,
    resource?: string,
    indexes?: number[],
    payload?: object,
  ): ErrorDto | ErrorDto[] {
    let codeAndMessage = ErrorConstant[errorType];

    if (codeAndMessage instanceof Function) {
      codeAndMessage = codeAndMessage(payload);
    }

    if (Array.isArray(indexes)) {
      return indexes.map((index) =>
        plainToInstance(ErrorDto, {
          resource,
          property,
          index,
          ...codeAndMessage,
        }),
      );
    }

    return plainToInstance(ErrorDto, {
      resource,
      property,
      index: indexes,
      ...codeAndMessage,
    });
  }
}

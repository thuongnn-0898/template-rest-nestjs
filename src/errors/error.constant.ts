import { EntityConstant } from '../shared/constants/entity.constant';

export const ErrorConstant = {
  GetPropertyInMessageRegex: /^Key \((.*)\)=\(.*\) already exists.$/,
  getPropertyWhenNotFound: /"((?:""|[^"])*)"/,
  internalServer: 'INTERNAL_SERVER_ERROR',
  entityNotFound: 'Cannot find any data',
  forbidden: 'You are not allowed to access this API',
  isNotEmpty: 'should not be empty',
  isString: 'must be a string',
  isEmail: 'must be a email',
  uniqueArray: 'The array must be unique',
  maxLength: 'must be shorter than or equal to 255 characters',
  arrayMinSize: 'must contain at least 1 elements',
  arrayMaxSize: `must must contain no more than ${EntityConstant.arrayMaxSize} elements`,
  uniqueViolation: '重複しています。',
  somethingError: 'Somethings must be error',
  notFoundException: 'This request is not found',
  alreadyExist: 'The key already exists',
  type: {
    somethingError: 'somethingError',
  },
};

export const HTTP_ERR_MSGS = {
  0: '何かうまくいかなかったようです。時間を置いてもう一度お試しください。',
  400: 'リクエストパラメータが正しくない。',
  401: '認証失敗。',
  403: 'アクセス禁止。権限がない場合等。',
  404: 'ページが見つかりません。',
  500: 'サーバーエラー。',
};

export const ErrorConstant = {
  GetPropertyInMessageRegex: /^Key \((.*)\)=\(.*\) already exists.$/,
  getPropertyWhenNotFound: /"((?:""|[^"])*)"/,
  internalServer: {
    code: 5000,
    message: 'INTERNAL_SERVER_ERROR',
  },
  entityNotFound: {
    code: '1001',
  },
  isNotEmpty: {
    code: '1002',
  },
  isString: {
    code: '1003',
  },
  isEmail: {
    code: '1004',
  },
  uniqueArray: {
    code: '1005',
  },
  maxLength: {
    code: '1006',
  },
  arrayMinSize: {
    code: '1007',
  },
  arrayMaxSize: {
    code: '1008',
  },
  uniqueViolation: {
    code: 1017,
    message: '重複しています。',
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

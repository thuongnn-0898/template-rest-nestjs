import { randomBytes } from 'crypto';

import { AppConStant } from '../constants/app.constant';

export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getKey = (obj: object, value: any): string => {
  return Object.keys(obj).find((key) => obj[key] === value);
};

export const getObjectByKey = (obj: object, key: string) => {
  const newObject: any[] = [];
  JSON.stringify(obj, (_, nestedValue) => {
    if (nestedValue && nestedValue[key]) {
      newObject.push(nestedValue);
    }
    return nestedValue;
  });
  return newObject;
};

export const getObjectByValue = (
  obj: object,
  value: string,
  isGetObject: boolean,
) => {
  let newObject: any;
  JSON.stringify(obj, (_, nestedValue) => {
    const key = getKey(nestedValue, value);
    if (nestedValue && key) {
      newObject = isGetObject ? nestedValue : key;
    }
    return nestedValue;
  });
  return newObject;
};
export const generateToken = (byteSize = 24) => {
  return randomBytes(byteSize).toString('hex' as BufferEncoding);
};

export const getFileType = (fileType: string): string => {
  return getObjectByValue(AppConStant.fileType, fileType, false);
};

export const convertFileName = (name: string): string => {
  return name.toLowerCase().replace(' ', '-');
};

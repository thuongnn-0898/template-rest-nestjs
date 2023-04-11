import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

import { AppConStant } from '../constants/app.constant';
import { getFileType } from '../utils/app.util';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.data === 'file' && value) {
      const isOverSize = AppConStant.fileSize < value.size;
      const isValidFileType = getFileType(value.mimetype);

      if (isOverSize && !isValidFileType) {
        return false;
      }
    }

    return value;
  }
}

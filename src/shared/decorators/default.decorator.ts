import { Transform } from 'class-transformer';
import { isEmpty } from 'class-validator';

export function Default(defaultValue) {
  return Transform(({ value }) => (isEmpty(value) ? defaultValue : value));
}

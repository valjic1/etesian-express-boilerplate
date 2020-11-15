import { ValidationError as ClassValidationError } from 'class-validator';
import httpStatus from 'http-status';

import { ExtendableError } from '@shared/ExtendableError';

export type EntityValidationErrorArgs = {
  entityName: string;
  errors: ClassValidationError[];
};

export class EntityValidationError extends ExtendableError {
  constructor({ entityName, errors }: EntityValidationErrorArgs) {
    const prettyErrors = errors?.map((error) => error.toString().replace(/\n/g, '').split('- ')[1].slice(0, -1));
    const message = `An instance of ${entityName} has failed the validation. Check the errors property for additional information.`;
    const status = httpStatus.UNPROCESSABLE_ENTITY;

    super({ errors: prettyErrors, message, status });
    Object.setPrototypeOf(this, EntityValidationError.prototype);
  }
}

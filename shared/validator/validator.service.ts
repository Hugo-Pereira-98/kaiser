import { validate } from 'class-validator';
import { Injectable } from '@nestjs/common';
import * as Sentry from '@sentry/node';

@Injectable()
export class ValidatorService {
  async validate<T extends object>(validator: T) {
    const errors = await validate(validator);

    if (errors.length > 0) {
      const formattedErrors = errors.map((error) => {
        const constraints = error.constraints;
        const errorMessages = Object.keys(constraints).map(
          (key) => constraints[key],
        );
        return `${error.property}: ${errorMessages.join(', ')}`;
      });

      const error = new Error(
        `Validation failed: ${formattedErrors.join(', ')}`,
      );

      Sentry.captureException(error);
      throw error;
    }
  }
}

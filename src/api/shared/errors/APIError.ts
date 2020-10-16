import httpStatus from "http-status";

import { ExtendableError } from "@shared/ExtendableError";

export type APIErrorArgs = {
  errors?: any[];
  message: string;
  status?: number;
  stack?: any;
};

export class APIError extends ExtendableError {
  constructor({
    errors,
    message,
    status = httpStatus.INTERNAL_SERVER_ERROR,
    stack,
  }: APIErrorArgs) {
    super({ errors, message, status });
    Object.setPrototypeOf(this, APIError.prototype);

    if (stack) {
      this.stack = stack;
    }
  }
}

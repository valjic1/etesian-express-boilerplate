export type ErrorArgs = {
  errors?: any[];
  isPublic?: boolean;
  message: string;
  status: number;
};

export class ExtendableError extends Error {
  errors?: any[];
  isPublic: boolean;
  status: number;

  constructor({ errors, isPublic = true, message, status }: ErrorArgs) {
    super(message);

    this.name = this.constructor.name;

    this.errors = errors;
    this.isPublic = isPublic;
    this.message = message;
    this.status = status;

    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error(message).stack;
    }
  }
}

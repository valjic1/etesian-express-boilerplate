import httpStatus from "http-status";
import { QueryFailedError } from "typeorm";

import { ExtendableError } from "@shared/ExtendableError";

// Extended QueryFailedError interface

export interface ExtendedQueryFailedError extends QueryFailedError {
  length?: number;
  severity?: string;
  code: string;
  detail: string;
  hint?: string;
  position?: string;
  internalPosition?: string;
  internalQuery?: string;
  where?: string;
  schema: string;
  table: string;
  column?: string;
  datatype?: string;
  constraint?: string;
  file: string;
  line: string;
  routine: string;
  query: string;
  parameters: any[];
}

export type DatabaseErrorArgs = {
  message?: string;
  detail?: string;
  status?: number;
  pgErrorCode?: string;
};

export class DatabaseError extends ExtendableError {
  detail?: string;
  pgErrorCode?: string;

  constructor({
    message,
    detail,
    status = httpStatus.BAD_REQUEST,
    pgErrorCode,
  }: DatabaseErrorArgs) {
    const prettyMessage = pgErrorCode
      ? `Error occured while working with database. Refer to error code for additional information. Error code manual can be found at following url: https://www.postgresql.org/docs/12/errcodes-appendix.html`
      : message || "Unrecognized error occured while working with database.";

    super({ message: prettyMessage, status });
    Object.setPrototypeOf(this, DatabaseError.prototype);

    this.detail = detail;
    this.pgErrorCode = pgErrorCode;
  }
}

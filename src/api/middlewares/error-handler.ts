import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

import { environment } from "@config/vars";

import { ExtendableError } from "@shared/ExtendableError";

import { APIError } from "../shared";

/**
 * Catch 404 and forward to error handler
 */
export const notFound = (req: Request, res: Response, next: NextFunction) =>
  next(
    new APIError({
      message: "Not found",
      status: httpStatus.NOT_FOUND,
    })
  );

/**
 *  If error is not extended from type ExtendableError then convert it.
 */
export const converter = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const convertedError =
    err instanceof ExtendableError
      ? err
      : new APIError({ stack: err.stack, ...err });

  next(convertedError);
};

/**
 * Parser error response. Send stacktrace only during development.
 */
export const parser = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, message, stack, isPublic, ...rest } = err;
  const response = { error: { name, message, ...rest, stack } };

  if (environment === "production") {
    delete response.error.name;
    delete response.error.stack;
  }

  res.status(err.status).json(response);
};

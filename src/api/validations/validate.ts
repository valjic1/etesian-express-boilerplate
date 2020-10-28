import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import httpStatus from "http-status";

import { APIError, Messages } from "../shared";

export const validate = () => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new APIError({
      message: Messages.VALIDATION_ERROR,
      status: httpStatus.UNPROCESSABLE_ENTITY,
      errors: errors.array({ onlyFirstError: true }),
    });
  }

  next();
};

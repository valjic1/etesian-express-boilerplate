import { DefaultCatch } from "catch-decorator-ts";
import { NextFunction, Request, Response } from "express";
import { QueryFailedError } from "typeorm";

import { DatabaseError, ExtendedQueryFailedError } from "@api/shared";

/**
 * Try/Catch
 */
export const TryCatch = () =>
  DefaultCatch(
    (err: any, ctx: any, req: Request, res: Response, next: NextFunction) => {
      switch (err.constructor) {
        case QueryFailedError: {
          const { detail, code } = err as ExtendedQueryFailedError;
          return next(new DatabaseError({ detail, pgErrorCode: code }));
        }

        default: {
          next(err);
        }
      }
    }
  );

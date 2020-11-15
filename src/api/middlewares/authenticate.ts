import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import passport from 'passport';

import { User } from '@models/user';

import { APIError } from '../shared';

/**
 * @name loadUser
 */
const loadUser = (req: Request, res: Response, next: NextFunction) => async (err: Error, user?: User, info?: any) => {
  const logIn = (Promise as any).promisify(req.logIn);

  const error = err || info;

  try {
    if (error || !user) throw error;
    await logIn(user, { session: false });
  } catch (e) {
    return next(
      new APIError({
        message: error ? error.message : 'Unauthorized',
        status: httpStatus.UNAUTHORIZED,
        stack: error ? error.stack : undefined,
      }),
    );
  }

  req.user = user;

  return next();
};

/**
 * @name authenticate
 * Authenticate user through jwt access token strategy
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) =>
  passport.authenticate('jwt', { session: false }, loadUser(req, res, next))(req, res, next);

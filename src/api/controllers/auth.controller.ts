import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import moment from 'moment-timezone';
import { Between, getRepository, Repository } from 'typeorm';

import { RefreshToken } from '@models/refresh-token';
import { User } from '@models/user';

import { TryCatch } from '../middlewares';
import { APIError, Messages } from '../shared';

export class AuthController {
  private refreshTokenRepository: Repository<RefreshToken>;
  private userRepository: Repository<User>;

  constructor() {
    this.refreshTokenRepository = getRepository(RefreshToken);
    this.userRepository = getRepository(User);

    this.login = this.login.bind(this);
    this.refresh = this.refresh.bind(this);
  }

  // METHODS

  /**
   * Login
   *
   */
  @TryCatch()
  async login(req: Request, res: Response, next: NextFunction) {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new APIError({ message: Messages.MISSING_LOGIN_PARAMETERS });
    }

    const user = await this.userRepository.findOne({ username });

    if (!user) {
      throw new APIError({ message: Messages.INVALID_LOGIN_PARAMETERS });
    }

    const isPasswordCorrect = await user.passwordMatches(password);

    if (!isPasswordCorrect) {
      throw new APIError({ message: Messages.INVALID_LOGIN_PARAMETERS });
    }

    const response = await user.generateToken();

    res.status(httpStatus.OK).json(response);
  }

  /**
   * Refresh token
   *
   */
  @TryCatch()
  async refresh(req: Request, res: Response, next: NextFunction) {
    const { username, refreshToken: token } = req.body;

    if (!username || !token) {
      throw new APIError({
        message: Messages.MISSING_REFRESH_TOKEN_PARAMETERS,
      });
    }

    const user = await this.userRepository.findOne({ username });

    if (!user) {
      throw new APIError({
        message: Messages.INVALID_REFRESH_TOKEN_PARAMETERS,
      });
    }

    const refreshToken = await this.refreshTokenRepository.findOne({
      user,
      token,
      expires: Between(moment().toDate(), moment().add(1, 'year').toDate()),
    });

    if (!refreshToken) {
      throw new APIError({
        message: Messages.INVALID_REFRESH_TOKEN_PARAMETERS,
      });
    }

    await this.refreshTokenRepository.remove(refreshToken);

    const response = await user.generateToken();

    res.status(httpStatus.OK).json(response);
  }
}

/**
 * Default export
 */
export default new AuthController();

import express from 'express';

import controller from '../controllers/auth.controller';
import validation from '../validations/auth.validation';

export const router = express.Router();

router
  .route('/login')
  /**
   * @api {post} auth/login Login
   * @apiDescription Get accesToken and refreshToken
   * @apiVersion 1.0.0
   * @apiName Login
   * @apiGroup Auth
   *
   */
  .post(validation.login, controller.login);

router
  .route('/refresh-token')
  /**
   * @api {post} auth/refresh-token RefreshToken
   * @apiDescription Exchange refreshTOken for new accesToken and refreshToken
   * @apiVersion 1.0.0
   * @apiName Login
   * @apiGroup Auth
   *
   */
  .post(validation.refresh, controller.refresh);

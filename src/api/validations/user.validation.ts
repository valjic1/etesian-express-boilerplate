import { body, header, query } from 'express-validator';

import { UserRoles } from '@models/user';

import { validate } from './validate';

export default {
  // [GET] /api/users
  listUsers: [
    header('Authorization').isString(),

    query('page').isInt({ min: 1 }),
    query('perPage').isInt({ min: 1 }),

    query('username').isString().optional(),
    query('email').isString().optional(),
    query('firstName').isString().optional(),
    query('lastName').isString().optional(),
    query('role')
      .custom((value) => Object.values(UserRoles).includes(value))
      .optional(true),

    validate(),
  ],

  // [POST] /api/users
  createUser: [
    header('Authorization').isString(),

    body('username').isLength({ min: 3, max: 12 }).isString(),
    body('email').isEmail(),
    body('password').isLength({ min: 6, max: 128 }).isString(),
    body('firstName').isLength({ min: 3, max: 20 }).isString(),
    body('lastName').isLength({ min: 3, max: 20 }).isString(),
    body('role')
      .custom((value) => Object.values(UserRoles).includes(value))
      .optional(true),

    validate(),
  ],
};

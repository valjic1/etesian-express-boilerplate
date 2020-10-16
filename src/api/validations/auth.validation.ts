import { body, query } from "express-validator";

import { validate } from "./validate";

export default {
  // GET /v1/auth/login
  login: [body("username").isString(), body("password").isString(), validate],

  // POST /auth/refresh-token
  refresh: [
    body("username").isString(),
    body("refreshToken").isString(),
    validate,
  ],
};

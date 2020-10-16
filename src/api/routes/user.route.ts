import express from "express";

import controller from "../controllers/user.controller";
// import { authenticate } from "../middlewares";
import validation from "../validations/user.validation";

export const router = express.Router();

/**
 * Load user when API with userId route parameter is hit
 *
 */
router.param("userId", controller.load);

router
  .route("/")
  /**
   * @api {get} users/ List Users
   * @apiDescription List users
   * @apiVersion 1.0.0
   * @apiName ListUser
   * @apiGroup User
   *
   */
  .get(validation.listUsers, controller.list)
  /**
   * @api {post} users/ Create User
   * @apiDescription Create a new user/users
   * @apiVersion 1.0.0
   * @apiName CreateUser
   * @apiGroup User
   *
   */
  .post(validation.createUser, controller.create);

router
  .route("/:userId")
  /**
   * @api {get} users/:id Get User
   * @apiDescription Get user information
   * @apiVersion 1.0.0
   * @apiName GetUser
   * @apiGroup User
   *
   */
  .get(controller.get)
  /**
   * @api {delete} users/:id Delete User
   * @apiDescription Delete user from database
   * @apiVersion 1.0.0
   * @apiName DeleteUser
   * @apiGroup User
   *
   */
  .delete(controller.remove)
  /**
   * @api {patch} users/:id Patch User
   * @apiDescription Patch User
   * @apiVersion 1.0.0
   * @apiName PatchUser
   * @apiGroup User
   *
   */
  .patch(controller.patch);

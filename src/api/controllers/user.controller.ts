import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { cloneDeep, isNil, omitBy } from "lodash";
import { getRepository, Like, Repository } from "typeorm";

import { User } from "@models/user";

import { TryCatch } from "../middlewares";
import { APIError, Messages, UserQueryParams } from "../shared";

export class UserController {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = getRepository(User);

    this.load = this.load.bind(this);
    this.get = this.get.bind(this);
    this.list = this.list.bind(this);
    this.create = this.create.bind(this);
    this.remove = this.remove.bind(this);
    this.patch = this.patch.bind(this);
  }

  // PRIVATE METHODS

  private Like = (param: any) => (param ? Like(`%${param}%`) : null);

  // METHODS

  /**
   * Load user and append to req.
   */
  @TryCatch()
  async load(req: Request, res: Response, next: NextFunction, id: string) {
    const user = await this.userRepository.findOne(id);
    req.locals = { user };

    next();
  }

  /**
   * Get user
   */
  @TryCatch()
  async get(req: Request, res: Response, next: NextFunction) {
    const { user } = req.locals;

    if (!user) {
      throw new APIError({ message: Messages.USER_UNDEFINED });
    }

    res.status(httpStatus.OK).json(user.transform());
  }

  /**
   * List users
   */
  @TryCatch()
  async list(req: Request, res: Response, next: NextFunction) {
    const {
      page,
      perPage,
      username,
      email,
      firstName,
      lastName,
      role,
    } = req.query as UserQueryParams;

    const take = Number(perPage);
    const skip = (Number(page) - 1) * take;

    if (isNaN(take) || isNaN(skip) || take < 0 || skip < 0) {
      throw new APIError({ message: Messages.INVALID_QUERY_PARAMETERS });
    }

    const where = omitBy(
      {
        username: this.Like(username),
        email: this.Like(email),
        firstName: this.Like(firstName),
        lastName: this.Like(lastName),
        role,
      },
      isNil
    );

    const users = await this.userRepository.find({ take, skip, where });

    res.status(httpStatus.OK).json(users.map((entity) => entity.transform()));
  }

  /**
   * Create new user/users
   *
   * Transaction is atomic, meaning that when multipe User entities are provided in a single request
   * and one of them fails, others will be reverted.
   */
  @TryCatch()
  async create(req: Request, res: Response, next: NextFunction) {
    const data = Object.assign({}, req.body);

    const user = this.userRepository.create(data);
    await this.userRepository.save(user);

    const response = Array.isArray(user)
      ? user.map((entity) => entity.transform())
      : (user as User).transform();

    res.status(httpStatus.CREATED).json(response);
  }

  /**
   * Remove user
   */
  @TryCatch()
  async remove(req: Request, res: Response, next: NextFunction) {
    const { user } = req.locals;

    if (!user) {
      throw new APIError({ message: Messages.USER_UNDEFINED });
    }

    await this.userRepository.remove(user);

    res.status(httpStatus.NO_CONTENT).send(Messages.USER_DELETED);
  }

  /**
   * Patch user
   */
  @TryCatch()
  async patch(req: Request, res: Response, next: NextFunction) {
    const { user } = req.locals;

    if (!user) {
      throw new APIError({ message: Messages.USER_UNDEFINED });
    }

    const { id, ...data } = Object.assign({}, req.body);
    const newEntity = Object.assign(cloneDeep(user), data);

    await this.userRepository.update(user.id, newEntity);
    const updatedUser = await this.userRepository.findOneOrFail(user.id);

    res.status(httpStatus.OK).json(updatedUser.transform());
  }
}

/**
 * Default export
 */
export default new UserController();

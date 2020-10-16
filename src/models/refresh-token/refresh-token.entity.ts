import {
  IsString,
  validate,
  ValidationError as ClassValidationError,
} from "class-validator";
import crypto from "crypto";
import moment from "moment-timezone";
import {
  BeforeInsert,
  Column,
  Entity,
  getRepository,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { EntityValidationError } from "../shared";
import { User } from "../user";

import { RefreshTokenProperties } from "./refresh-token.typings";

@Entity()
export class RefreshToken implements RefreshTokenProperties {
  /**
   * PROPERTIES
   */

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  token: string;

  @Column("timestamp without time zone", {
    default: moment().add(30, "days").toDate(),
  })
  expires: Date;

  @ManyToOne((type) => User, (user) => user.refreshTokens)
  user: User;

  /**
   * STATICS
   */

  static async generate(user: User) {
    const refreshToken = new RefreshToken();
    refreshToken.user = user;
    return await getRepository(RefreshToken).save(refreshToken);
  }

  /**
   * HOOKS
   */

  @BeforeInsert()
  async create() {
    this.token = `${this.user.id}.${crypto.randomBytes(40).toString("hex")}`;

    return validate(this).then(async (errors: ClassValidationError[]) => {
      if (errors.length) {
        throw new EntityValidationError({ entityName: "RefreshToken", errors });
      }
    });
  }
}

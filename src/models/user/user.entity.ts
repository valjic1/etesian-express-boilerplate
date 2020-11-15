import bcrypt from 'bcrypt';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  validate,
  ValidationError as ClassValidationError,
} from 'class-validator';
import { omit } from 'lodash';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { jwtTool } from '@config/jwt';
import { saltRounds } from '@config/vars';

import { UserClaims } from '@shared/jwt';

import { RefreshToken } from '../refresh-token';
import { EntityValidationError } from '../shared';

import { UserRoles } from './user-roles.enum';
import { UserMethods, UserProperties } from './user.typings';

@Entity()
export class User implements UserProperties, UserMethods {
  /**
   * PROPERTIES
   */

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsString()
  @Length(3, 12)
  username: string;

  @Column({ unique: true })
  @IsOptional()
  @IsString()
  @IsEmail()
  email: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @Column()
  @IsString()
  @Length(6, 128)
  password: string;

  @Column({ type: 'enum', enum: UserRoles, default: UserRoles.USER })
  @IsOptional()
  @IsEnum(UserRoles)
  role: UserRoles;

  @OneToMany((type) => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: Promise<RefreshToken[]>;

  /**
   * HOOKS
   */

  @BeforeInsert()
  @BeforeUpdate()
  async before() {
    return validate(this).then(async (errors: ClassValidationError[]) => {
      if (errors.length) {
        throw new EntityValidationError({ entityName: 'User', errors });
      }

      this.password = await this.hash(this.password);
    });
  }

  /**
   * PRIVATE METHODS
   */

  /**
   * Hash password with bcrypt
   * @param password
   */
  private async hash(password: string) {
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Get user claims
   */
  private getUserClaims(): UserClaims {
    const { id, firstName, lastName, email, role } = this;
    return {
      sub: id.toString(),
      name: `${firstName} ${lastName}`,
      email,
      role,
    };
  }

  /**
   * PUBLIC METHODS
   */

  /**
   * Check if password is valid
   * @param password
   */
  async passwordMatches(password: string) {
    return bcrypt.compare(password, this.password);
  }

  /**
   * Transform User by omiting password from response
   */
  transform() {
    return omit(this, 'password');
  }

  /**
   * Generate Access Token
   */
  generateAccessToken() {
    return jwtTool.getAccessToken(this.getUserClaims());
  }

  /**
   * Generate Token
   */
  async generateToken() {
    const { token: refreshToken } = await RefreshToken.generate(this);
    return jwtTool.getToken(this.getUserClaims(), refreshToken);
  }
}

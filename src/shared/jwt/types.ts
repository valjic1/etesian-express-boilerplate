import { Moment } from 'moment-timezone';

export type TokenType = 'Bearer';

export type UserKeys = 'sub' | 'name' | 'email' | 'role';
export type TimeKeys = 'exp' | 'iat';

export type UserClaims = { [claim in UserKeys]: string };
export type TimeClaims = { [claim in TimeKeys]: number };
export type Claims = UserClaims & TimeClaims;

export type Token = {
  accessToken: string;
  expiresIn: Moment;
  refreshToken: string;
  tokenType: TokenType;
};

export interface IJwtTool {
  encode: (claims: Claims) => string;
  decode: (token: string) => Claims | Error;

  getAccessToken: (userClaims: UserClaims) => string;
  getToken: (userClaims: UserClaims, refreshToken: string) => Token;
}

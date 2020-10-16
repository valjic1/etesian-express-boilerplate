import jwt from "jsonwebtoken";
import moment from "moment-timezone";

import { Claims, IJwtTool, Token, UserClaims } from "./types";

export class JwtTool implements IJwtTool {
  constructor(private secret: string, private expiration: string) {}

  encode = (claims: Claims) => jwt.sign(claims, this.secret);

  decode = (token: string) => {
    try {
      const payload = jwt.verify(token, this.secret);
      return payload;
    } catch (error) {
      return error;
    }
  };

  private getPayload = (userClaims: UserClaims): Claims => ({
    iat: moment().unix(),
    exp: moment().add(this.expiration, "minutes").unix(),
    ...userClaims,
  });

  getAccessToken = (userClaims: UserClaims): string =>
    this.encode(this.getPayload(userClaims));

  getToken = (userClaims: UserClaims, refreshToken: string): Token => ({
    accessToken: this.getAccessToken(userClaims),
    expiresIn: moment().add(this.expiration, "minutes"),
    refreshToken,
    tokenType: "Bearer",
  });
}

import PassportJwt, {
  ExtractJwt,
  StrategyOptions as JwtStrategyOptions,
} from "passport-jwt";
import { getRepository } from "typeorm";

import { jwtSecret } from "@config/vars";

import { User } from "@models/user";

import { Claims } from "@shared/jwt";

type CustomVerifiedCallback = (
  error: any,
  user?: User | false,
  info?: any
) => void;

// JWT STRATEGY

const verify = async (payload: Claims, done: CustomVerifiedCallback) => {
  try {
    const userRepository = getRepository(User);
    const user = await userRepository.findOneOrFail(payload.sub);

    if (!user) {
      return done(null, false);
    }

    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
};

const options: JwtStrategyOptions = {
  secretOrKey: jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("Bearer"),
};

// EXPORTS

export const jwt = new PassportJwt.Strategy(options, verify);

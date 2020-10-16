import { JwtTool } from "@shared/jwt";

import { jwtExpirationInterval, jwtSecret } from "./vars";

export const jwtTool = new JwtTool(jwtSecret, jwtExpirationInterval);

import { Token } from "@shared/jwt";

import { UserRoles } from "./user-roles.enum";

// USER PROPERTIES

export interface UserProperties {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: UserRoles;
}

// USER METHODS

export interface UserMethods {
  passwordMatches: (password: string) => Promise<boolean>;
  transform: () => Omit<UserProperties, "password">;
  generateAccessToken: () => string;
  generateToken: () => Promise<Token>;
}

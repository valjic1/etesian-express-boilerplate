import { User } from '../user';

// REFRESH-TOKEN PROPERTIES
export interface RefreshTokenProperties {
  id: number;
  token: string;
  expires: Date;
  user: User;
}

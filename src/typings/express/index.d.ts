import { User as UserEntity } from '@models/user';

declare global {
  namespace Express {
    interface Request {
      locals: {
        user?: UserEntity;
      };
    }
  }
}

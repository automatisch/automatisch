import { Response, NextFunction } from 'express';
import User from '../models/user';
import RequestWithCurrentUser from '../types/express/request-with-current-user';

const authentication = async (req: RequestWithCurrentUser, _res: Response, next: NextFunction): Promise<void> => {
  // We set authentication to use the sample user we created temporarily.
  req.currentUser = await User.query().findOne({
    email: 'user@automatisch.com'
  }).throwIfNotFound();

  next()
}

export default authentication;

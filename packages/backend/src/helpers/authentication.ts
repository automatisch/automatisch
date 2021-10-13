import { NextFunction,Request, Response } from 'express';

import User from '../models/user';
import UserType from '../types/user';

interface RequestWithCurrentUser extends Request {
  currentUser: UserType
}

const authentication = async (req: RequestWithCurrentUser, _res: Response, next: NextFunction) => {
  // We set authentication to use the sample user we created temporarily.
  req.currentUser = await User.query().findOne({
    email: 'user@automatisch.com'
  })

  next()
}

export default authentication;

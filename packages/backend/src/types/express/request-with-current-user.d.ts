import { Request } from 'express';
import User from '../user';

interface RequestWithCurrentUser extends Request {
  currentUser: User
}

export default RequestWithCurrentUser;

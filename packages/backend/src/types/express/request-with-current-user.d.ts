import { Request } from 'express';
import User from '../../models/user';

interface RequestWithCurrentUser extends Request {
  currentUser: User;
}

export default RequestWithCurrentUser;

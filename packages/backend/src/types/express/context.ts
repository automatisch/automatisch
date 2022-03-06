import { Request } from 'express';
import User from '../../models/user';

interface Context extends Request {
  currentUser: User;
}

export default Context;

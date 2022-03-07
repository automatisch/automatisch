import User from '../../models/user';
import jwt from 'jsonwebtoken';
import appConfig from '../../config/app';

type Params = {
  input: {
    email: string;
    password: string;
  };
};

const TOKEN_EXPIRES_IN = '14d';

const login = async (_parent: unknown, params: Params) => {
  const user = await User.query().findOne({
    email: params.input.email,
  });

  if (user && (await user.login(params.input.password))) {
    const token = jwt.sign({ userId: user.id }, appConfig.appSecretKey, {
      expiresIn: TOKEN_EXPIRES_IN,
    });

    return { token, user };
  }

  throw new Error('User could not be found.');
};

export default login;

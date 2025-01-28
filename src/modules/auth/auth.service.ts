import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { IUser } from '../userModels/user.interface';
import User from '../userModels/user.model';
import config from '../../config';

const register = async (payload: IUser) => {
  const result = await User.create(payload);
  return result;
};

const login = async (payload: { email: string; password: string }) => {
  // checking if the user is exist
  const user = await User.findOne({ email: payload?.email }).select(
    '+password',
  );

  if (!user) {
    throw new Error('This user is not found !');
  }

  // checking if the user is inactive
  const userStatus = user?.userStatus;

  if (userStatus === 'inactive') {
    throw new Error('This user is blocked ! !');
  }

  //checking if the password is correct
  const isPasswordMatched = await bcrypt.compare(
    payload?.password,
    user?.password,
  );

  if (!isPasswordMatched) {
    throw new Error('Wrong Password!!! Tell me who are you? 😈');
  }

  //create token and sent to the  client
  const jwtPayload = {
    email: user?.email,
    role: user?.role,
  };

  const token = jwt.sign(jwtPayload, config.jwt_secret as string, {
    expiresIn: '1d',
  });

  return { token, user };
};

const changePassword = async (
  userData: JwtPayload,
  payload: {
    oldPassword: string;
    newPassword: string;
  },
) => {
  const user = await User.findOne({ email: userData?.email }).select(
    '+password',
  );

  if (!user) {
    throw new Error('This user is not found !');
  }

  // checking if the user is inactive
  const userStatus = user?.userStatus;

  if (userStatus === 'inactive') {
    throw new Error('This user is blocked ! !');
  }

  //checking if the password is correct
  const isPasswordMatched = await bcrypt.compare(
    payload?.oldPassword,
    user?.password,
  );

  if (!isPasswordMatched) {
    throw new Error('Wrong Password!!!😈');
  }

  const hashNewPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await User.findOneAndUpdate(
    {
      email: userData?.email,
      role: userData?.role,
    },
    { password: hashNewPassword },
  );
  return null;
};

export const AuthService = {
  register,
  login,
  changePassword,
};

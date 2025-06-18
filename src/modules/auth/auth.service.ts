import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { IUser } from '../userModels/user.interface';
import User from '../userModels/user.model';
import config from '../../config';
import crypto from 'crypto';
import sendOrderConfirmationMail from '../../utils/nodemainle';

const generateOTP = () => crypto.randomInt(100000, 999999).toString();


const register = async (payload: IUser) => {

  const otp = generateOTP();
  const otpExpire = new Date(Date.now() + 5 * 60 * 1000);


  const { name, email, password } = payload;

  const userInfo = { name, email, password, otp, otpExpire }

  const emailOTP = `<h2>Your OTP from Car Store</h2>
    <p>Hello ${name},</p>
    <p>Your OTP is: <strong>${otp}</strong></p>
    <p>This OTP will expire in 5 minutes.</p>
    <br/>
    <p>Thank you for registering with Car Store!</p>`

  await sendOrderConfirmationMail('ahmedshohagarfan@gmail.com', email, "Your OTP Code for Car Store Account Verification", emailOTP)

  const result = await User.create(userInfo);
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
    throw new Error('Wrong Password!!! 😈');
  }

  //create token and sent to the  client
  const jwtPayload = {
    email: user?.email,
    role: user?.role,
  };

  const token = jwt.sign(jwtPayload, config.jwt_secret as string, {
    expiresIn: '1d',
  });

  const refreshToken = jwt.sign(
    jwtPayload,
    config.jwt_refresh_secret as string,
    {
      expiresIn: '7d',
    },
  );

  return { token, user, refreshToken };
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

const generateTokenUsingRefreshToken = async (token: string) => {
  // checking if the token is missing
  if (!token) {
    throw new Error('You are not authorized!');
  }

  // checking if the given token is valid
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string,
  ) as JwtPayload;

  const { email } = decoded;

  // checking if the user is exist
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('This user is not found !');
  }

  // checking if the user is inactive
  const userStatus = user?.userStatus;

  if (userStatus === 'inactive') {
    throw new Error('This user is blocked ! !');
  }

  //create token and sent to the  client
  const jwtPayload = {
    email: user?.email,
    role: user?.role,
  };

  const newToken = jwt.sign(jwtPayload, config.jwt_secret as string, {
    expiresIn: '1d',
  });

  return { newToken, user };
};

export const AuthService = {
  register,
  login,
  changePassword,
  generateTokenUsingRefreshToken,
};

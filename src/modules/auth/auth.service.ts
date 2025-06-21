import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { IUser } from '../userModels/user.interface';
import User from '../userModels/user.model';
import config from '../../config';
import crypto from 'crypto';
import sendOrderConfirmationMail from '../../utils/nodemainle';
import { ResendOTP, VerifyOTP } from '../../utils/types';
import { sendImageToCloudinary } from '../../utils/imageUploderInCloudinary';

const generateOTP = () => crypto.randomInt(100000, 999999).toString();


const register = async (file:any, payload: IUser) => {

  const {secure_url} = await sendImageToCloudinary(file?.path, payload?.name)
  const profileImg = secure_url;

  const otp = generateOTP();
  const otpExpire = new Date(Date.now() + 5 * 60 * 1000);


  const { name, email, password } = payload;

  const userInfo = { name, email, password, otp, otpExpire, profileImg }

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

// verify OTP
const verifyOTP = async (payload: VerifyOTP) => {
  const { email, otp, context } = payload;

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not Found!")
  }

  if (!user.otp || !user.otpExpire) throw new Error('OTP was not generated. Please login again.');
  if (user.otp != otp || user.otpExpire < new Date()) {
    throw new Error("Invalid OTP or Expired OTP!")
  }

  if (context === 'signup') {
    if (user.verified) {
      throw new Error("User already verified!")
    }
    const result = await User.findOneAndUpdate({ email }, { $set: { verified: true }, $unset: { otp: "", otpExpire: "" } }, { new: true })
    return result
  }
  if (context === 'login') {


    if (user?.loginVerification) {
      throw new Error("User already verified!")
    }
    const updatedUser = await User.findOneAndUpdate({ email }, { $unset: { otp: "", otpExpire: "", loginVerification: "" } }, { new: true })
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
    return { token, user: updatedUser, refreshToken };
  }
}

// resend otp
const resendOTP = async (payload: ResendOTP) => {
  const { email } = payload;

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not Found!")
  }
  if (user?.verified) {
    throw new Error("User already verified!")
  }
  const otp = generateOTP();
  const otpExpire = new Date(Date.now() + 5 * 60 * 1000);

  const emailOTP = `<h2>Your OTP from Car Store</h2>
    <p>Your OTP is: <strong>${otp}</strong></p>
    <p>This OTP will expire in 5 minutes.</p>
    <br/>
    <p>Thank you for registering with Car Store!</p>`

  await sendOrderConfirmationMail('ahmedshohagarfan@gmail.com', email, "Your OTP Code for Car Store Account Verification", emailOTP)

  const result = await User.findOneAndUpdate({ email }, { $set: { otp, otpExpire } }, { new: true })

  return result;
}

const login = async (payload: { email: string; password: string }) => {
  // checking if the user is exist
  const user = await User.findOne({ email: payload?.email }).select(
    '+password',
  );

  if (!user) {
    throw new Error('user not found !');
  }

  // checking if the user is inactive
  const userStatus = user?.userStatus;

  if (userStatus === 'inactive') {
    throw new Error('User is blocked ! !');
  }

  if (!user?.verified) {
    throw new Error("User is not verified!")
  }

  //checking if the password is correct
  const isPasswordMatched = await bcrypt.compare(
    payload?.password,
    user?.password,
  );

  if (!isPasswordMatched) {
    throw new Error('Wrong Password!!! 😈');
  }

  const otp = generateOTP();
  const otpExpire = new Date(Date.now() + 5 * 60 * 1000);

  const emailOTP = `
  <h2>Your Login OTP for Car Store</h2>
  <p>Hello,</p>
  <p>We received a request to log in to your Car Store account.</p>
  <p>Your OTP is: <strong>${otp}</strong></p>
  <p>This OTP is valid for 5 minutes.</p>
  <br/>
  <p>If you did not request this, please ignore this email.</p>
  <p>Thank you,<br/>The Car Store Team</p>
  `

  await sendOrderConfirmationMail('ahmedshohagarfan@gmail.com', payload?.email, "Your OTP Code for Car Store Account Login", emailOTP);

  const setOtpInDB = await User?.findOneAndUpdate({ email: payload?.email }, { $set: { otp, otpExpire, loginVerification: false } }, { new: true })
  console.log(setOtpInDB)

  return { email: setOtpInDB?.email };
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
  verifyOTP,
  resendOTP
};

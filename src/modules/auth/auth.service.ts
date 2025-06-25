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


const register = async (file: any, payload: IUser) => {

  const { secure_url } = await sendImageToCloudinary(file?.path, payload?.firstName + payload?.lastName)
  const profileImg = secure_url;

  const otp = generateOTP();
  const otpExpire = new Date(Date.now() + 5 * 60 * 1000);


  const { firstName, lastName, email, phoneNumber, gender, dob, address, password } = payload;

  const userInfo = { firstName, lastName, email, phoneNumber, gender, dob, address, password, otp, otpExpire, profileImg }

  const emailOTP = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Registration OTP</title>
  <style>
    body {
      background-color: #111;
      font-family: Arial, sans-serif;
      padding: 20px;
      color: #fff;
    }
    .container {
      background-color: #1f1f1f;
      border-radius: 10px;
      max-width: 500px;
      margin: auto;
      padding: 30px;
      text-align: center;
    }
    .title {
      font-size: 24px;
      margin-bottom: 10px;
      color: #00bcd4;
    }
    .message {
      font-size: 16px;
      margin: 10px 0;
    }
    .otp {
      font-size: 36px;
      font-weight: bold;
      background-color: #333;
      padding: 12px 24px;
      border-radius: 8px;
      display: inline-block;
      margin: 20px 0;
      color: #ffffff;
      letter-spacing: 4px;
    }
    .note {
      font-size: 14px;
      color: #ccc;
      margin-top: 10px;
    }
    .footer {
      font-size: 12px;
      color: #888;
      margin-top: 30px;
      line-height: 1.5;
    }
    .link {
      color: #00bcd4;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="title">Welcome to AutoSphere!</div>
    <p class="message">Hi <strong>${firstName} ${lastName}</strong>,</p>
    <p class="message">Thank you for registering with us. To complete your registration, please verify your email using the One-Time Password (OTP) below:</p>
    
    <div class="otp">${otp}</div>

    <p class="note">⚠️ This OTP is valid for <strong>5 minutes</strong> only.</p>
    <p class="note">If you did not register for AutoSphere, you can safely ignore this email.</p>

    <div class="footer">
      AutoSphere — A Store Platform<br>
      <a href="https://auto-sphere-ashy.vercel.app" class="link">https://auto-sphere-ashy.vercel.app</a><br>
      📞 +8801615391684<br>
      📍 Level-2, 45/1, College Road, Patuakhali Sadar, Patuakhali
    </div>
  </div>
</body>
</html>
`

  await sendOrderConfirmationMail('ahmedshohagarfan@gmail.com', email, "Your OTP Code for Car Store Account Verification", emailOTP)

  const result = await User.create(userInfo);
  return { email: result?.email };
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

  // checking if the user is blocked
  const userStatus = user?.userStatus;

  if (userStatus === 'blocked') {
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
  <!DOCTYPE html>
<html>
<head>
  <style>
    body {
      background-color: #111;
      color: #fff;
      font-family: Arial, sans-serif;
      padding: 20px;
    }
    .container {
      background-color: #1f1f1f;
      padding: 30px;
      border-radius: 10px;
      max-width: 500px;
      margin: auto;
      text-align: center;
    }
    .otp {
      font-size: 32px;
      font-weight: bold;
      color: #ffffff;
      margin: 20px 0;
    }
    .note {
      font-size: 14px;
      color: #ccc;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #aaa;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Your One-Time Password</h2>
    <p>Dear <strong>${user?.firstName} ${user?.lastName}</strong>,</p>
    <p>Here is your One-Time Password to securely log in to your account:</p>
    <div class="otp">${otp}</div>
    <p class="note">Note: This OTP is valid for 5 minutes.</p>
    <p class="note">If you did not request this OTP, please disregard this email.</p>
    <div class="footer">
      AutoSphere a Store Platform<br>
      https://auto-sphere-ashy.vercel.app<br>
      +8801615391684<br>
      Level-2, 45/1, College Road, Patuakhali Sadar, Patuakhali
    </div>
  </div>
</body>
</html>
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

  // checking if the user is blocked
  const userStatus = user?.userStatus;

  if (userStatus === 'blocked') {
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

  // checking if the user is blocked
  const userStatus = user?.userStatus;

  if (userStatus === 'blocked') {
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

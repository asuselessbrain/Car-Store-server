import { USER_ROLE } from './user.constants';

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  age?: number;
  profileImg: string | null;
  role: 'user' | 'admin';
  userStatus: 'active' | 'inactive';
  otp: string;
  verified: boolean;
  otpExpire: Date;
  loginVerification: boolean
}

export type TUserRole = keyof typeof USER_ROLE;

import { USER_ROLE } from './user.constants';

export interface IUser {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  gender: 'male' | 'female' | 'others';
  dob: Date;
  district: string;
  upazila: string;
  postOffice: string;
  postalCode: string;
  about: string;
  profileImg: string | null;
  role: 'user' | 'admin';
  userStatus: 'active' | 'blocked';
  otp?: string;
  verified: boolean;
  otpExpire?: Date;
  loginVerification: boolean
}

export type TUserRole = keyof typeof USER_ROLE;

export interface VerifyOTP {
  email: string;
  otp: string;
  context: 'login' | 'signup';
}

export interface ResendOTP {
  email: string;
}

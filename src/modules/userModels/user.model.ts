import { model, Schema } from 'mongoose';
import { IUser } from './user.interface';
import config from '../../config';
import bcrypt from 'bcrypt';

const userSchema = new Schema<IUser>({
  firstName: {
    type: String,
    required: [true, 'Please provide your first name'],
    minlength: 3,
    maxlength: 20,
  },
  lastName: {
    type: String,
    required: [true, 'Please provide your last name'],
    minlength: 3,
    maxlength: 20,
  },
  email: {
  type: String,
  required: [true, "Please provide your email address"],
  unique: true, // ensures email uniqueness
  lowercase: true, // store email in lowercase
  trim: true, // remove spaces
  match: [
    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
    "Please provide a valid email address"
  ]
},
phoneNumber: {
  type: String,
  required: [true, "Please provide your phone number"],
  trim: true,
  match: [
    /^01[3-9]\d{8}$/,
    "Please provide a valid Bangladeshi phone number starting with 01"
  ]
},
gender: {
  type: String,
  enum: {
    values: ['male', 'female', 'others'],
    message: '{VALUE} is not valid, please provide a valid role',
  },
  required: [true, "Please provide your gender"]
},
dob: {
  type: Date,
  required: [true, "Please provide your date of birth"]
},
address: {
  type: String,
  required: [true, "Please provide your address"]
},

  password: {
    type: String,
    required: true,
    select: false,
  },
  profileImg: {type: String, required: [true, "Please provide your profile picture"]},
  role: {
    type: String,
    enum: {
      values: ['user', 'admin'],
      message: '{VALUE} is not valid, please provide a valid role',
    },
    default: 'user',
    required: true,
  },
  userStatus: {
    type: String,
    enum: ['active', 'inactive'],
    required: true,
    default: 'active',
  },
  otp: {
    type: String,
    required: true
  },
  verified: {
    type: Boolean,
    required: true,
    default: false
  },
  otpExpire: {
    type: Date,
    required: true
  },
  loginVerification: {
    type: Boolean,
    required: true,
    default: false
  },
});

userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this; // doc
  // hashing password and save into DB

  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );

  next();
});

// set '' after saving password
userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

const User = model<IUser>('User', userSchema);
export default User;

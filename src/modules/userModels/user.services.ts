import QueryBuilder from '../../builder/QueryBuilder';
import config from '../../config';
import { sendImageToCloudinary } from '../../utils/imageUploderInCloudinary';
import { IUser } from './user.interface';
import User from './user.model';
import bcrypt from 'bcrypt';

const createAdmin = async (file: any, payload: IUser) => {
  payload.role = 'admin';
  payload.verified = true;

  const { secure_url } = await sendImageToCloudinary(file?.path, payload?.firstName + payload?.lastName)

  const adminInfo = {...payload, profileImg: secure_url}

  const result = await User.create(adminInfo);

  return result;
};

const getUser = async (payload: Record<string, unknown>) => {

  const searchFields = ['firstName', 'lastName'];

  const userQuery = new QueryBuilder(User.find(), payload)
    .search(searchFields)
    .filter()
    .sort()
    .pagination();

  const meta = await userQuery.countTotal();
  const result = await userQuery.modelQuery;

  return { meta, result };
};

const getSingleUser = async (id: string) => {
  const result = await User.findById(id);
  return result;
};

const updateUser = async (id: string, data: IUser) => {
  const result = await User.findByIdAndUpdate(id, data, {
    new: true,
  });
  return result;
};

const changePassword = async (
  id: string,
  data: { oldPassword: string; newPassword: string },
) => {
  const oldPassword = data?.oldPassword;
  const newPassword = data?.newPassword;

  const user = await User.findById(id).select('+password');

  if (!user) {
    throw new Error('User not found');
  }

  const passwordMatch = await bcrypt.compare(
    oldPassword,
    user?.password as string,
  );

  if (!passwordMatch) {
    throw new Error('Incorrect old password');
  }

  if (passwordMatch) {
    const hashedPassword = await bcrypt.hash(
      newPassword,
      Number(config.bcrypt_salt_rounds),
    );
    const result = await User.findByIdAndUpdate(
      user?._id,
      {
        password: hashedPassword,
      },
      { new: true },
    );

    return result;
  }
};

const deleteUser = async (id: string) => {
  const result = await User.findByIdAndDelete(id);
  return result;
};

const blockUser = async (id: string, data: IUser) => {
  const result = await User.findByIdAndUpdate(id, data, {
    new: true,
  });
  return result;
};

export const userService = {
  createAdmin,
  getUser,
  getSingleUser,
  updateUser,
  deleteUser,
  blockUser,
  changePassword,
};

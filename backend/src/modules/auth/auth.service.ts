import jwt from 'jsonwebtoken';
import User, { IUser } from './auth.model';
import { env } from '../../config/env';
import ApiError from '../../utils/ApiError';

const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as any,
  } as jwt.SignOptions);
};

export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<{ user: Partial<IUser>; token: string }> => {
  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(400, 'Email already registered');

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id.toString());

  return {
    user: { _id: user._id, name: user.name, email: user.email },
    token,
  };
};

export const loginUser = async (
  email: string,
  password: string
): Promise<{ user: Partial<IUser>; token: string }> => {
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(401, 'Invalid email or password');

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new ApiError(401, 'Invalid email or password');

  const token = generateToken(user._id.toString());

  return {
    user: { _id: user._id, name: user.name, email: user.email },
    token,
  };
};
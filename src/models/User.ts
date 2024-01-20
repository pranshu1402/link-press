import mongoose from 'mongoose';

// **** Variables **** //

export enum UserRoles {
  Standard,
  Admin,
}

// **** Types **** //

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  pwdHash?: string;
  role?: UserRoles;
}

export interface ISessionUser {
  id: number;
  email: string;
  name: string;
  role: IUser['role'];
}

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'User name is required'],
    },
    email: {
      type: String,
      required: [true, 'User email is required'],
    },
    pwdHash: {
      type: String,
      default: '',
    },
    role: {
      type: Number,
      default: UserRoles.Standard,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;

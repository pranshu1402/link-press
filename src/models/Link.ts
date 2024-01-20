import { addDaysToDate } from '@src/util/Functions';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

// **** Types **** //
export interface ILinkShortenReq {
  longUrl: string;
  expirationDays?: number;
}

export interface ILinkReActivateReq {
  shortUrl: string;
  expirationDays?: number;
}

export interface ILinkData {
  _id?: string | ObjectId;
  index: number;
  shortUrl: string;
  longUrl: string;
  clickCount: number;
  failedViews: number;
  expireBy: Date;
  deleted?: boolean;
  createdAt: Date;
  createdBy: number;
  updatedAt: Date;
}

// **** SCHEMA **** //

const { Schema } = mongoose;

const LinkSchema = new Schema(
  {
    shortUrl: {
      type: String,
      required: [true, 'Short url is required'],
    },
    longUrl: {
      type: String,
      required: [true, 'Long url is required'],
    },
    clickCount: {
      type: Number,
      default: 0,
    },
    failedViews: {
      type: Number,
      default: 0,
    },
    expireBy: {
      type: Date,
      default: addDaysToDate(),
    },
    createdBy: {
      type: String,
      required: [true, 'Creator identity is required'],
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const LinkModel = mongoose.model('Link', LinkSchema);

export default LinkModel;

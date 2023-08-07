import mongoose, { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<Content>;

export const ContentSchema = new mongoose.Schema({
  images: { type: Array },
  data: { type: Object, require: true },
  dataSchema: { type: Object, require: true },
});
export interface Content {
  images?: string[];
  data: any;
  dataSchema: any;
}

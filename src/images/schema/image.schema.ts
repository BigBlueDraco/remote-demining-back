import mongoose, { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<Image>;

export const ImageSchema = new mongoose.Schema({
  parentId: { type: String },
  blob: { type: String },
});
export interface Image {
  parentId: string;
  blob: string;
}

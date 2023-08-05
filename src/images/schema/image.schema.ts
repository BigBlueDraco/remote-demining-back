import mongoose, { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<Image>;

export const ImageSchema = new mongoose.Schema({
  blob: { type: String },
});
export interface Image {
  blob: string;
}

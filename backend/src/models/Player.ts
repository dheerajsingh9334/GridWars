import mongoose, { Document, Schema } from 'mongoose';

export interface IPlayer extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  name: string;
  color: string;
  createdAt: Date;
}

const PlayerSchema = new Schema<IPlayer>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    name: { type: String, required: true, trim: true, maxlength: 32 },
    color: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IPlayer>('Player', PlayerSchema);

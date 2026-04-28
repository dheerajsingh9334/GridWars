import mongoose, { Document, Schema } from 'mongoose';

export type TileAction = 'claim' | 'recapture' | 'erase';

export interface ITileHistory extends Document {
  playerId: mongoose.Types.ObjectId;
  playerName: string;
  x: number;
  y: number;
  color: string | null;
  action: TileAction;
  createdAt: Date;
}

const TileHistorySchema = new Schema<ITileHistory>(
  {
    playerId: { type: Schema.Types.ObjectId, ref: 'Player', required: true },
    playerName: { type: String, required: true },
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    color: { type: String, default: null },
    action: { type: String, enum: ['claim', 'recapture', 'erase'], required: true },
  },
  { timestamps: true }
);

TileHistorySchema.index({ playerId: 1, createdAt: -1 });

export default mongoose.model<ITileHistory>('TileHistory', TileHistorySchema);

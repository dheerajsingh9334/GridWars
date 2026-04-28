import mongoose, { Document, Schema } from 'mongoose';

export interface ITile extends Document {
  x: number;
  y: number;
  playerId: mongoose.Types.ObjectId;
  playerName: string;
  color: string;
  claimedAt: Date;
}

const TileSchema = new Schema<ITile>(
  {
    x: { type: Number, required: true, min: 0 },
    y: { type: Number, required: true, min: 0 },
    playerId: { type: Schema.Types.ObjectId, ref: 'Player', required: true },
    playerName: { type: String, required: true },
    color: { type: String, required: true },
    claimedAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

// Unique index per grid position
TileSchema.index({ x: 1, y: 1 }, { unique: true });

export default mongoose.model<ITile>('Tile', TileSchema);

// In models/Vote.ts
import mongoose, { Schema, Document, models, Model } from "mongoose";

export interface IVote extends Document {
  voterId: Schema.Types.ObjectId;
  candidateId: Schema.Types.ObjectId;
  electionId: Schema.Types.ObjectId;
  post: string;
}

const VoteSchema: Schema<IVote> = new Schema(
  {
    voterId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    candidateId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    electionId: {
      type: Schema.Types.ObjectId,
      ref: "Election",
      required: true,
    },
    post: { type: String, required: true },
  },
  { timestamps: true }
);

// Prevent duplicate votes with a compound index
VoteSchema.index({ voterId: 1, electionId: 1, post: 1 }, { unique: true });

const Vote: Model<IVote> =
  models.Vote || mongoose.model<IVote>("Vote", VoteSchema);

export default Vote;

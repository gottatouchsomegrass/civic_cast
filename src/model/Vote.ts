// In models/Vote.ts
// models/Vote.ts
import mongoose, { Schema } from "mongoose";

const VoteSchema = new Schema(
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
VoteSchema.index({ voterId: 1, electionId: 1, post: 1 }, { unique: true });

export default mongoose.models.Vote || mongoose.model("Vote", VoteSchema);

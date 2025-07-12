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

export default mongoose.models.Vote || mongoose.model("Vote", VoteSchema);

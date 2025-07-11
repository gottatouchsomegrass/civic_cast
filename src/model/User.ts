import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["admin", "voter", "candidate"],
      default: "voter",
    },

    profilePicture: {
      type: String,
      default: "",
    },
    electionPost: {
      type: String,
    },
    voteCount: {
      type: Number,
      default: 0,
    },

    votes: [
      {
        election: { type: Schema.Types.ObjectId, ref: "Election" },
        candidate: { type: Schema.Types.ObjectId, ref: "User" },
      },
    ],
  },

  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);

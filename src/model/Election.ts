// models/Election.ts
import mongoose, { Schema } from "mongoose";

// FIX: Simplified PostSchema to only contain a title
const PostSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
});

const ElectionSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    posts: [PostSchema], // An array of posts, each with just a title
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "active", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Election ||
  mongoose.model("Election", ElectionSchema);

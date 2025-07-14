import mongoose, { Schema, Document, models, Model } from "mongoose";

export interface IPost {
  title: string;
}

export interface IElection extends Document {
  title: string;
  description: string;
  posts: IPost[];
  startDate: Date;
  endDate: Date;
  status: "pending" | "active" | "completed";
}

const PostSchema: Schema<IPost> = new Schema({
  title: { type: String, required: true },
});

const ElectionSchema: Schema<IElection> = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    posts: [PostSchema],
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "active", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Election: Model<IElection> =
  models.Election || mongoose.model<IElection>("Election", ElectionSchema);

export default Election;

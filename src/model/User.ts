import mongoose, { Schema, Document, models, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  isVerified: boolean;
  role: "admin" | "voter" | "candidate";
  profilePicture?: string;
  election?: Schema.Types.ObjectId;
  electionPost?: string;
  voteCount: number;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    isVerified: { type: Boolean, default: false },
    role: {
      type: String,
      enum: ["admin", "voter", "candidate"],
      default: "voter",
    },
    profilePicture: { type: String },
    election: { type: Schema.Types.ObjectId, ref: "Election" },
    electionPost: { type: String },
    voteCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const User: Model<IUser> =
  models.User || mongoose.model<IUser>("User", UserSchema);

export default User;

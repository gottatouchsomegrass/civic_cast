// types/index.ts

/**
 * Represents the complete User object, aligned with your Mongoose schema.
 * This can be used for admins, voters, and candidates.
 */
export interface User {
  _id: string;
  name: string;
  email: string;
  role?: "admin" | "voter" | "candidate";
  isVerified?: boolean;
  profilePicture?: string;
  electionPost?: string;
  voteCount?: number;
  votes?: {
    election: string; // Corresponds to an Election's _id
    candidate: string; // Corresponds to a User's _id
  }[];
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
}

/**
 * Represents an Election object, aligned with your Mongoose schema.
 */
export interface Election {
  _id: string;
  title: string;
  description?: string;
  candidates: string[]; // An array of User IDs
  startDate: string; // ISO date string
  endDate: string; // ISO date string
}

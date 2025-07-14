export type ElectionStatus = "Ongoing" | "Completed" | "Upcoming";

// A type for the nested Post object
export interface Post {
  _id: string;
  title: string;
}

// The main type for an Election document
export interface Election {
  _id: string; // Provided by MongoDB
  title: string;
  description?: string; // Optional field
  posts: Post[];
  startDate: Date;
  endDate: Date;
  status: "pending" | "active" | "completed"; // Enum maps to a union type
  createdAt?: Date;
  updatedAt?: Date;
}

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
    post: string; // The post/position voted for
  }[];
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
  election?: Election;
}

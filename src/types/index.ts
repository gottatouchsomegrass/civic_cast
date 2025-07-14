export interface Vote {
  election: string;
  post: string;
  candidate: string;
  votedAt: Date;
}

export interface Election {
  _id: string;
  title: string;
  description?: string;
  posts: { _id: string; title: string }[];
  startDate: Date;
  endDate: Date;
  status: "pending" | "active" | "completed";
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role?: "admin" | "voter" | "candidate";
  isVerified?: boolean;
  profilePicture?: string;
  electionPost?: string; // If the user is a candidate for a specific post
  voteCount?: number;
  votes: Vote[]; // The user's voting history
  election?: Election; // If the user is a candidate in a specific election
}

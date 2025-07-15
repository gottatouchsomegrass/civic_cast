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
  votes: Vote[];
  election?: Election;
  createdAt?: Date;
  updatedAt?: Date;
}

import "next-auth";
import { DefaultSession } from "next-auth";
declare module "next-auth" {
  interface User {
    _id?: string;
    role?: "admin" | "voter" | "candidate";
    isVerified?: boolean;
    isAcceptingMessages?: boolean;
    name?: string;
  }
  interface Session {
    user: {
      _id?: string;
      role?: "admin" | "voter" | "candidate";
      isVerified?: boolean;
      isAcceptingMessages?: boolean;
      name?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    isVerified?: boolean;
    isAcceptingMessages?: boolean;
    name?: string;
  }
}

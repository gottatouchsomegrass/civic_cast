// ./src/lib/authOptions.ts (Recommended new location)

import { NextAuthOptions } from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter"; // FIX: Import the adapter
import clientPromise from "@/lib/mongodb-client"; // FIX: Import the client promise
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/model/User";
import { Adapter } from "next-auth/adapters";

export const authOptions: NextAuthOptions = {
  // Use MongoDB to store session and user data
  adapter: MongoDBAdapter(clientPromise) as Adapter,

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Missing credentials");
        }
        await dbConnect();
        const user = await User.findOne({ email: credentials.email });

        if (
          !user ||
          !(await bcrypt.compare(credentials.password, user.password))
        ) {
          return null;
        }

        // Return an object that matches the extended User type
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    // FIX: The 'user' object now correctly includes 'role' thanks to type augmentation
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    // FIX: Type assertions are no longer needed
    async session({ session, token }) {
      if (session?.user) {
        session.user._id = token.id as string;
        session.user.role = token.role as "admin" | "voter" | "candidate";
      }
      return session;
    },
  },

  pages: {
    signIn: "/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

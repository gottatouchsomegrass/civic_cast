// ./src/app/api/auth/[...nextauth]/options.ts

import { NextAuthOptions, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/model/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@xyz.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<NextAuthUser | null> {
        await dbConnect();
        try {
          const user = await User.findOne({ email: credentials?.email });

          if (!user) {
            throw new Error("No user found with the provided email.");
          }

          const isPasswordValid = await bcrypt.compare(
            credentials?.password || "",
            user.password
          );

          if (isPasswordValid) {
            return {
              id: user._id.toString(),
              email: user.email,
              name: user.name,
              isVerified: user.isVerified,
            };
          } else {
            throw new Error("Invalid password.");
          }
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(error.message);
          }
          throw new Error("An unknown error occurred during authorization.");
        }
      },
    }),
  ],
  callbacks: {
    // FIX: Removed unused 'account' and 'profile' parameters.
    async jwt({ token, user }) {
      if (user) {
        // Now using the custom properties defined in our type declaration file.
        token._id = user.id;
        token.isVerified = user.isVerified; // Cast needed if not in default User
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.email = token.email;
        session.user.name = token.name;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
    signOut: "/signout",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

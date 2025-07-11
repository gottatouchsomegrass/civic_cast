// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/model/User";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/mongodb";

// Define all authentication options in a single object
export const authOptions: NextAuthOptions = {
  // Add your providers here
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      // This function handles the actual authentication logic
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Missing credentials");
        }

        await connectToDatabase();

        const user = await User.findOne({ email: credentials.email });

        // If no user is found, or password doesn't match, return null
        if (
          !user ||
          !(await bcrypt.compare(credentials.password, user.password))
        ) {
          return null; // This will trigger an error on the client side
        }

        // Return the user object (without the password) if everything is correct
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role, // Include the role for the callback
        };
      },
    }),
  ],

  // Use MongoDB to store session and user data
  adapter: MongoDBAdapter(clientPromise),

  // Use JWT for session management
  session: {
    strategy: "jwt",
  },

  // These callbacks add the user's role to the session token
  callbacks: {
    async jwt({ token, user }) {
      // On sign-in, the 'user' object is available. Persist the role to the token.
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // Add the role from the token to the session object
      if (session?.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },

  // Define custom pages if you have them
  pages: {
    signIn: "/signin", // Redirect users to your custom sign-in page
  },

  secret: process.env.NEXTAUTH_SECRET,
};

// Export the handler
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

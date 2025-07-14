import NextAuth from "next-auth";
// Import the options from their new location
import { authOptions } from "@/lib/authOptions";

// Create the handler by passing the imported options
const handler = NextAuth(authOptions);

// Export the handler for both GET and POST requests, which is what Next.js expects
export { handler as GET, handler as POST };

import NextAuth from "next-auth";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { connectToDatabase } from "@/utils/db";
import { verifyPassword } from "@/utils/auth";
import { User } from "@/models/user";
import CredentialsProvider from "next-auth/providers/credentials"; // Correct import

const handler = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        await connectToDatabase();
        const user = await User.findOne({ email: credentials.email }).exec();

        if (!user) {
          throw new Error("No user found!");
        }

        const isValid = await verifyPassword(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Could not log you in!");
        }

        return { email: user.email };
      },
    }),
  ],
  secret: process.env.SECRET,
  jwt: {
    encryption: true,
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
  },
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.uid; // Assuming token.uid is the user's ID
      if (token.email) {
        session.user.email = token.email; // Optionally add more user details to the session
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.uid = user.id;
        token.email = user.email;
      }
      return token;
    },
  },
});

export { handler as GET, handler as POST };

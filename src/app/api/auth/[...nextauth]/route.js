import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/utils/db";
import { verifyPassword } from "@/utils/auth";

const handler = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const userRef = db
          .collection("users")
          .where("email", "==", credentials.email);
        const userDoc = await userRef.get();

        if (userDoc.empty) {
          throw new Error("No user found!");
        }

        const user = userDoc.docs[0].data();
        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );
        if (!isValid) {
          throw new Error("Could not log you in!");
        }

        return { email: user.email, id: userDoc.docs[0].id };
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
      session.user.id = token.uid;
      if (token.email) {
        session.user.email = token.email;
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

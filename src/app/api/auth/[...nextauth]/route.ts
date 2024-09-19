import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Simple user database
const users = {
   user1: "pass",
   user2: "pass",
   user3: "pass",
};

const handler = NextAuth({
   providers: [
      CredentialsProvider({
         name: "Credentials",
         credentials: {
            username: { label: "Username", type: "text" },
            password: { label: "Password", type: "password" },
         },
         async authorize(credentials) {
            const { username, password } = credentials || {};
            if (users[username] && users[username] === password) {
               return { id: username, name: username };
            }
            return null;
         },
      }),
   ],
   pages: {
      signIn: "/auth/signin",
   },
   session: {
      strategy: "jwt",
   },
   secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };

import GoogleProvider from 'next-auth/providers/google';

import NextAuth from 'next-auth';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    redirect: ({ url, baseUrl }) => {
      // Redirect to /complete-the-signup after sign-in
      // if (url.startsWith("/")) return `${baseUrl}/complete-the-signup`;
      // // Allows callback URLs on the same origin
      // if (new URL(url).origin === baseUrl) return url;

      return `${baseUrl}/verification`;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.uid = user.id;
      }

      return token;
    },
    session: async ({ session, token, user }) => {
      if (session.user) {
        session.user.id = token.uid;
        session.user.googleImage = token.picture;
      }
      return session;
    },
  },
  async signOut() {
    await signOut({ callbackUrl: '/', redirect: true });
  },
  pages: {
    signIn: '/signin',
  },
});

export { handler as GET, handler as POST };

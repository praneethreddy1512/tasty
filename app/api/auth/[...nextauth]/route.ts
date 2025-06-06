import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextAuthOptions } from 'next-auth';
import bcrypt from 'bcrypt';
import Db from '@/app/utils/config/db';
import { LoginModel } from '@/app/utils/models/Login';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        await Db();
        const user = await LoginModel.findOne({ username: credentials.username });
        if (!user) return null;

        if (user.password != credentials.password) return null;

        return {
          id: user._id.toString(),
          name: user.username,
          email: user.email,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/user/signin',
  },
  secret: "hellooworld"
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

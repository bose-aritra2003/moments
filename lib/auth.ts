import {getServerSession, NextAuthOptions} from "next-auth";
import {PrismaAdapter} from "@next-auth/prisma-adapter";
import prisma from "@/lib/prismadb";
import GoogleProvider from "next-auth/providers/google"
import GithubProvider from "next-auth/providers/github";
import {getRandomUsername} from "@/lib/utils";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/sign-in',
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  callbacks: {
    async session({token, session}) {
      if(token) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.picture
        session.user.username = token.username
      }
      return session
    },
    async jwt({token, user}) {
      const dbUser = await prisma.user.findFirst({
        where: {
          email: token.email,
        },
      })

      if(!dbUser) {
        token.id = user.id
        return token;
      }

      if (!dbUser.username) {
        await prisma.user.update({
          where: {
            id: dbUser.id,
          },
          data: {
            username: getRandomUsername(),
          }
        })
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
        username: dbUser.username,
      }
    },
    redirect() {
      return '/';
    }
  },
}

export const getAuthSession = async () => await getServerSession(authOptions);
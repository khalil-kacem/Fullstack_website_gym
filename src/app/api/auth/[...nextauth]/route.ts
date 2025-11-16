import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import connectDB from '@/lib/mongodb';
import Utilisateur from '@/models/Utilisateur';
import Coach from '@/models/Coach';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email et mot de passe requis');
        }

        await connectDB();

        // Chercher l'utilisateur dans la collection Utilisateur
        let user = await Utilisateur.findOne({ email: credentials.email }).select('+password');

        // Si pas trouvé, chercher dans la collection Coach
        let role = 'utilisateur';
        if (!user) {
          user = await Coach.findOne({ email: credentials.email }).select('+password');
          role = 'coach';
        }

        if (!user) {
          throw new Error('Email ou mot de passe incorrect');
        }

        if (!user.isActive) {
          throw new Error('Compte désactivé. Contactez un administrateur.');
        }

        const isPasswordValid = await user.comparePassword(credentials.password);
        if (!isPasswordValid) {
          throw new Error('Email ou mot de passe incorrect');
        }

        // Mettre à jour la date du dernier login
        user.lastLogin = new Date();
        await user.save();

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          gender: user.gender,
          dob: user.dob,
          phone: user.phone,
          role,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.name = (user as any).name;
        token.email = (user as any).email;
        token.gender = (user as any).gender;
        token.dob = (user as any).dob;
        token.phone = (user as any).phone;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).name = token.name as string;
        (session.user as any).email = token.email as string;
        (session.user as any).gender = token.gender as string;
        (session.user as any).dob = token.dob as string;
        (session.user as any).phone = token.phone as string;
        (session.user as any).role = token.role as string;
      }
      return session;
    },
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

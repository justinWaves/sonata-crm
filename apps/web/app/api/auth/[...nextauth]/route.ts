import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
    }
  }
}

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('NextAuth: Missing credentials');
          return null;
        }
        // Replace direct Prisma call with backend API call
        console.log('NextAuth: Attempting to authenticate with:', { email: credentials.email, password: credentials.password });
        console.log('NextAuth: API URL:', process.env.NEXT_PUBLIC_API_URL);
        
        const requestBody = { email: credentials.email, password: credentials.password };
        console.log('NextAuth: Request body:', requestBody);
        
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/technicians/auth`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
          });
          console.log('NextAuth: Response status:', response.status);
          console.log('NextAuth: Response headers:', Object.fromEntries(response.headers.entries()));
          
          if (!response.ok) {
            const errorText = await response.text();
            console.log('NextAuth: Response error:', errorText);
            return null;
          }
          
          const user = await response.json();
          console.log('NextAuth: User data received:', user);
          if (!user) {
            console.log('NextAuth: No user data received');
            return null;
          }
          
          const userObject = {
            id: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
          };
          console.log('NextAuth: Returning user object:', userObject);
          return userObject;
        } catch (error) {
          console.error('NextAuth: Fetch error:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: { token: any; user?: { id: string } }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.id = token.id;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt" as const
  },
  pages: {
    signIn: "/tech/login"
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, authOptions }; 
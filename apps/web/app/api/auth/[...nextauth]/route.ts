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
          return null;
        }
        const requestBody = { email: credentials.email, password: credentials.password };
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/technicians/auth`;
        
        console.log(`[NextAuth] Attempting to authorize at: ${apiUrl}`);
        console.log(`[NextAuth] Sending body:`, JSON.stringify(requestBody));

        try {
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
          });

          console.log(`[NextAuth] Received response status: ${response.status}`);

          if (!response.ok) {
            const errorBody = await response.text();
            console.error(`[NextAuth] Auth request failed with status ${response.status}. Body:`, errorBody);
            return null;
          }

          const user = await response.json();
          console.log('[NextAuth] Auth successful, received user:', user);

          if (!user) {
            return null;
          }
          return {
            id: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
          };
        } catch (error) {
          console.error('[NextAuth] A catch-block error occurred during authorization:', error);
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
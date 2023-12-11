import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
  CredentialsProvider({
    // The name to display on the sign in form (e.g. 'Sign in with...')
    name: 'Credentials',
    // The credentials is used to generate a suitable form on the sign in page.
    // You can specify whatever fields you are expecting to be submitted.
    // e.g. domain, username, password, 2FA token, etc.
    // You can pass any HTML attribute to the <input> tag through the object.
    credentials: {
      email: { label: "Email", type: "text", placeholder: "jsmith@fr.fr" },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials, req) {
      // You need to provide your own logic here that takes the credentials
      // submitted and returns either a object representing a user or value
      // that is false/null if the credentials are invalid.
      // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
      // You can also use the `req` object to obtain additional parameters
      // (i.e., the request IP address)
      const payload = {
        email: credentials.email,
        password: credentials.password
      }
      
      const res = await fetch("https://api-knarfmedia-1c52a310e474.herokuapp.com/auth", {
        method: 'POST',
        body: JSON.stringify(credentials),
        headers: { "Content-Type": "application/json" }
      })
      
      const user = await res.json()
      

      // If no error and we have user data, return it
      if (res.ok && user) {
        console.log('token', user)
        return user
      }
      // Return null if user data could not be retrieved
      return null
    }
  })
  ],  
// ...
// other settings
// ...
    
// Callbacks configuration - we create a new JWT Next token with `access_token` (from Drupal). 
  callbacks: {
    async jwt({ token, user, account,}) {
      if (account && user) {
        return { 
          ...token, 
          accessToken: user.token  // <-- add token to JWT (Next's) object
        };
      }
      return token;
    },
    
//    async session({ session, token }) {
//      session.user.accessToken = token.accessToken;
//      
//      return session;
//    },
  },
});
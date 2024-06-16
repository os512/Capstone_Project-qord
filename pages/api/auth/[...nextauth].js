import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import SpotifyProvider from "next-auth/providers/spotify";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@lib/db/mongodb";

export const authOptions = {
	// Configure one or more authentication providers
	providers: [
		GithubProvider({
			clientId: process.env.GITHUB_ID,
			clientSecret: process.env.GITHUB_SECRET,
		}),
		SpotifyProvider({
			clientId: process.env.AUTH_SPOTIFY_ID,
			clientSecret: process.env.AUTH_SPOTIFY_SECRET,
			allowDangerousEmailAccountLinking: true, // TODO OS: This looks dirty!
		}),
	],
	debug: true,

	adapter: MongoDBAdapter(clientPromise),
	callbacks: {
		async signIn({ user, account, profile }) {
			if (account.provider === "spotify") {
				// You can augment user data here if necessary
			}
			return true;
		},
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
			}
			return token;
		},
		async session({ session, user }) {
			session.user.userId = user.id;
			return session;
		},

	},
};

console.log("session.accessToken: ", authOptions.callbacks.session.accessToken);

export default NextAuth(authOptions);

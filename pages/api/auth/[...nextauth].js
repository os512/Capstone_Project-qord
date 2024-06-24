import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { ObjectId } from "mongodb";
import clientPromise from "@lib/db/mongodb";

export const authOptions = {
	providers: [
		SpotifyProvider({
			clientId: process.env.AUTH_SPOTIFY_ID,
			clientSecret: process.env.AUTH_SPOTIFY_SECRET,
			authorization: {
				params: {
					scope:
						"streaming user-read-email user-read-private user-library-read user-library-modify user-read-playback-state user-modify-playback-state",
				},
			},
			allowDangerousEmailAccountLinking: true,
		}),
	],
	debug: true,
	adapter: MongoDBAdapter(clientPromise),
	session: {
		strategy: "database",
		maxAge: 30 * 24 * 60 * 60, // 30 days
		updateAge: 24 * 60 * 60, // 24 hours
	},
	callbacks: {
		async session({ session, user }) {
			try {
				const client = await clientPromise;
				const db = client.db();
				const userAccount = await db
					.collection("accounts")
					.findOne({ userId: new ObjectId(user.id.toString()) });

				try {
					if (userAccount) {
						session.accessToken = userAccount.access_token;
						session.refreshToken = userAccount.refresh_token;
						session.accessTokenExpires = userAccount.expires_at * 1000;
					} else {
						console.log("No user account found for ID:", user.id);
					}
				} catch (error) {
					console.error("Error fetching user account:", error);
				}

				session.user.id = user.id;
			} catch (error) {
				console.error("Failed to update session:", error);
			}
			return session;
		},
	},
};

export default NextAuth(authOptions);

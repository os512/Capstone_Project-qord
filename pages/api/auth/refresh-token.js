import { getSession } from "next-auth/react";
import clientPromise from "@lib/db/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
	const session = await getSession({ req });

	if (!session) {
		return res.status(401).json({ error: "Unauthorized" });
	}

	const client = await clientPromise;
	const db = client.db();
	const userAccount = await db
		.collection("accounts")
		.findOne({ userId: new ObjectId(session.user.id.toString()) });

	if (!userAccount) {
		return res.status(404).json({ error: "User account not found" });
	}

	const refreshToken = userAccount.refresh_token;
	const clientId = process.env.AUTH_SPOTIFY_ID;
	const clientSecret = process.env.AUTH_SPOTIFY_SECRET;

	const response = await fetch("https://accounts.spotify.com/api/token", {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
		},
		body: new URLSearchParams({
			grant_type: "refresh_token",
			refresh_token: refreshToken,
		}),
	});

	const data = await response.json();

	if (!response.ok) {
		return res.status(response.status).json(data);
	}

	const { access_token, expires_in } = data;

	await db.collection("accounts").updateOne(
		{ userId: new ObjectId(session.user.id.toString()) },
		{
			$set: {
				access_token,
				expires_at: Math.floor(Date.now() / 1000) + expires_in,
			},
		}
	);

	res.status(200).json({ access_token });
}

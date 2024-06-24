import dbConnect from "@lib/db/dbConnect";
import Spotify from "@lib/db/models/Spotify";

export default async function handler(req, res) {
	await dbConnect();

	if (req.method === "GET") {
		const { mode, key } = req.query;

		if (!mode || !key) {
			return res.status(400).json({ error: "Mode and key are required" });
		}

		try {
			const track = await Spotify.findTrackByModeAndKey(mode, key);

			if (!track) {
				return res.status(404).json({ error: "No track found for the given mode and key" });
			}

			return res.status(200).json(track);
		} catch (error) {
			console.error("Error fetching track:", error);
			return res.status(500).json({ error: "Error fetching track" });
		}
	}

	res.setHeader("Allow", ["GET"]);
	res.status(405).end(`Method ${req.method} Not Allowed`);
}

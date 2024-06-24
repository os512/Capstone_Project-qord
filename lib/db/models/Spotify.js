import mongoose from "mongoose";

const { Schema } = mongoose;

const SpotifySchema = new Schema(
	{
		acousticness: { type: Number, required: true },
		artist_name: { type: String, required: true },
		danceability: { type: Number, required: true },
		duration_ms: { type: Number, required: true },
		energy: { type: Number, required: true },
		genre: { type: String, required: true },
		instrumentalness: { type: Number, required: true },
		key: { type: String, required: true },
		liveness: { type: Number, required: true },
		loudness: { type: Number, required: true },
		mode: { type: String, required: true },
		popularity: { type: Number, required: true },
		speechiness: { type: Number, required: true },
		tempo: { type: Number, required: true },
		time_signature: { type: String, required: true },
		track_id: { type: String, required: true, unique: true },
		track_name: { type: String, required: true },
		valence: { type: Number, required: true },
	},
	{
		collection: "spotifymillionsongdataset",
	}
);

SpotifySchema.index({ mode: 1, key: 1 });

SpotifySchema.statics.findTrackByModeAndKey = function (mode, key) {
	return this.findOne({ mode, key }).exec();
};

const Spotify = mongoose.models.Spotify || mongoose.model("Spotify", SpotifySchema);

export default Spotify;

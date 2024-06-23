import { useEffect } from "react";
import Image from "next/image";
import useSpotifyPlayer from "@utils/useSpotifyPlayer";

const SpotifyPlayer = ({ trackInfosFromDB, session }) => {
	const { player, isPaused, currentTrack, isReady, play, pause, resume, next, previous } =
		useSpotifyPlayer();

	useEffect(() => {
		if (isReady && player && trackInfosFromDB && session?.accessToken) {
			play(trackInfosFromDB.track_id);
		}
	}, [isReady, player, trackInfosFromDB, session, play]);

	const handlePlayPause = () => {
		if (isPaused) {
			resume();
		} else {
			pause();
		}
	};

	return (
		<div>
			<h2>Spotify Player</h2>
			{isReady ? (
				currentTrack ? (
					<div>
						<Image
							src={currentTrack.album.images[0].url}
							alt="album cover"
							width={100}
							height={100}
							loading="eager"
						/>
						<p>
							Now Playing: {currentTrack.name} by{" "}
							{currentTrack.artists.map((artist) => artist.name).join(", ")}
						</p>
						<button onClick={handlePlayPause}>{isPaused ? "Play" : "Pause"}</button>
						<button onClick={previous}>Previous</button>
						<button onClick={next}>Next</button>
					</div>
				) : (
					<p>No track currently playing</p>
				)
			) : (
				<p>Spotify player is initializing...</p>
			)}
		</div>
	);
};

export default SpotifyPlayer;

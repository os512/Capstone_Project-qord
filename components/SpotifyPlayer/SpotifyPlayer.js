import { useEffect } from "react";
import Image from "next/image";
import useSpotifyPlayer from "@utils/useSpotifyPlayer";
import { FiPlay, FiPause, FiSkipForward, FiSkipBack } from "react-icons/fi";
import {
	spotify__container,
	track__image,
	playbackControls,
	current__trackinfo,
	spotify__playerhandles,
} from "./SpotifyPlayer.module.css";

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
		<div className={spotify__container}>
			{isReady ? (
				currentTrack ? (
					<div>
						<Image
						className={track__image}
							src={currentTrack.album.images[0].url}
							alt="album cover"
							width={100}
							height={100}
							loading="eager"
						/>
						<p className={current__trackinfo}>
							{currentTrack.name} by {currentTrack.artists.map((artist) => artist.name).join(", ")}
						</p>
						<div className={`${playbackControls} ${spotify__playerhandles}`}>
							<FiSkipBack onClick={previous}>Previous</FiSkipBack>
							{isPaused ? (
								<FiPlay onClick={handlePlayPause} />
							) : (
								<FiPause onClick={handlePlayPause} />
							)}
							<FiSkipForward onClick={next}>Next</FiSkipForward>
						</div>
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

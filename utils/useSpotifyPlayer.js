import { useEffect, useState, useCallback } from "react";
import useRefreshToken from "./useRefreshToken";

const useSpotifyPlayer = () => {
	const { accessToken, isLoading, isError } = useRefreshToken();
	const [player, setPlayer] = useState(null);
	const [isPaused, setIsPaused] = useState(true);
	const [currentTrack, setCurrentTrack] = useState(null);
	const [isReady, setIsReady] = useState(false);
	const [deviceId, setDeviceId] = useState(null);

	useEffect(() => {
		if (!accessToken) {
			console.log("Access token is missing, cannot initialize player.");
			return;
		}

		const script = document.createElement("script");
		script.src = "https://sdk.scdn.co/spotify-player.js";
		script.async = true;

		document.body.appendChild(script);

		window.onSpotifyWebPlaybackSDKReady = () => {
			const newPlayer = new window.Spotify.Player({
				name: "Web Playback SDK Quick Start Player",
				getOAuthToken: (cb) => {
					cb(accessToken);
				},
				volume: 0.5,
			});

			setPlayer(newPlayer);

			newPlayer.addListener("ready", ({ device_id }) => {
				console.log("Ready with Device ID", device_id);
				setDeviceId(device_id);
				setIsReady(true);
			});

			newPlayer.addListener("not_ready", ({ device_id }) => {
				console.log("Device ID has gone offline", device_id);
				setIsReady(false);
			});

			newPlayer.addListener("player_state_changed", (state) => {
				if (!state) {
					setIsPaused(true);
					setCurrentTrack(null);
					return;
				}
				setIsPaused(state.paused);
				setCurrentTrack(state.track_window.current_track);
			});

			newPlayer.connect();
		};

		return () => {
			if (player) {
				player.disconnect();
			}
		};
	}, [accessToken]); // Do not use `player` here, even if VSCode complains about it: This causes feedback loops that lead to Spotify's request limits being exceeded!

	const play = useCallback(
		async (trackId) => {
			if (deviceId && accessToken) {
				try {
					const response = await fetch(
						`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
						{
							method: "PUT",
							body: JSON.stringify({ uris: [`spotify:track:${trackId}`] }),
							headers: {
								"Content-Type": "application/json",
								Authorization: `Bearer ${accessToken}`,
							},
						}
					);

					if (response.ok) {
						console.log("Playback started");
						setIsPaused(false);
					} else {
						const data = await response.json();
						console.error("Error starting playback:", data);
						throw new Error(data.error.message);
					}
				} catch (error) {
					console.error("Error starting playback:", error);
				}
			}
		},
		[deviceId, accessToken]
	);

	const pause = useCallback(() => {
		if (player) {
			player.pause().then(() => {
				console.log("Paused!");
				setIsPaused(true);
			});
		}
	}, [player]);

	const resume = useCallback(() => {
		if (player) {
			player.resume().then(() => {
				console.log("Resumed!");
				setIsPaused(false);
			});
		}
	}, [player]);

	const next = useCallback(() => {
		if (player) {
			player.nextTrack().then(() => {
				console.log("Skipped to next track!");
			});
		}
	}, [player]);

	const previous = useCallback(() => {
		if (player) {
			player.previousTrack().then(() => {
				console.log("Skipped to previous track!");
			});
		}
	}, [player]);

	return { player, isPaused, currentTrack, isReady, play, pause, resume, next, previous };
};

export default useSpotifyPlayer;

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";

const useSpotifyPlayer = () => {
	const { data: session } = useSession();
	const [player, setPlayer] = useState(null);
	const [isPaused, setIsPaused] = useState(true);
	const [currentTrack, setCurrentTrack] = useState(null);
	const [isReady, setIsReady] = useState(false);
	const [deviceId, setDeviceId] = useState(null);

	useEffect(() => {
		if (!session?.accessToken) {
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
					cb(session.accessToken);
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

			newPlayer.addListener("initialization_error", ({ message }) => {
				console.error("Failed to initialize", message);
			});

			newPlayer.addListener("authentication_error", ({ message }) => {
				console.error("Failed to authenticate", message);
			});

			newPlayer.addListener("account_error", ({ message }) => {
				console.error("Failed to validate Spotify account", message);
			});

			newPlayer.addListener("player_state_changed", (state) => {
				if (!state) return;
				setIsPaused(state.paused);
				setCurrentTrack(state.track_window.current_track);
			});

			newPlayer
				.connect()
				.then((success) => {
					if (success) {
						console.log("The Web Playback SDK successfully connected to Spotify!");
					} else {
						console.error("Failed to connect to Spotify");
					}
				})
				.catch((error) => {
					console.error("Error connecting to Spotify:", error);
				});
		};

		return () => {
			if (player) {
				player.disconnect();
			}
		};
	}, [session?.accessToken]);

	const debounce = (func, wait) => {
		let timeout;
		return (...args) => {
			clearTimeout(timeout);
			timeout = setTimeout(() => func.apply(this, args), wait);
		};
	};

	const play = useCallback(
		debounce((trackId) => {
			if (deviceId && session?.accessToken) {
				fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
					method: "PUT",
					body: JSON.stringify({ uris: [`spotify:track:5DiXcVovI0FcY2s0icWWUu`] }), // Use the actual track ID
					// body: JSON.stringify({ uris: [`spotify:track:${trackId}`] }), // Use the actual track ID
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${session.accessToken}`,
					},
				})
					.then((response) => {
						if (response.ok) {
							console.log("Playback started");
						} else {
							response.json().then((data) => {
								console.error("Error starting playback:", data);
							});
						}
					})
					.catch((error) => console.error("Error starting playback:", error));
			}
		}, 1000),
		[deviceId, session?.accessToken]
	);

	const pause = useCallback(() => {
		if (player) {
			player
				.pause()
				.then(() => {
					console.log("Paused!");
					setIsPaused(true); // Update the state to reflect the pause
				})
				.catch((error) => {
					console.error("Error pausing playback:", error);
				});
		}
	}, [player]);

	const next = () => {
		if (player) {
			player.nextTrack().then(() => {
				console.log("Skipped to next track!");
			});
		}
	};

	const previous = () => {
		if (player) {
			player.previousTrack().then(() => {
				console.log("Skipped to previous track!");
			});
		}
	};

	return { player, isPaused, currentTrack, isReady, play, pause, next, previous };
};

export default useSpotifyPlayer;

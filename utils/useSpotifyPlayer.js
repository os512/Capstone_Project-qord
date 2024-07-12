import { useEffect, useState, useCallback, useRef } from "react";
import useRefreshToken from "./useRefreshToken";

const useSpotifyPlayer = () => {
	const { accessToken, isLoading, isError } = useRefreshToken();
	const playerRef = useRef(null);
	const [isPaused, setIsPaused] = useState(true);
	const [currentTrack, setCurrentTrack] = useState(null);
	const [isReady, setIsReady] = useState(false);
	const [deviceId, setDeviceId] = useState(null);
	const sdkInitialized = useRef(false);

	useEffect(() => {
		if (!accessToken || sdkInitialized.current) return;

		const script = document.createElement("script");
		script.src = "https://sdk.scdn.co/spotify-player.js";
		script.async = true;

		document.body.appendChild(script);

		window.onSpotifyWebPlaybackSDKReady = () => {
			sdkInitialized.current = true;
			console.log("Spotify SDK is ready");
			initializePlayer();
		};

		return () => {
			document.body.removeChild(script);
			delete window.onSpotifyWebPlaybackSDKReady;
		};
	}, [accessToken]);

	const initializePlayer = useCallback(() => {
		if (!accessToken || playerRef.current) return;

		const player = new window.Spotify.Player({
			name: "Web Playback SDK Quick Start Player",
			getOAuthToken: (cb) => {
				cb(accessToken);
			},
			volume: 0.5,
			enableMediaSession: true,
		});

		playerRef.current = player;

		player.addListener("ready", ({ device_id }) => {
			console.log("Ready with Device ID", device_id);
			setDeviceId(device_id);
			setIsReady(true);
		});

		player.addListener("not_ready", ({ device_id }) => {
			console.log("Device ID has gone offline", device_id);
			setIsReady(false);
		});

		player.addListener("player_state_changed", (state) => {
			if (!state) {
				setIsPaused(true);
				setCurrentTrack(null);
				return;
			}
			setIsPaused(state.paused);
			setCurrentTrack(state.track_window.current_track);
		});

		player.connect().then((success) => {
			if (success) {
				console.log("The Web Playback SDK successfully connected to Spotify!");
			}
		});

		return () => {
			if (playerRef.current) {
				playerRef.current.disconnect();
			}
		};
	}, [accessToken]);

	useEffect(() => {
		if (sdkInitialized.current && accessToken) {
			initializePlayer();
		}
	}, [accessToken, initializePlayer]);

	useEffect(() => {
		const handleVisibilityChange = () => {
			if (!document.hidden && playerRef.current) {
				playerRef.current.getCurrentState().then((state) => {
					if (!state) {
						console.log("User is not playing music through the Web Playback SDK");
						return;
					}
					console.log("Current track:", state.track_window.current_track);
				});
			}
		};

		document.addEventListener("visibilitychange", handleVisibilityChange);

		return () => {
			document.removeEventListener("visibilitychange", handleVisibilityChange);
		};
	}, []);

	const play = useCallback(
		async (trackId) => {
			if (!playerRef.current || !deviceId || !accessToken) {
				console.log("Player not ready or missing deviceId/accessToken");
				return;
			}

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
				} else {
					const data = await response.json();
					console.error("Error starting playback:", data);
					throw new Error(data.error.message);
				}
			} catch (error) {
				console.error("Error starting playback:", error);
			}
		},
		[deviceId, accessToken]
	);

	const pause = useCallback(async () => {
		if (playerRef.current) {
			await playerRef.current.pause();
			console.log("Paused!");
			setIsPaused(true);
		}
	}, []);

	const resume = useCallback(async () => {
		if (playerRef.current) {
			await playerRef.current.resume();
			console.log("Resumed!");
			setIsPaused(false);
		}
	}, []);

	const next = useCallback(async () => {
		if (playerRef.current) {
			await playerRef.current.nextTrack();
			console.log("Skipped to next track!");
		}
	}, []);

	const previous = useCallback(async () => {
		if (playerRef.current) {
			await playerRef.current.previousTrack();
			console.log("Skipped to previous track!");
		}
	}, []);

	return {
		player: playerRef.current,
		isPaused,
		currentTrack,
		isReady,
		play,
		pause,
		resume,
		next,
		previous,
	};
};

export default useSpotifyPlayer;

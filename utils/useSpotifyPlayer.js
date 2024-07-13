import { useEffect, useReducer, useCallback, useRef } from "react";
import useRefreshToken from "./useRefreshToken";

// Define initial state
const initialState = {
	isPaused: true,
	currentTrack: null,
	isReady: false,
	deviceId: null,
};

// Define reducer function
function playerReducer(state, action) {
	switch (action.type) {
		case "PLAYER_READY":
			return { ...state, isReady: true, deviceId: action.deviceId };
		case "PLAYER_NOT_READY":
			return { ...state, isReady: false };
		case "PLAYER_STATE_CHANGED":
			return action.state
				? {
						...state,
						isPaused: action.state.paused,
						currentTrack: action.state.track_window.current_track,
				  }
				: { ...state, isPaused: true, currentTrack: null };
		case "PLAY":
			return { ...state, isPaused: false };
		case "PAUSE":
			return { ...state, isPaused: true };
		default:
			return state;
	}
}

const useSpotifyPlayer = () => {
	const { accessToken, isLoading, isError } = useRefreshToken();
	const playerRef = useRef(null);
	const [state, dispatch] = useReducer(playerReducer, initialState);
	const sdkInitialized = useRef(false);

	const initializePlayer = useCallback(() => {
		if (!accessToken || playerRef.current) return;

		const player = new window.Spotify.Player({
			name: "Web Playback SDK Quick Start Player",
			getOAuthToken: (cb) => {
				cb(accessToken);
			},
			volume: 0,
			enableMediaSession: true,
		});

		playerRef.current = player;

		player.addListener("ready", ({ device_id }) => {
			console.log("Ready with Device ID", device_id);
			dispatch({ type: "PLAYER_READY", deviceId: device_id });
		});

		player.addListener("not_ready", ({ device_id }) => {
			console.log("Device ID has gone offline", device_id);
			dispatch({ type: "PLAYER_NOT_READY" });
		});

		player.addListener("player_state_changed", (state) => {
			dispatch({ type: "PLAYER_STATE_CHANGED", state });
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
			document.body.removeChild(script);
			delete window.onSpotifyWebPlaybackSDKReady;
			document.removeEventListener("visibilitychange", handleVisibilityChange);
		};
	}, [accessToken, initializePlayer]);

	const play = useCallback(
		async (trackId) => {
			if (!playerRef.current || !state.deviceId || !accessToken) {
				console.log("Player not ready or missing deviceId/accessToken");
				return;
			}

			try {
				const response = await fetch(
					`https://api.spotify.com/v1/me/player/play?device_id=${state.deviceId}`,
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

					await playerRef.current.connect();
					await playerRef.current.pause();
					await playerRef.current.setVolume(0.5);
					dispatch({ type: "PAUSE" });

					console.log("newPlayer.getCurrentState: ", await playerRef.current.getCurrentState());
				} else {
					const data = await response.json();
					console.error("Error starting playback:", data);
					throw new Error(data.error.message);
				}
			} catch (error) {
				console.error("Error starting playback:", error);
			}
		},
		[state.deviceId, accessToken]
	);

	const pause = useCallback(async () => {
		if (playerRef.current) {
			try {
				await playerRef.current.pause();
				console.log("Paused!");
				dispatch({ type: "PAUSE" });
			} catch (error) {
				console.error("Error pausing playback:", error);
			}
		}
	}, []);

	const resume = useCallback(async () => {
		if (playerRef.current) {
			try {
				await playerRef.current.resume();
				console.log("Resumed!");
				dispatch({ type: "PLAY" });
			} catch (error) {
				console.error("Error resuming playback:", error);
			}
		}
	}, []);

	const next = useCallback(async () => {
		if (playerRef.current) {
			try {
				playerRef.current.connect();
				await playerRef.current.nextTrack();
				console.log("Skipped to next track!");
			} catch (error) {
				console.error("Error skipping to next track:", error);
			}
		}
	}, []);

	const previous = useCallback(async () => {
		if (playerRef.current) {
			try {
				playerRef.current.connect();
				await playerRef.current.previousTrack();
				console.log("Skipped to previous track!");
			} catch (error) {
				console.error("Error skipping to previous track:", error);
			}
		}
	}, []);

	return {
		player: playerRef.current,
		isPaused: state.isPaused,
		currentTrack: state.currentTrack,
		isReady: state.isReady,
		play,
		pause,
		resume,
		next,
		previous,
	};
};

export default useSpotifyPlayer;

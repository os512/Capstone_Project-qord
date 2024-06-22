import { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import useTrackInfosFromDB from "@utils/useTrackInfosFromDB";


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

    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const newPlayer = new window.Spotify.Player({
        name: 'Web Playback SDK Quick Start Player',
        // getOAuthToken: cb => { cb(session.accessToken); },
        getOAuthToken: cb => {
          console.log("Fetching token");
          cb(session.accessToken);
          console.log("Token fetched successfully");
          // console.log("Token provided:", session.accessToken);
        },
        volume: 0.5
      });

      setPlayer(newPlayer);

      newPlayer.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        setDeviceId(device_id);
        setIsReady(true);
      });

      newPlayer.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
        setIsReady(false);
      });

      newPlayer.addListener('player_state_changed', (state) => {
        if (!state) return;
        setIsPaused(state.paused);
        setCurrentTrack(state.track_window.current_track);
      });

      newPlayer.connect().then(success => {
        if (success) {
          console.log('The Web Playback SDK successfully connected to Spotify!');
        }
      });
    };

    return () => {
      if (player) {
        player.disconnect();
      }
    };
  }, [session?.accessToken]);

  const play = () => {
    if (deviceId && session?.accessToken) {
      fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: 'PUT',
        body: JSON.stringify({ uris: [`spotify:track:5DiXcVovI0FcY2s0icWWUu}`] }), // Replace 'spotify:track:track_id' with your track URI
        // body: JSON.stringify({ uris: [`spotify:track:${trackId}`] }), // Replace 'spotify:track:track_id' with your track URI
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken}`
        }
      }).then(response => {
        if (response.ok) {
          console.log('Playback started');
        } else {
          console.error('Error starting playback:', response);
        }
      }).catch(error => console.error('Error starting playback:', error));
    }
  };

  const pause = () => {
    if (player) {
      player.pause().then(() => {
        console.log('Paused!');
      });
    }
  };

  const next = () => {
    if (player) {
      player.nextTrack().then(() => {
        console.log('Skipped to next track!');
      });
    }
  };

  const previous = () => {
    if (player) {
      player.previousTrack().then(() => {
        console.log('Skipped to previous track!');
      });
    }
  };

  return { player, isPaused, currentTrack, isReady, play, pause, next, previous };
};

export default useSpotifyPlayer;

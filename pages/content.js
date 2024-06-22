import { useMemo, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

// Components
import ContentPage from "@components/ContentPage/ContentPage";
import ScaleNoteSystem from "@components/Vexflow/ScaleNoteSystem";
import TriadNoteSystem from "@components/Vexflow/TriadNoteSystem";

// Utilities
import prepareScale from "@utils/prepareScale";
import prepareTriad from "@utils/prepareTriad";
import useScaleInfo from "@utils/useScaleInfo";
import useNotePositions from "@utils/useNotePositions";
import useTrackInfosFromDB from "@utils/useTrackInfosFromDB";
import useSpotifyPlayer from "@utils/useSpotifyPlayer";

// Styles
import { stave__container, stave__wrapper } from "@styles/Content.module.css";

const Content = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { mode, selectedScale } = router.query;

  // Parse the selected scale and tonic
  const { parsedScale, tonic } = useMemo(() => {
    if (!selectedScale) return { parsedScale: null, tonic: null };
    try {
      const parsedScale =
        typeof selectedScale === "string" ? JSON.parse(selectedScale) : selectedScale;
      return { parsedScale, tonic: parsedScale[0] };
    } catch (error) {
      return { parsedScale: null, tonic: null };
    }
  }, [selectedScale]);

  const capitalizedMode = mode ? mode.charAt(0).toUpperCase() + mode.slice(1) : "";

  // Fetch data using custom hooks
  const { scaleInfo, isLoading: isScaleInfoLoading, isError: isScaleInfoError } = useScaleInfo();
  const {
    notePositions,
    isLoading: isNotePositionsLoading,
    isError: isNotePositionsError,
  } = useNotePositions();
  const {
    trackInfosFromDB,
    isLoading: isTrackInfosFromDBLoading,
    isError: isTrackInfosFromDBError,
  } = useTrackInfosFromDB(capitalizedMode, tonic ? encodeURIComponent(tonic) : "");

  // Initialize Spotify Player
  const { player, isPaused, currentTrack, isReady, play, pause, next, previous } = useSpotifyPlayer();

  // Redirect to getting-started page if there are errors
  useEffect(() => {
    if (isScaleInfoError || isNotePositionsError || isTrackInfosFromDBError) {
      router.push("/getting-started");
    }
  }, [isScaleInfoError, isNotePositionsError, isTrackInfosFromDBError, router]);

  // Redirect to getting-started page if required data is missing
  useEffect(() => {
    if (!mode || !parsedScale || !tonic) {
      router.push("/getting-started");
    }
  }, [mode, parsedScale, tonic, router]);

  // Play the track when the player is ready and we have track info
useEffect(() => {
  if (isReady && player && trackInfosFromDB && session?.accessToken) {
    player.getCurrentState().then(state => {
      if (!state) {
        player.connect().then(success => {
          if (success) {
            console.log("typeof spotify:track:${trackInfosFromDB.track_id}: ", typeof `spotify:track:${trackInfosFromDB.track_id}`); // string
            console.log("spotify:track:${trackInfosFromDB.track_id}: ", `spotify:track:${trackInfosFromDB.track_id}`); // spotify:track:5DiXcVovI0FcY2s0icWWUu
            play(); // Call the play function from the hook
          } else {
            console.error("Failed to connect player");
          }
        });
      }
    });
  }
}, [isReady, player, trackInfosFromDB, session, play]);


  if (isScaleInfoLoading || isNotePositionsLoading || isTrackInfosFromDBLoading) {
    return <div>Loading...</div>;
  }

  if (!scaleInfo || !notePositions || !trackInfosFromDB) {
    return <div>Data not available</div>;
  }

  const scaleDetails = scaleInfo[mode]?.find((info) => info.mode === mode && info.tonic === tonic);
  if (!scaleDetails) {
    return <div>Scale details not found</div>;
  }

  const noteSystemCaption = `${scaleDetails["church-mode"][0].toUpperCase()}${scaleDetails["church-mode"].slice(1)}`;
  const triads = notePositions.map((positions) =>
    positions.map((position) => parsedScale[position])
  );
  const scaleInclOctaveDeclarations = prepareScale(parsedScale);
  const triadsInclOctaveDeclarations = prepareTriad(triads);

  // console.log("session:", session);
  // console.log("session?.accessToken:", session?.accessToken);
  // console.log("session?.accessTokenExpires:", session?.accessTokenExpires);
  // console.log("session?.user:", session?.user);
  // console.log("session?.error:", session?.error);
  
  return (
    <>
      <ContentPage tonic={tonic} mode={mode} scaleInfo={scaleDetails} session={session} />
      <div className={stave__container}>
        <div className={stave__wrapper}>
          <ScaleNoteSystem scaleInclOctaveDeclarations={scaleInclOctaveDeclarations} />
          <p>
            {tonic} {mode} scale / {noteSystemCaption} mode
          </p>
        </div>
        <div className={stave__wrapper}>
          <TriadNoteSystem
            triadsInclOctaveDeclarations={triadsInclOctaveDeclarations}
            mode={mode}
            parsedScale={parsedScale}
          />
          <p>
            {tonic} {mode} triad | root position, 1st & 2nd inversion
          </p>
        </div>
      </div>
      <div>
        <h2>Spotify Player</h2>
        {isReady ? (
          currentTrack ? (
            <div>
              <p>Now Playing: {currentTrack.name} by {currentTrack.artists.map(artist => artist.name).join(', ')}</p>
              <button onClick={isPaused ? play : pause}>{isPaused ? 'Play' : 'Pause'}</button>
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
    </>
  );
};

export default Content;
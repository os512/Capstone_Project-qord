import { useEffect } from "react";
import useTrackInfosFromDB from "@utils/useTrackInfosFromDB";

export default function Content() {

	const {
		trackInfosFromDB,
		isLoading: isTrackInfosFromDBLoading,
		isError: isTrackInfosFromDBError,
	} = useTrackInfosFromDB("Minor", encodeURIComponent("F#"));

  console.log("trackInfosFromDB: ", trackInfosFromDB);

	// Redirect to getting-started page if there are errors
	useEffect(() => {
		if (isTrackInfosFromDBError) {
			// router.push("/getting-started");
      return <div>Seems there is no track found</div>;
		}
	}, [isTrackInfosFromDBError]);

	if (isTrackInfosFromDBLoading) {
		return <div>Loading...</div>;
	}

  const { artist_name, track_name, mode, key } = trackInfosFromDB;
	return (
		<div>
			{<p>Artist: {artist_name}</p>}
			{<p>Track: {track_name}</p>}
			{<p>Key: {`${key} ${mode}`}</p>}
		</div>
	);
}

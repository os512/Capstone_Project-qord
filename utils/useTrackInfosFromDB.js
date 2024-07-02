import useSWR from "swr";

const fetcher = async (url) => {
	const res = await fetch(url);

	if (!res.ok) {
		const error = new Error("An error occurred while fetching the data.");
		error.info = await res.json();
		error.status = res.status;
		throw error;
	}
	return res.json();
};

const useTrackInfosFromDB = (mode, key) => {
	// Since the `spotifymillionsongdataset` doesn't know any flat keys,
	// we need to adapt all flat keys to their enharmonic equivalents here:
	//
	if (key === "Db") {
		key = "C%23";
	} else if (key === "Eb") {
		key = "D%23";
	} else if (key === "Ab") {
		key = "G%23";
	} else if (key === "Bb") {
		key = "A%23";
	}

	console.log("key: ", key);

	const { data, error, isLoading } = useSWR(`/api/spotify/track?mode=${mode}&key=${key}`, fetcher);

	return {
		trackInfosFromDB: data,
		isLoading,
		isError: error,
	};
};

export default useTrackInfosFromDB;

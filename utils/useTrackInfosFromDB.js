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
  const { data, error, isLoading } = useSWR(`/api/spotify/track?mode=${mode}&key=${key}`, fetcher);
//   const { data, error, isLoading } = useSWR("/api/spotify/track?mode=Minor&key=F", fetcher);

  return {
    trackInfosFromDB: data,
    isLoading,
    isError: error,
  };
};

export default useTrackInfosFromDB;

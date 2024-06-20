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

const useNotePositions = () => {
  const { data, error, isLoading } = useSWR("/note-positions.json", fetcher);

  return {
    notePositions: data,
    isLoading,
    isError: error,
  };
};

export default useNotePositions;

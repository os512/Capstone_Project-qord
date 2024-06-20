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

const useFetchScaleInfo = () => {
	const { data, error, isLoading } = useSWR("/scales-info.json", fetcher);

	return {
		scaleInfo: data,
		isLoading,
		isError: error,
	};
};

export default useFetchScaleInfo;

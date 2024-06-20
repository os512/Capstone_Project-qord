// TODO OS: This custom hook is used only once (by `/pages/content.js`). Refactor all the other places in this project by reusing this hook, where data is fetched.

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

const useFetchData = (resource) => {
	const { data, error, isLoading } = useSWR(resource, fetcher);

	return {
		scaleInfo: data,
		isLoading,
		isError: error,
	};
};

export default useFetchData;

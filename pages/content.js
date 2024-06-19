import { useRouter } from "next/router";
import useSWR from "swr";

const URL = "/scales-info.json";

const fetcher = async (url) => {
	const res = await fetch(url);

	// If the status code is not in the range 200-299,
	// we still try to parse and throw it.
	if (!res.ok) {
		const error = new Error("An error occurred while fetching the data.");
		// Attach extra info to the error object.
		error.info = await res.json();
		error.status = res.status;
		throw error;
	}
	return res.json();
};

const Content = () => {
	const router = useRouter();
	const { mode, selectedScale } = router.query;

	const parsedScale = typeof selectedScale === "string" ? JSON.parse(selectedScale) : selectedScale;
	const tonic = parsedScale[0];

	const { data, error, isLoading, mutate } = useSWR(URL, fetcher, {});

	if (error) return <div>failed to load</div>;
	if (isLoading) return <div>loading...</div>;

	const scaleInfo = data[mode]
		.map((info) => info)
		.find((scale) => scale.mode === mode && scale.tonic === tonic);

	return (
		<>
			<h1>
				The {tonic} {`${mode[0].toUpperCase()}${mode.slice(1)}`} Scale{" "}
			</h1>
			<p>{scaleInfo.description}</p>
		</>
	);
};

export default Content;

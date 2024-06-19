import { useRouter } from "next/router";
import { signOut, signIn, useSession } from "next-auth/react";
import useSWR from "swr";
import AuthButton from "@components/AuthButton/AuthButton.js";
import { maintitle, description } from "@styles/Content.module.css";


const URL = "/scales-info.json";

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

const Content = () => {
	const { data: session } = useSession();
	const router = useRouter();
	const { mode, selectedScale } = router.query;
	const parsedScale = typeof selectedScale === "string" ? JSON.parse(selectedScale) : selectedScale;

	const { data, error, isLoading } = useSWR(URL, fetcher);

	if (error) return <div>failed to load</div>;
	if (isLoading) return <div>loading...</div>;

	if (!mode || !selectedScale) {
		router.push("/getting-started");
		return;
	}

	const tonic = parsedScale[0];
	const scaleInfo = data[mode]
		.map((info) => info)
		.find((scale) => scale.mode === mode && scale.tonic === tonic);


	if (session) {
		return (
			<>
				<h1 className={maintitle}>
					The {tonic} {`${mode[0].toUpperCase()}${mode.slice(1)}`} Scale{" "}
				</h1>
				<p className={description}>{scaleInfo.description}</p>
			</>
		);
	}
	return (
		<>
			<h1 className={maintitle}>You are not logged in!</h1>
			<AuthButton href="/getting-started">SignUp</AuthButton>
		</>
	);
};

export default Content;

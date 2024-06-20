import { useRouter } from "next/router";
import { signOut, signIn, useSession } from "next-auth/react";
import ContentPage from "@components/ContentPage/ContentPage";
import ScaleNoteSystem from "@components/Vexflow/ScaleNoteSystem";
import useFetchData from "@utils/useFetchData";
import prepareScale from "@utils/prepareScale";

const Content = () => {
	const { data: session } = useSession();
	const router = useRouter();
	const { mode, selectedScale } = router.query;

	const { scaleInfo, isLoading, isError } = useFetchData("/scales-info.json");

	if (isError) return <div>failed to load</div>;
	if (isLoading) return <div>loading...</div>;

	let parsedScale;
	try {
		parsedScale = typeof selectedScale === "string" ? JSON.parse(selectedScale) : selectedScale;
	} catch (error) {
		router.push("/getting-started");
		return;
	}

	if (!mode || !selectedScale) {
		router.push("/getting-started");
		return;
	}

	const tonic = parsedScale[0];
	const scaleDetails = scaleInfo[mode].find((info) => info.mode === mode && info.tonic === tonic);

	const noteSystemCaption = `${scaleDetails["church-mode"][0].toUpperCase()}${scaleDetails[
		"church-mode"
	].slice(1)}`;

	const scaleInclOctaveDeclarations = prepareScale(parsedScale);

	return (
		<>
			<ContentPage tonic={tonic} mode={mode} scaleInfo={scaleDetails} session={session} />
			<ScaleNoteSystem scaleInclOctaveDeclarations={scaleInclOctaveDeclarations} />
			<p>
				{tonic} {mode} Scale / {noteSystemCaption} mode
			</p>
		</>
	);
};

export default Content;

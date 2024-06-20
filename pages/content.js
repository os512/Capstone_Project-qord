import { useRouter } from "next/router";
import { signOut, signIn, useSession } from "next-auth/react";
import ContentPage from "@components/ContentPage/ContentPage";
import ScaleNoteSystem from "@components/Vexflow/ScaleNoteSystem";
import prepareScale from "@utils/prepareScale";
import { stave__wrapper } from "@styles/Content.module.css";
import useScaleInfo from "@utils/useScaleInfo";
import useNotePositions from "@utils/useNotePositions";

const Content = () => {
	const { data: session } = useSession();
	const router = useRouter();
	const { mode, selectedScale } = router.query;

	const { scaleInfo, isLoading: isScaleInfoLoading, isError: isScaleInfoError } = useScaleInfo();
	const { notePositions, isLoading: isNotePositionsLoading, isError: isNotePositionsError } = useNotePositions();
  
	if (isScaleInfoError || isNotePositionsError) return <div>failed to load</div>;
	if (isScaleInfoLoading || isNotePositionsLoading) return <div>loading...</div>;
  
	console.log("scaleInfo: ", scaleInfo);
	console.log("notePositions: ", notePositions);

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

	// console.log("scaleInclOctaveDeclarations: ", scaleInclOctaveDeclarations);

	return (
		<>
			<ContentPage tonic={tonic} mode={mode} scaleInfo={scaleDetails} session={session} />
			<div className={stave__wrapper}>
				<ScaleNoteSystem scaleInclOctaveDeclarations={scaleInclOctaveDeclarations} />
				<p>
					{tonic} {mode} scale / {noteSystemCaption} mode
				</p>
			</div>
		</>
	);
};

export default Content;

import React, { useMemo, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import ContentPage from "@components/ContentPage/ContentPage";
import ScaleNoteSystem from "@components/Vexflow/ScaleNoteSystem";
import TriadNoteSystem from "@components/Vexflow/TriadNoteSystem";
import prepareScale from "@utils/prepareScale";
import prepareTriad from "@utils/prepareTriad";
import { stave__container, stave__wrapper } from "@styles/Content.module.css";
import useScaleInfo from "@utils/useScaleInfo";
import useNotePositions from "@utils/useNotePositions";
import useTrackInfosFromDB from "@utils/useTrackInfosFromDB";

const Content = () => {
	const { data: session } = useSession();
	const router = useRouter();
	const { mode, selectedScale } = router.query;

	const parsedScaleAndTonic = useMemo(() => {
		if (!selectedScale) return { parsedScale: null, tonic: null };
		try {
			const parsedScale =
				typeof selectedScale === "string" ? JSON.parse(selectedScale) : selectedScale;
			return { parsedScale, tonic: parsedScale[0] };
		} catch (error) {
			router.push("/getting-started");
			return { parsedScale: null, tonic: null };
		}
	}, [selectedScale, router]);

	const { parsedScale, tonic } = parsedScaleAndTonic;

	const capitalizedMode = mode ? mode.slice(0, 1).toUpperCase() + mode.slice(1) : "";

	const { scaleInfo, isLoading: isScaleInfoLoading, isError: isScaleInfoError } = useScaleInfo();
	const {
		notePositions,
		isLoading: isNotePositionsLoading,
		isError: isNotePositionsError,
	} = useNotePositions();
	const {
		trackInfosFromDB,
		isLoading: isTrackInfosFromDBLoading,
		isError: isTrackInfosFromDBError,
	} = useTrackInfosFromDB(capitalizedMode, tonic ? encodeURIComponent(tonic) : "");

	useEffect(() => {
		if (isScaleInfoError || isNotePositionsError || isTrackInfosFromDBError) {
			router.push("/getting-started");
		}
	}, [isScaleInfoError, isNotePositionsError, isTrackInfosFromDBError, router]);

	useEffect(() => {
		if (!mode || !parsedScale || !tonic) {
			router.push("/getting-started");
		}
	}, [mode, parsedScale, tonic, router]);

	if (isScaleInfoLoading || isNotePositionsLoading || isTrackInfosFromDBLoading) {
		return <div>loading...</div>;
	}

	console.log("trackInfosFromDB: ", trackInfosFromDB);
	console.log("tonic: ", tonic);

	const scaleDetails = scaleInfo[mode].find((info) => info.mode === mode && info.tonic === tonic);

	const noteSystemCaption = `${scaleDetails["church-mode"][0].toUpperCase()}${scaleDetails[
		"church-mode"
	].slice(1)}`;

	const triads = notePositions.map((positions) =>
		positions.map((position) => parsedScale[position])
	);

	const scaleInclOctaveDeclarations = prepareScale(parsedScale);
	const triadsInclOctaveDeclarations = prepareTriad(triads);

	return (
		<>
			<ContentPage tonic={tonic} mode={mode} scaleInfo={scaleDetails} session={session} />
			<div className={stave__container}>
				<div className={stave__wrapper}>
					<ScaleNoteSystem scaleInclOctaveDeclarations={scaleInclOctaveDeclarations} />
					<p>
						{tonic} {mode} scale / {noteSystemCaption} mode
					</p>
				</div>
				<div className={stave__wrapper}>
					<TriadNoteSystem
						triadsInclOctaveDeclarations={triadsInclOctaveDeclarations}
						mode={mode}
						parsedScale={parsedScale}
					/>
					<p>
						{tonic} {mode} triad | root position, 1st & 2nd inversion
					</p>
				</div>
			</div>
		</>
	);
};

export default Content;

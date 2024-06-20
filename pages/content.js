import { useRouter } from "next/router";
import { signOut, signIn, useSession } from "next-auth/react";
import useSWR from "swr";
import ContentPage from "@components/ContentPage/ContentPage";
import ScaleNoteSystem from "@components/Vexflow/ScaleNoteSystem";

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

	const { data, error, isLoading } = useSWR("/scales-info.json", fetcher);

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

	const noteSystemCaption = `${scaleInfo["church-mode"][0].toUpperCase()}${scaleInfo[
		"church-mode"
	].slice(1)}`;

	/*************************************************
	 *** PREPARATION OF SCALES FOR THE NOTE SYSTEM ***
	 *************************************************/

	const ScalePreparator = (currentSelectedScaleArr) => {
		// Initialize array to store scales including octave declarations
		const scaleInclOctaveDeclarations = [];
		let octave;

		// Clear the existing scale before a new one is going to be displayed
		scaleInclOctaveDeclarations.length = 0;

		function addOctaveToNotes() {
			octave = 4;
			currentSelectedScaleArr.forEach((note) => {
				note += `/${octave}`; // e.g. "C/4"
				scaleInclOctaveDeclarations.push(note);
			});
		}

		// Add octave definition to each note in currentSelectedScaleArr array, and
		// define octave for repeated root note on top of scale conditionally
		switch (true) {
			case currentSelectedScaleArr.indexOf("C") === 0 ||
				currentSelectedScaleArr.indexOf("C#") === 0:
				addOctaveToNotes();
				// Add repeated root note and its octave definition on top of scale
				scaleInclOctaveDeclarations[7] =
					scaleInclOctaveDeclarations[0].slice(0, -2) + `/${octave + 1}`;
				break;

			case currentSelectedScaleArr.indexOf("B") === 0:
				addOctaveToNotes();
				// Compensate octave definition for consistent representation in note system
				scaleInclOctaveDeclarations[0] =
					scaleInclOctaveDeclarations[0].slice(0, -2) + `/${octave - 1}`;
				// Add repeated root note and its octave definition on top of scale
				scaleInclOctaveDeclarations[7] = scaleInclOctaveDeclarations[0].slice(0, -2) + `/${octave}`;
				break;
			case currentSelectedScaleArr.indexOf("B") !== 0:
				// Compensate octave definition for consistent representation in note system
				currentSelectedScaleArr.forEach((note, i) => {
					octave =
						i <= currentSelectedScaleArr.indexOf("B") || i <= currentSelectedScaleArr.indexOf("Bb")
							? 4
							: 5;
					note += `/${octave}`;
					scaleInclOctaveDeclarations.push(note);
				});
				// Add repeated root note and its octave definition on top of scale
				scaleInclOctaveDeclarations[7] = scaleInclOctaveDeclarations[0].slice(0, -2) + `/${octave}`;
				break;
			default:
				console.error("For this scale an octave declaration hasn't been defined, yet!");
		}
		return scaleInclOctaveDeclarations;
	};
	const scaleInclOctaveDeclarations = ScalePreparator(parsedScale);

	return (
		<>
			<ContentPage tonic={tonic} mode={mode} scaleInfo={scaleInfo} session={session} />
			<ScaleNoteSystem scaleInclOctaveDeclarations={scaleInclOctaveDeclarations} />
			<p>
				{tonic} {mode} Scale / {noteSystemCaption} mode
			</p>
		</>
	);
};

export default Content;

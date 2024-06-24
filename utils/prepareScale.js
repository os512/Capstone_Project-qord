const prepareScale = (currentSelectedScaleArr) => {
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
		case currentSelectedScaleArr.indexOf("C") === 0 || currentSelectedScaleArr.indexOf("C#") === 0:
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

export default prepareScale;

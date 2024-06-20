const prepareTriad = (currentSelectedTriadsArr) => {
	// Initialize array to store triads including octave declarations
	const triadsInclOctaveDeclarations = [];

	function populateTriadsInclOctaveDeclarations() {
		currentSelectedTriadsArr.forEach((currentSelectedTriadSingleArr) => {
			let octave;

			/**
			 * Adds an octave to each note in the currentSelectedTriadSingleArr array.
			 */
			function addOctaveToNotes(noteStr) {
				// Compensate octave definition for consistent representation in note system
				currentSelectedTriadSingleArr.forEach((note, i) => {
					octave = i >= currentSelectedTriadSingleArr.indexOf(noteStr) ? 5 : 4;
					note += `/${octave}`;
					triadsInclOctaveDeclarations.push(note);
				});
			}

			//  Define conditions, when octaves should be shifted
			switch (true) {
				case currentSelectedTriadSingleArr.indexOf("C") === 0 ||
					currentSelectedTriadSingleArr.indexOf("C#") === 0 ||
					currentSelectedTriadSingleArr.indexOf("Db") === 0 ||
					currentSelectedTriadSingleArr.indexOf("D") === 0:
					octave = 4;
					currentSelectedTriadSingleArr.forEach((note) => {
						note += `/${octave}`; // e.g. "C4"
						triadsInclOctaveDeclarations.push(note);
					});
					break;
				case currentSelectedTriadSingleArr.includes("C") &&
					currentSelectedTriadSingleArr.indexOf("C") !== 0:
					addOctaveToNotes("C");
					break;
				case currentSelectedTriadSingleArr.includes("C#") &&
					currentSelectedTriadSingleArr.indexOf("C#") !== 0:
					addOctaveToNotes("C#");
					break;
				case currentSelectedTriadSingleArr.includes("Db") &&
					currentSelectedTriadSingleArr.indexOf("Db") !== 0:
					addOctaveToNotes("Db");
					break;
				case currentSelectedTriadSingleArr.includes("D") &&
					currentSelectedTriadSingleArr.indexOf("D") !== 0:
					addOctaveToNotes("D");
					break;
				case currentSelectedTriadSingleArr.includes("E") &&
					currentSelectedTriadSingleArr.indexOf("E") !== 0:
					addOctaveToNotes("E");
					break;
				case currentSelectedTriadSingleArr.includes("B") &&
					currentSelectedTriadSingleArr.indexOf("B") === 0:
					currentSelectedTriadSingleArr.forEach((note, i) => {
						octave = i <= currentSelectedTriadSingleArr.indexOf("B") ? 4 : 5;
						note += `/${octave}`;
						triadsInclOctaveDeclarations.push(note);
					});

					break;
				case currentSelectedTriadSingleArr.indexOf("B") !== 0:
					currentSelectedTriadSingleArr.forEach((note, i) => {
						octave =
							i <= currentSelectedTriadSingleArr.indexOf("B") ||
							i <= currentSelectedTriadSingleArr.indexOf("Bb")
								? 4
								: 5;
						note += `/${octave}`;
						triadsInclOctaveDeclarations.push(note);
					});
					break;
				default:
					console.error("For this triad an octave declaration hasn't been defined, yet!");
			}
		});
	}
	populateTriadsInclOctaveDeclarations();
	return triadsInclOctaveDeclarations;
};

export default prepareTriad;

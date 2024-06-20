import React, { useEffect, useRef } from "react";
import Vex from "vexflow";

const ScaleNoteSystem = ({ scalesInclOctaveDeclarations }) => {
	const containerRef = useRef(null);

	useEffect(() => {
		// Copy the current value of containerRef to a variable
		const currentContainer = containerRef.current;

		if (currentContainer) {
			const { Renderer, Stave, StaveNote, Voice, Formatter, Accidental } = Vex.Flow;

			// Create an SVG renderer and attach it to the container div
			const renderer = new Renderer(currentContainer, Renderer.Backends.SVG);

			// Configure the rendering context
			renderer.resize(420, 130);
			const context = renderer.getContext();

			/****************************
			 ***** NOTES GENERATION *****
			 ****************************/

			// Map `scalesInclOctaveDeclarations` array to `StaveNote` object
			// Add `Accidental` modifier if a note has a length of 4 characters
			const notes = scalesInclOctaveDeclarations.map((note) => {
				if (note.length === 4) {
					return new StaveNote({
						keys: [`${note}`],
						duration: "8",
					}).addModifier(new Accidental(note[1]));
				} else {
					return new StaveNote({
						keys: [`${note}`],
						duration: "8",
					});
				}
			});

			/***********************************
			 ***** FORMAT AND OUTPUT NOTES *****
			 ***********************************/

			// Create a voice in 4/4 and add notes above
			const voice = new Voice({
				num_beats: 4,
				beat_value: 4,
			});
			voice.addTickables(notes);

			// Create a stave of width 400 at position 10, 40 on the canvas
			const stave = new Stave(10, 15, 400);
			// const stave = new Stave(10, 40, 400);

			// Add a clef and time signature
			stave.addClef("treble").addTimeSignature("4/4") /* .addKeySignature("Cm") */;

			// Connect it to the rendering context and draw
			stave.setContext(context).draw();

			// Format and justify the notes to 400 pixels
			new Formatter().joinVoices([voice]).format([voice], 315);

			// Render voice
			voice.draw(context, stave);
			// Cleanup function to be returned from useEffect
			return () => {
				// Check if the container has any child nodes (SVG elements in this case)
				while (currentContainer.firstChild) {
					// Remove the first child until all children are removed
					currentContainer.removeChild(currentContainer.firstChild);
				}
			};
		}
	}, [scalesInclOctaveDeclarations]);

	return <div ref={containerRef}></div>;
};

export default ScaleNoteSystem;

import React, { useEffect, useRef } from "react";
import Vex from "vexflow";

const TriadNoteSystem = ({ triadsInclOctaveDeclarations, mode, parsedScale }) => {
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

			const rootPos = triadsInclOctaveDeclarations.slice(0, 3);
			const firstInv = triadsInclOctaveDeclarations.slice(3, 6);
			const secondInv = triadsInclOctaveDeclarations.slice(6);

			// Compensate enharmonic equivalents not being correctly interpreted for definition of key signature
			const correctSelectedKey =
				mode === "minor"
					? parsedScale[0] === "Db"
						? "C#m"
						: parsedScale[0] === "Ab"
						? "G#m"
						: `${parsedScale[0]}m`
					: parsedScale[0];

			// Populate notes array with all 3 triad note positions
			const notes = [
				new StaveNote({
					keys: rootPos,
					duration: "q",
				}),
				new StaveNote({
					keys: firstInv,
					duration: "q",
				}),
				new StaveNote({
					keys: secondInv,
					duration: "q",
				}),
				new StaveNote({
					keys: ["b/4"],
					duration: "qr",
				}),
			];

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
			stave.addClef("treble").addTimeSignature("4/4").addKeySignature(correctSelectedKey);
			// stave.addClef("treble").addTimeSignature("4/4") /* .addKeySignature("Cm") */;

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
	}, [mode, parsedScale, triadsInclOctaveDeclarations]);

	return <div ref={containerRef}></div>;
};

export default TriadNoteSystem;

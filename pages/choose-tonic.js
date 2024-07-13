import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import AuthButton from "@components/AuthButton/AuthButton.js";
import Dropdown from "@components/Dropdown/Dropdown";
import { signOut, signIn, useSession } from "next-auth/react";
import { maintitle, transmit__mode_and_tonic } from "@styles/ChooseTonic.module.css";

const ChooseTonic = () => {
	const { data: session } = useSession();
	const [scales, setScales] = useState([]);
	const [selectedScale, setSelectedScale] = useState(null);

	const router = useRouter();
	const { mode } = router.query;

	const selectedMode = mode === "major" ? "" : "m";

	useEffect(() => {
		const fetchScales = async () => {
			try {
				if (!mode) {
					// Redirect to the 'getting-started' page if 'mode' is not available
					router.push("/getting-started");
					return;
				}
				const response = await fetch(`/scales-${mode}.json`);
				const fetchedScales = await response.json();
				setScales(fetchedScales);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchScales();
	}, [mode, router]);

	const handleScaleSelection = (scale) => {
		setSelectedScale(scale);
	};

	if (session) {
		return (
			<>
				<h1 className={maintitle}>Choose a Tonic</h1>
				<Dropdown scales={scales} mode={selectedMode} onScaleSelect={handleScaleSelection} />

				{selectedScale && (
					<Link
						className={transmit__mode_and_tonic}
						href={{
							pathname: "/content",
							query: { mode, selectedScale: JSON.stringify(selectedScale) },
						}}
					>
						Submit
					</Link>
				)}
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

export default ChooseTonic;

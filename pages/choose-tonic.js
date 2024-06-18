import Link from "next/link";
import React, { useState, useEffect } from "react";

import AuthButton from "@components/AuthButton/AuthButton.js";
import Dropdown from "@components/Dropdown/Dropdown";
import { signOut, signIn, useSession } from "next-auth/react";
import {
	maintitle,
} from "@styles/ChooseTonic.module.css";

const ChooseTonic = () => {
	const { data: session } = useSession();
	const [data, setData] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				// TODO OS: Implement logic on which `scale` (major, minor) should be fetched based on the user choice about `mode`
				const response = await fetch("/scales-major.json");
				const fetchedData = await response.json();
				setData(fetchedData);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
	}, []);

	if (session) {
		return (
			<>
				<h1 className={maintitle}>Choose a Tonic</h1>
				<Dropdown data={data} />
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

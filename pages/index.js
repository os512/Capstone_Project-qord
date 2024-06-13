import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { M_PLUS_Rounded_1c } from "next/font/google";
import NavBar from "../components/NavBar/NavBar.js";
import SignUpButton from "../components/SignUpButton/SignUpButton.js";

const mPlusRounded1cMainTitle = M_PLUS_Rounded_1c({
	weight: "800",
	subsets: ["latin"],
	display: "swap",
});

const mPlusRounded1cSubTitle = M_PLUS_Rounded_1c({
	weight: "500",
	subsets: ["latin"],
	display: "swap",
});

export default function Home() {
	return (
		<>
			<Head>
				<title>qord App</title>
				<meta name="description" content="Generated by create next app" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<header className={styles.header}>
				<NavBar showAuthLinks={true} />
			</header>
			<main className={styles.main}>
				<h1 className={mPlusRounded1cMainTitle.className}>qord: Your Melodic Compass </h1>
				<h2 className={mPlusRounded1cSubTitle.className}>
					Navigate Melodies with Just a Tonic and Mode Selection
				</h2>
				<SignUpButton>SignUp</SignUpButton>
			</main>
		</>
	);
}

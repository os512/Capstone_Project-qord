import Head from "next/head";
import NavBar from "@components/NavBar/NavBar";
import Main from "@components/Main/Main";
import Header from "@components/Header/Header";

export default function Main_Layout({ children }) {
	return (
		<>
			<Head>
				<title>qord App</title>
				<meta name="description" content="Generated by create next app" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Header>
				<NavBar />
			</Header>
			<Main>{children}</Main>
		</>
	);
}

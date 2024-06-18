import Link from "next/link";
import AuthButton from "@components/AuthButton/AuthButton.js";
import { signOut, signIn, useSession } from "next-auth/react";
import {
	maintitle,
	modes__container,
	link__modes,
	link__major,
	link__minor,
} from "@styles/GettingStarted.module.css";

const GettingStarted = () => {
	const { data: session } = useSession();

	if (session) {
		return (
			<>
				<h1 className={maintitle}>Choose a Mode</h1>
				<div className={modes__container}>
					<Link
						className={`${link__modes} ${link__major}`}
						href={{
							pathname: "/choose-tonic",
							query: { mode: "major" },
						}}
					>
						Major
					</Link>
					<Link
						className={`${link__modes} ${link__minor}`}
						href={{
							pathname: "/choose-tonic",
							query: { mode: "minor" },
						}}
					>
						Minor
					</Link>
				</div>
			</>
		);
	}

	return (
		<>
			<h1 className={maintitle}>You are not logged in!</h1>
			<AuthButton href="/">SignUp</AuthButton>
		</>
	);
};

export default GettingStarted;

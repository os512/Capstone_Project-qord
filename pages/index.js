import Link from "next/link";
import {
	hero__container,
	hero__maintitle,
	hero__subtitle,
	link__registerServices,
	getstarted__link,
} from "@styles/Home.module.css";
import AuthButton from "@components/AuthButton/AuthButton.js";
import Main from "@components/Main/Main";
import { signOut, signIn, useSession } from "next-auth/react";

export default function Home() {
	const { data: session } = useSession();

	if (session) {
		return (
			<Main>
				<div className={hero__container}>
					<h1 className={hero__maintitle}>Welcome to qord! </h1>
					<h2 className={hero__subtitle}>Are you ready?</h2>
					<Link className={link__registerServices} href={"/registerServices"}>
						Let&apos;s get started
					</Link>
				</div>
			</Main>
		);
	}

	return (
		<Main>
			<div className={hero__container}>
				<h1 className={hero__maintitle}>qord: Your Melodic Compass </h1>
				<h2 className={hero__subtitle}>
					Navigate Melodies with Just a Tonic <br /> and Mode Selection
				</h2>
				<AuthButton href="/register">SignUp</AuthButton>
			</div>
		</Main>
	);
}

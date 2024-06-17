import Link from "next/link";
import {
	hero__container,
	maintitle,
	subtitle,
	link__getstarted,
} from "@styles/Home.module.css";
import AuthButton from "@components/AuthButton/AuthButton.js";
import Main from "@components/Main/Main";
import { signOut, signIn, useSession } from "next-auth/react";

export default function Home() {
	const { data: session } = useSession();

	if (session) {
		return (
			<div className={hero__container}>
				<h1 className={maintitle}>Welcome to qord! </h1>
				<h2 className={subtitle}>Are you ready?</h2>
				<Link className={link__getstarted} href={"/getting-started"}>
					Let&apos;s get started
				</Link>
			</div>
		);
	}

	return (
		<div className={hero__container}>
			<h1 className={maintitle}>qord: Your Melodic Compass </h1>
			<h2 className={subtitle}>
				Navigate Melodies with Just a Tonic <br /> and Mode Selection
			</h2>
			<AuthButton href="/">SignUp</AuthButton>
		</div>
	);
}

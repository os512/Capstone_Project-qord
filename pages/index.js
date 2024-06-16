import { main, hero__container, hero__maintitle, hero__subtitle } from "@styles/Home.module.css";
import AuthButton from "@components/AuthButton/AuthButton.js";

export default function Home() {
	return (
		<>
			<main className={main}>
				<div className={hero__container}>
					<h1 className={hero__maintitle}>qord: Your Melodic Compass </h1>
					<h2 className={hero__subtitle}>
						Navigate Melodies with Just a Tonic <br /> and Mode Selection
					</h2>
					<AuthButton href="/register">SignUp</AuthButton>
				</div>
			</main>
		</>
	);
}

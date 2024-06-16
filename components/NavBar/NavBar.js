import Link from "next/link";
import Image from "next/image";
import styles from "./NavBar.module.css";

const NavBar = ({ showAuthLinks }) => (
	<div className={styles.navBar__container}>
		<div className={styles.qord__logo}>
			<a href="https://qord-app.vercel.app/">
				<Image
					src="/logo-qord_colored.svg"
					alt="qord Logo"
					className={`${styles.qord__logo}`}
					width={100}
					height={72}
					loading="eager"
					// fetchpriority="true" TODO OS: Why is this still throwing a warning?
				/>
			</a>
		</div>
		<ul className={styles.credentials__list}>
			{showAuthLinks && (
				<>
					<li>
						<Link className={styles.credentials__link} href={"/login"}>
							Login
						</Link>
					</li>
					<li>
						<Link className={styles.credentials__link} href={"/register"}>
							Register
						</Link>
					</li>
				</>
			)}
		</ul>
	</div>
);

export default NavBar;

import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./NavBar.module.css";

const NavBar = ({ showAuthLinks }) => (
	<>
		<div className={styles.qord__logo}>
			<a href="https://qord-app.vercel.app/">
				<Image
					src="/logo-qord_colored.svg"
					alt="qord Logo"
					className={`${styles.qord__logo}`}
					width={100}
					height={72}
					priority
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
	</>
);

export default NavBar;

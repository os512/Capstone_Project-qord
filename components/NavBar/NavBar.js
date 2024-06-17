import Image from "next/image";
import NavItems from "@components/NavItems/NavItems";
import styles from "./NavBar.module.css";

const NavBar = () => (
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
		<NavItems />
	</div>
);

export default NavBar;

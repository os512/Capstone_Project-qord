import styles from "./SignUpButton.module.css";
import Link from "next/link";

const SignUpButton = ({ children, href }) => (
	<Link href={href} className={styles.link}>
		<button className={styles.button__signUp}>{children}</button>
	</Link>
);

export default SignUpButton;

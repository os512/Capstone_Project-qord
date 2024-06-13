import styles from "./SignUpButton.module.css";

const SignUpButton = ({ children }) => (
	<button className={styles.button__signUp}>{children}</button>
);

export default SignUpButton;

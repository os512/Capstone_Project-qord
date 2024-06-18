import { btn, btn_login } from "./AuthButton.module.css";
import { signIn } from "next-auth/react";

const AuthButton = ({ href }) => {
	return (
		<button
			className={`${btn} ${btn_login}`}
			onClick={() => signIn(undefined, { callbackUrl: href })}
		>
			Sign in
		</button>
	);
};

export default AuthButton;

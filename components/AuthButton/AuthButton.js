import { btn, btn_login, btn_logout } from "./AuthButton.module.css";
import { signIn } from "next-auth/react";

const AuthButton = () => {
	return (
		<button className={`${btn} ${btn_login}`} onClick={() => signIn()}>
			Sign in
		</button>
	);
};

export default AuthButton;

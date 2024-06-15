import { btn, btn_login, btn_logout } from "./AuthButton.module.css";
import { signOut, signIn, useSession } from "next-auth/react";

const AuthButton = () => {
	const { data: session } = useSession();

	if (session) {
		return (
			<button className={`${btn} ${btn_logout}`} onClick={() => signOut()}>
				Sign out
			</button>
		);
	}
	return (
		<button className={`${btn} ${btn_login}`} onClick={() => signIn()}>
			Sign in
		</button>
	);
};

export default AuthButton;

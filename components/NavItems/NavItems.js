import Link from "next/link";
import Image from "next/image";
import { nav__list, nav__link, nav__avatar } from "./NavItems.module.css";
import { signOut, signIn, useSession } from "next-auth/react";

const NavItems = () => {
	const { data: session } = useSession();

	console.log("session: ", session);

	if (session) {
		const userName = session.user.name.split(" ")[0];
		const avatar = session.user.image;

		console.log("avatar: ", avatar);

		return (
			<ul className={nav__list}>
				<li>
					<Link
						className={nav__link}
						href={""}
						onClick={(event) => {
							event.preventDefault(); // TODO OS: Why does browser still reload?
							return signOut();
						}}
					>
						Logout
					</Link>
				</li>
				<li>
					<Link className={nav__link} href={"/profil"}>
						{userName}
					</Link>
				</li>
				<li>
					<Link className={nav__avatar} href={"/profil"}>
						<Image width={40} height={40} src={avatar} alt={"Avatar"} loading="eager" />
					</Link>
				</li>
			</ul>
		);
	}
	return (
		<ul className={nav__list}>
			<li>
				<Link className={nav__link} href={"/"} onClick={() => signIn()}>
					Login
				</Link>
			</li>
		</ul>
	);
};

export default NavItems;

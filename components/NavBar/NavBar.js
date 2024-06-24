import NavItems from "@components/NavItems/NavItems";
import Logo from "@components/Logo/Logo";
import { navBar__container } from "./NavBar.module.css";

const NavBar = () => (
	<div className={navBar__container}>
		<Logo />
		<NavItems />
	</div>
);

export default NavBar;

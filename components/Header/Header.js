import { header } from "./Header.module.css";
import NavBar from "@components/NavBar/NavBar";

const Header = () => {
	return (
		<header className={header}>
			<NavBar showAuthLinks={true} />
		</header>
	);
};

export default Header;

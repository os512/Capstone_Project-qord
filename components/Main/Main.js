import { M_PLUS_Rounded_1c } from "next/font/google";

const mPlusRounded1c = M_PLUS_Rounded_1c({
	weight: "800",
	subsets: ["latin"],
	display: "swap",
	fallback: ["system-ui", "sans-serif"],
});

const Main = ({ children }) => <main className={mPlusRounded1c.className}>{children}</main>;

export default Main;

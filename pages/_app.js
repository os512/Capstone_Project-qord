import "@/styles/globals.css";
import { M_PLUS_Rounded_1c } from "next/font/google";
import { SessionProvider } from "next-auth/react";

const mPlusRounded1c = M_PLUS_Rounded_1c({
	weight: "800",
	subsets: ["latin"],
	display: "swap",
	fallback: ["system-ui", "sans-serif"],
});

export default function App({ session, Component, pageProps }) {
	return (
		<SessionProvider session={session}>
			<main className={mPlusRounded1c.className}>
				<Component {...pageProps} />
			</main>
		</SessionProvider>
	);
}

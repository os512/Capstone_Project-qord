import "@styles/globals.css";
import { SessionProvider } from "next-auth/react";
import Main_Layout from "@components/Layouts/Main_Layout";

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Main_Layout>
        <Component {...pageProps} />
      </Main_Layout>
    </SessionProvider>
  );
}
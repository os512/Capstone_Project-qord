import Image from "next/image";

const Logo = () => (
	<a href="https://qord-app.vercel.app/">
		<Image src="/logo-qord_colored.svg" alt="qord Logo" width={100} height={72} loading="eager" />
	</a>
);

export default Logo;

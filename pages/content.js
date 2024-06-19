import { useRouter } from "next/router";

const Content = () => {
	const router = useRouter();
	const { mode, scales } = router.query;

	const parsedScales = typeof scales === "string" ? JSON.parse(scales) : scales;

	console.log("mode:", mode);
	console.log("Scales in content page:", parsedScales);

	// ...
};

export default Content;

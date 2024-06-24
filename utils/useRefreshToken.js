import useSWR from "swr";
import { useSession } from "next-auth/react";

const fetcher = (url) => fetch(url).then((res) => res.json());

const useRefreshToken = () => {
	const { data: session } = useSession();

	const { data, error } = useSWR(session ? "/api/auth/refresh-token" : null, fetcher, {
		refreshInterval: 1000 * 60 * 30, // Refresh every 30 minutes
	});

	return {
		accessToken: data?.access_token,
		isLoading: !error && !data,
		isError: error,
	};
};

export default useRefreshToken;

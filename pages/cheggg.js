import { useState, useEffect } from 'react';

export default function Content() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasData, setHasData] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTrack() {
      try {
        const res = await fetch('/api/spotify/track?mode=Minor&key=F');
        if (res.ok) {
          const data = await res.json();

		  console.log("data: ", data);
          setHasData(true);
        } else {
          setError('Failed to fetch track');
        }
      } catch (err) {
        setError('An error occurred while fetching the track');
      } finally {
        setIsLoading(false);
      }
    }

    fetchTrack();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {hasData ? (
        <p>Successfully fetched track data!</p>
      ) : (
        <p>No track data found.</p>
      )}
    </div>
  );
}

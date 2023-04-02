import { useEffect, useState } from "react";

export function useMediaQuery(query) {

  const [matches, setMatches] = useState(window.matchMedia(query).matches);

  useEffect(()=> {
    const listener = () => setMatches(window.matchMedia(query).matches);
    window.addEventListener('resize', listener);

    return () => window.removeEventListener('resize', listener);
  }, [matches, query]);
  
  return matches;
}
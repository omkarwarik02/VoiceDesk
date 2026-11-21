import { useEffect, useState } from "react";

/** True until the page has fully loaded and at least `minMs` has passed. */
export function useSplash(minMs = 900) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const started = performance.now();
    let timer: ReturnType<typeof setTimeout>;

    const finish = () => {
      const remaining = Math.max(0, minMs - (performance.now() - started));
      timer = setTimeout(() => setLoading(false), remaining);
    };

    if (document.readyState === "complete") finish();
    else window.addEventListener("load", finish, { once: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("load", finish);
    };
  }, [minMs]);

  return loading;
}

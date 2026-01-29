// hooks/useIsOnline.js
import { useState, useEffect } from "react";

const CHECK_URL = "https://www.google.com/generate_204"; // or your own /health endpoint
const TIMEOUT = 4000; // 4 seconds

async function checkRealConnection() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

    const response = await fetch(CHECK_URL, {
      method: "HEAD", // very light request
      cache: "no-store",
      mode: "no-cors", // important for google endpoint
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return navigator.onLine && response; // response exists → success
  } catch (err) {
    return false;
  }
}

export function useIsOnline() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    function handleOnline() {
      checkRealConnection().then(setIsOnline);
    }

    function handleOffline() {
      setIsOnline(false);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Initial check
    checkRealConnection().then(setIsOnline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
}

import { useEffect, useRef, useState } from "react";

export function useMarketData(symbol) {
  const [quote, setQuote] = useState(null);
  const [news, setNews] = useState([]);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");

  const activeRequestRef = useRef(0);

  useEffect(() => {
    const controller = new AbortController();
    const requestId = Date.now();
    activeRequestRef.current = requestId;

    async function request() {
      try {
        const response = await fetch(`/api/market?symbol=${symbol}`, {
          signal: controller.signal,
        });
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.error || "Failed to load market data.");
        }

        if (activeRequestRef.current !== requestId) return;

        setQuote(payload.quote || null);
        setNews(Array.isArray(payload.news) ? payload.news : []);
        setLastUpdated(payload.lastUpdated || "");
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Failed to load market data.");
        }
      }
    }

    request();
    return () => controller.abort();
  }, [symbol]);

  return { quote, news, error, lastUpdated };
}

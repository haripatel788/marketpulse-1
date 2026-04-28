import { useEffect, useRef, useState } from "react";

export function useMarketData(symbol) {
  const [quote, setQuote] = useState(null);
  const [news, setNews] = useState([]);
  const [candles, setCandles] = useState([]);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");

  const activeRequestRef = useRef(0);

  useEffect(() => {
    const controller = new AbortController();
    const requestId = Date.now();
    activeRequestRef.current = requestId;

    async function request() {
      try {
        setError("");
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
        const normalizedCandles = Array.isArray(payload.candles)
          ? payload.candles
              .filter(
                (point) =>
                  typeof point?.timestamp === "number" && typeof point?.close === "number"
              )
              .sort((a, b) => a.timestamp - b.timestamp)
          : [];
        setCandles(normalizedCandles);
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

  return { quote, news, candles, error, lastUpdated };
}

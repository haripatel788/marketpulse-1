import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

const BASE_URL = "https://finnhub.io/api/v1";

function marketApiPlugin(apiKey) {
  async function handleMarketRequest(req, res) {
    if (!apiKey) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          error:
            "Server is missing FINNHUB_API_KEY. Add it to your environment.",
        })
      );
      return;
    }

    const host = req.headers.host || "localhost";
    const requestUrl = new URL(req.url || "", `http://${host}`);
    const symbol = requestUrl.searchParams.get("symbol")?.trim().toUpperCase();

    if (!symbol || !/^[A-Z.-]{1,10}$/.test(symbol)) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Invalid symbol." }));
      return;
    }

    try {
      const now = Math.floor(Date.now() / 1000);
      const oneDay = 60 * 60 * 24;
      const from = String(now - oneDay * 30);
      const to = String(now);

      const quoteUrl = new URL(`${BASE_URL}/quote`);
      quoteUrl.searchParams.set("symbol", symbol);
      quoteUrl.searchParams.set("token", apiKey);

      const newsUrl = new URL(`${BASE_URL}/news`);
      newsUrl.searchParams.set("category", "general");
      newsUrl.searchParams.set("token", apiKey);

      const candleUrl = new URL(`${BASE_URL}/stock/candle`);
      candleUrl.searchParams.set("symbol", symbol);
      candleUrl.searchParams.set("resolution", "D");
      candleUrl.searchParams.set("from", from);
      candleUrl.searchParams.set("to", to);
      candleUrl.searchParams.set("token", apiKey);

      const [quoteRes, newsRes, candleRes] = await Promise.all([
        fetch(quoteUrl),
        fetch(newsUrl),
        fetch(candleUrl),
      ]);

      if (!quoteRes.ok) {
        const reason = await quoteRes.text();
        throw new Error(
          `Quote feed unavailable (${quoteRes.status}). ${
            reason || "Check your Finnhub key or limits."
          }`
        );
      }

      const quote = await quoteRes.json();

      let news = [];
      if (newsRes.ok) {
        news = await newsRes.json();
      }

      let candles = null;
      if (candleRes.ok) {
        candles = await candleRes.json();
      }

      const candlePoints =
        candles?.s === "ok" && Array.isArray(candles.t) && Array.isArray(candles.c)
          ? candles.t.map((timestamp, index) => ({
              timestamp,
              close: candles.c[index],
              high: candles.h?.[index],
              low: candles.l?.[index],
              open: candles.o?.[index],
              volume: candles.v?.[index],
            }))
          : [];

      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          quote,
          news: Array.isArray(news) ? news : [],
          candles: candlePoints,
          lastUpdated: new Date().toISOString(),
        })
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to fetch market data right now. Please retry.";
      const clientError = /Quote feed unavailable/.test(message);
      res.statusCode = clientError ? 503 : 502;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          error: message,
        })
      );
    }
  }

  return {
    name: "market-api-plugin",
    configureServer(server) {
      server.middlewares.use("/api/market", (req, res) => {
        handleMarketRequest(req, res);
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use("/api/market", (req, res) => {
        handleMarketRequest(req, res);
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const rootDir = fileURLToPath(new URL(".", import.meta.url));
  const env = loadEnv(mode, rootDir, "");
  const apiKey = env.FINNHUB_API_KEY || "";

  return {
    plugins: [react(), marketApiPlugin(apiKey)],
  };
});
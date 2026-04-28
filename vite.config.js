import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const BASE_URL = "https://finnhub.io/api/v1";

function marketApiPlugin() {
  async function handleMarketRequest(req, res) {
    const apiKey = globalThis.process?.env?.FINNHUB_API_KEY;

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
      const quoteUrl = new URL(`${BASE_URL}/quote`);
      quoteUrl.searchParams.set("symbol", symbol);
      quoteUrl.searchParams.set("token", apiKey);

      const newsUrl = new URL(`${BASE_URL}/news`);
      newsUrl.searchParams.set("category", "general");
      newsUrl.searchParams.set("token", apiKey);

      const [quoteRes, newsRes] = await Promise.all([
        fetch(quoteUrl),
        fetch(newsUrl),
      ]);

      if (!quoteRes.ok || !newsRes.ok) {
        throw new Error("Market provider request failed.");
      }

      const [quote, news] = await Promise.all([quoteRes.json(), newsRes.json()]);

      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          quote,
          news: Array.isArray(news) ? news : [],
          lastUpdated: new Date().toISOString(),
        })
      );
    } catch {
      res.statusCode = 502;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          error: "Unable to fetch market data right now. Please retry.",
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

export default defineConfig({
  plugins: [react(), marketApiPlugin()],
});
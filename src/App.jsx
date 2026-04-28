import { useEffect, useState } from "react";
import AppHeader from "./components/AppHeader";
import InlineAlert from "./components/InlineAlert";
import NewsPanel from "./components/NewsPanel";
import OverviewPanel from "./components/OverviewPanel";
import PricePanel from "./components/PricePanel";
import StatsGrid from "./components/StatsGrid";
import TradingDesk from "./components/TradingDesk";
import WatchlistPanel from "./components/WatchlistPanel";
import { useMarketData } from "./hooks/useMarketData";
import { useTradingSimulator } from "./hooks/useTradingSimulator";
import { useWatchlist } from "./hooks/useWatchlist";

export default function App() {
  const [input, setInput] = useState("AAPL");
  const [ticker, setTicker] = useState("AAPL");
  const [uiMessage, setUiMessage] = useState("");
  const { watchlist, addToWatchlist } = useWatchlist();
  const { quote, news, candles, error, lastUpdated } = useMarketData(ticker);
  const simulator = useTradingSimulator();
  const { markPrice } = simulator;

  function normalizeSymbol(value) {
    return value.trim().toUpperCase();
  }

  function handleSearch() {
    const symbol = normalizeSymbol(input);
    if (!symbol) {
      setUiMessage("Enter a ticker symbol before searching.");
      return;
    }

    setUiMessage("");
    setTicker(symbol);
    setInput(symbol);
  }

  function handleWatchPick(symbol) {
    setInput(symbol);
    setTicker(symbol);
    setUiMessage("");
  }

  function handleAddWatch() {
    const symbol = normalizeSymbol(input);
    if (!symbol) {
      setUiMessage("Enter a ticker symbol before adding to watchlist.");
      return;
    }

    const wasAdded = addToWatchlist(symbol);
    setUiMessage(wasAdded ? `Added ${symbol} to watchlist.` : `${symbol} is already in watchlist.`);
  }

  useEffect(() => {
    if (quote?.c) {
      markPrice(ticker, quote.c);
    }
  }, [quote?.c, ticker, markPrice]);

  return (
    <div
      className="min-h-screen bg-[#070A0F] px-4 py-6 text-[#D5DEF0] sm:px-6 lg:px-8"
      style={{
        fontFamily:
          '"IBM Plex Mono", "JetBrains Mono", "SFMono-Regular", Menlo, Monaco, Consolas, monospace',
        backgroundImage:
          "linear-gradient(rgba(18,25,37,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(18,25,37,0.7) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }}
    >
      <div className="mx-auto max-w-[1500px] space-y-4">
        <AppHeader
          input={input}
          onInputChange={setInput}
          onSearch={handleSearch}
          onAddWatch={handleAddWatch}
        />

        <InlineAlert message={error || uiMessage} />
        <StatsGrid ticker={ticker} quote={quote} />

        <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
          <OverviewPanel
            ticker={ticker}
            watchlistSize={watchlist.length}
            lastUpdated={lastUpdated}
          />
          <NewsPanel news={news} />
        </div>

        <WatchlistPanel
          watchlist={watchlist}
          activeTicker={ticker}
          onPick={handleWatchPick}
        />

        <div className="grid gap-4">
          <PricePanel ticker={ticker} candles={candles} previousClose={quote?.pc} />
          <TradingDesk
            ticker={ticker}
            quotePrice={quote?.c}
            simulator={simulator}
            setUiMessage={setUiMessage}
          />
        </div>
      </div>
    </div>
  );
}
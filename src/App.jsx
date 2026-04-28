import { useState } from "react";
import AppHeader from "./components/AppHeader";
import InlineAlert from "./components/InlineAlert";
import NewsPanel from "./components/NewsPanel";
import OverviewPanel from "./components/OverviewPanel";
import StatsGrid from "./components/StatsGrid";
import TradeSimulator from "./components/TradeSimulator";
import WatchlistPanel from "./components/WatchlistPanel";
import { useMarketData } from "./hooks/useMarketData";
import { useWatchlist } from "./hooks/useWatchlist";

export default function App() {
  const [input, setInput] = useState("AAPL");
  const [ticker, setTicker] = useState("AAPL");
  const [uiMessage, setUiMessage] = useState("");
  const { watchlist, addToWatchlist } = useWatchlist();
  const { quote, news, error, lastUpdated } = useMarketData(ticker);

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

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-4">
        <AppHeader
          input={input}
          onInputChange={setInput}
          onSearch={handleSearch}
          onAddWatch={handleAddWatch}
        />

        <InlineAlert message={error || uiMessage} />
        <StatsGrid ticker={ticker} quote={quote} />

        <div className="grid gap-4 xl:grid-cols-2">
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

        <TradeSimulator ticker={ticker} currentPrice={quote?.c} />
      </div>
    </div>
  );
}
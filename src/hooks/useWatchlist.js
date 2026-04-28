import { useEffect, useState } from "react";
import { DEFAULT_WATCHLIST, STORAGE_KEYS } from "../constants";

function sanitizeSymbol(value) {
  return value.trim().toUpperCase();
}

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.watchlist);
      if (!saved) return DEFAULT_WATCHLIST;
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : DEFAULT_WATCHLIST;
    } catch {
      return DEFAULT_WATCHLIST;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.watchlist, JSON.stringify(watchlist));
  }, [watchlist]);

  function addToWatchlist(rawSymbol) {
    const symbol = sanitizeSymbol(rawSymbol);
    if (!symbol) return false;

    let wasAdded = false;
    setWatchlist((prev) => {
      if (prev.includes(symbol)) return prev;
      wasAdded = true;
      return [...prev, symbol];
    });
    return wasAdded;
  }

  return {
    watchlist,
    addToWatchlist,
  };
}

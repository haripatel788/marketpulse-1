import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const STARTING_CASH = 100000;

export function useTradingSimulator() {
  const [cash, setCash] = useState(STARTING_CASH);
  const [positions, setPositions] = useState({});
  const [trades, setTrades] = useState([]);
  const [equityCurve, setEquityCurve] = useState(() => [
    {
      timestamp: Date.now(),
      equity: STARTING_CASH,
    },
  ]);

  const account = useMemo(() => {
    const marketValue = Object.values(positions).reduce(
      (sum, position) => sum + position.currentPrice * position.qty,
      0
    );
    const costBasis = Object.values(positions).reduce(
      (sum, position) => sum + position.avgPrice * position.qty,
      0
    );
    const unrealizedPnL = marketValue - costBasis;
    const realizedPnL = trades.reduce((sum, trade) => sum + (trade.realizedPnL || 0), 0);
    const equity = cash + marketValue;

    return {
      marketValue,
      unrealizedPnL,
      realizedPnL,
      equity,
      totalPnL: realizedPnL + unrealizedPnL,
      openPositions: Object.keys(positions).length,
    };
  }, [cash, positions, trades]);

  const lastEquityRef = useRef(STARTING_CASH);

  const markPrice = useCallback((symbol, price) => {
    if (!price || !symbol) return;
    setPositions((prev) => {
      const current = prev[symbol];
      if (!current) return prev;
      if (current.currentPrice === price) return prev;
      return {
        ...prev,
        [symbol]: {
          ...current,
          currentPrice: price,
        },
      };
    });
  }, []);

  const buy = useCallback(({ symbol, price, qty }) => {
    if (!symbol || !price || qty <= 0) return { ok: false, message: "Invalid trade input." };

    const cost = price * qty;
    if (cost > cash) return { ok: false, message: "Insufficient cash for this order." };

    setCash((prev) => prev - cost);
    setPositions((prev) => {
      const current = prev[symbol];
      if (!current) {
        return {
          ...prev,
          [symbol]: { qty, avgPrice: price, currentPrice: price },
        };
      }
      const totalQty = current.qty + qty;
      const avgPrice = (current.avgPrice * current.qty + price * qty) / totalQty;
      return {
        ...prev,
        [symbol]: { ...current, qty: totalQty, avgPrice, currentPrice: price },
      };
    });
    setTrades((prev) => [
      {
        side: "BUY",
        symbol,
        qty,
        price,
        timestamp: Date.now(),
      },
      ...prev.slice(0, 199),
    ]);

    return { ok: true, message: `Bought ${qty} ${symbol} @ $${price.toFixed(2)}` };
  }, [cash]);

  const sell = useCallback(({ symbol, price, qty }) => {
    if (!symbol || !price || qty <= 0) return { ok: false, message: "Invalid trade input." };

    const current = positions[symbol];
    if (!current || current.qty < qty) {
      return { ok: false, message: "Not enough shares to sell." };
    }

    const proceeds = price * qty;
    const realizedPnL = (price - current.avgPrice) * qty;
    setCash((prev) => prev + proceeds);
    setPositions((prev) => {
      const nextQty = prev[symbol].qty - qty;
      if (nextQty === 0) {
        const { [symbol]: _removed, ...rest } = prev;
        return rest;
      }
      return {
        ...prev,
        [symbol]: { ...prev[symbol], qty: nextQty, currentPrice: price },
      };
    });
    setTrades((prev) => [
      {
        side: "SELL",
        symbol,
        qty,
        price,
        realizedPnL,
        timestamp: Date.now(),
      },
      ...prev.slice(0, 199),
    ]);

    return { ok: true, message: `Sold ${qty} ${symbol} @ $${price.toFixed(2)}` };
  }, [positions]);

  const reset = useCallback(() => {
    setCash(STARTING_CASH);
    setPositions({});
    setTrades([]);
    setEquityCurve([{ timestamp: Date.now(), equity: STARTING_CASH }]);
    lastEquityRef.current = STARTING_CASH;
  }, []);

  useEffect(() => {
    if (account.equity === lastEquityRef.current) return;
    lastEquityRef.current = account.equity;
    setEquityCurve((prev) => [
      ...prev.slice(-179),
      { timestamp: Date.now(), equity: account.equity },
    ]);
  }, [account.equity]);

  return { cash, positions, trades, equityCurve, account, buy, sell, markPrice, reset };
}

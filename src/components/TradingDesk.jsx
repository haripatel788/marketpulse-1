import { useMemo, useState } from "react";
import { formatPrice } from "../utils/format";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

function parseQty(value) {
  const qty = Number(value);
  if (!Number.isFinite(qty)) return 0;
  return Math.max(0, Math.floor(qty));
}

function toneClass(number) {
  return number >= 0 ? "text-[#39D98A]" : "text-[#FF5D5D]";
}

export default function TradingDesk({ ticker, quotePrice, simulator, setUiMessage }) {
  const [qtyInput, setQtyInput] = useState("10");
  const qty = parseQty(qtyInput);
  const positionsArray = useMemo(
    () =>
      Object.entries(simulator.positions).map(([symbol, position]) => ({
        symbol,
        ...position,
        unrealizedPnL: (position.currentPrice - position.avgPrice) * position.qty,
      })),
    [simulator.positions]
  );

  function handleBuy() {
    const result = simulator.buy({ symbol: ticker, price: quotePrice, qty });
    setUiMessage(result.message);
  }

  function handleSell() {
    const result = simulator.sell({ symbol: ticker, price: quotePrice, qty });
    setUiMessage(result.message);
  }

  const equityData = simulator.equityCurve.map((point) => ({
    ...point,
    label: new Date(point.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
  }));
  const hasEquityHistory = equityData.length > 1;

  return (
    <section className="rounded-xl border border-[#2A2F39] bg-[#0F131A] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-mono text-sm uppercase tracking-[0.2em] text-[#95A0B4]">
          Trading Desk
        </h2>
        <button
          onClick={simulator.reset}
          className="rounded border border-[#8A2831] bg-[#3D1015] px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#F08D95] transition hover:bg-[#571822]"
        >
          Reset Account
        </button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded border border-[#243042] bg-[#111C29] p-3">
          <p className="font-mono text-[11px] uppercase text-[#7A8CA8]">Cash</p>
          <p className="mt-1 font-mono text-lg text-[#D5DEF0]">{formatPrice(simulator.cash)}</p>
        </div>
        <div className="rounded border border-[#243042] bg-[#111C29] p-3">
          <p className="font-mono text-[11px] uppercase text-[#7A8CA8]">Equity</p>
          <p className="mt-1 font-mono text-lg text-[#D5DEF0]">
            {formatPrice(simulator.account.equity)}
          </p>
        </div>
        <div className="rounded border border-[#243042] bg-[#111C29] p-3">
          <p className="font-mono text-[11px] uppercase text-[#7A8CA8]">Realized P&L</p>
          <p className={`mt-1 font-mono text-lg ${toneClass(simulator.account.realizedPnL)}`}>
            {formatPrice(simulator.account.realizedPnL)}
          </p>
        </div>
        <div className="rounded border border-[#243042] bg-[#111C29] p-3">
          <p className="font-mono text-[11px] uppercase text-[#7A8CA8]">Unrealized P&L</p>
          <p className={`mt-1 font-mono text-lg ${toneClass(simulator.account.unrealizedPnL)}`}>
            {formatPrice(simulator.account.unrealizedPnL)}
          </p>
        </div>
        <div className="rounded border border-[#243042] bg-[#111C29] p-3">
          <p className="font-mono text-[11px] uppercase text-[#7A8CA8]">Open Positions</p>
          <p className="mt-1 font-mono text-lg text-[#D5DEF0]">{simulator.account.openPositions}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.3fr_1fr]">
        <div className="rounded border border-[#2A2F39] bg-[#0B0F15] p-3">
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <p className="font-mono text-[11px] uppercase text-[#7A8CA8]">Symbol</p>
              <p className="font-mono text-xl text-[#E8EDF8]">{ticker}</p>
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase text-[#7A8CA8]">Mark Price</p>
              <p className="font-mono text-xl text-[#E8EDF8]">{formatPrice(quotePrice)}</p>
            </div>
            <div className="min-w-28">
              <p className="font-mono text-[11px] uppercase text-[#7A8CA8]">Quantity</p>
              <input
                type="number"
                min="1"
                value={qtyInput}
                onChange={(event) => setQtyInput(event.target.value)}
                className="mt-1 w-full rounded border border-[#2A2F39] bg-[#0F131A] px-2 py-1.5 font-mono text-sm text-[#D5DEF0] outline-none focus:border-[#4CC9F0]"
              />
            </div>
            <button
              onClick={handleBuy}
              className="rounded border border-[#1D6644] bg-[#123522] px-3 py-2 font-mono text-xs font-semibold uppercase tracking-widest text-[#79E5AE] transition hover:bg-[#17462C]"
            >
              Buy
            </button>
            <button
              onClick={handleSell}
              className="rounded border border-[#8A2831] bg-[#3D1015] px-3 py-2 font-mono text-xs font-semibold uppercase tracking-widest text-[#F08D95] transition hover:bg-[#571822]"
            >
              Sell
            </button>
          </div>

          <div className="mt-4 max-h-52 overflow-auto rounded border border-[#232834]">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-[#121925] text-[#7F8EA7]">
                <tr>
                  <th className="px-2 py-2">SYM</th>
                  <th className="px-2 py-2">QTY</th>
                  <th className="px-2 py-2">AVG</th>
                  <th className="px-2 py-2">MARK</th>
                  <th className="px-2 py-2">U.P&L</th>
                </tr>
              </thead>
              <tbody>
                {positionsArray.map((position) => (
                  <tr key={position.symbol} className="border-t border-[#1D2430] text-[#D3DBEC]">
                    <td className="px-2 py-2">{position.symbol}</td>
                    <td className="px-2 py-2">{position.qty}</td>
                    <td className="px-2 py-2">{formatPrice(position.avgPrice)}</td>
                    <td className="px-2 py-2">{formatPrice(position.currentPrice)}</td>
                    <td className={`px-2 py-2 ${toneClass(position.unrealizedPnL)}`}>
                      {formatPrice(position.unrealizedPnL)}
                    </td>
                  </tr>
                ))}
                {!positionsArray.length ? (
                  <tr>
                    <td colSpan="5" className="px-2 py-4 text-center text-[#6E7B92]">
                      No open positions
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded border border-[#2A2F39] bg-[#0B0F15] p-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#7A8CA8]">
            Equity Curve
          </p>
          <div className="mt-3 h-52">
            {hasEquityHistory ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={equityData}>
                  <CartesianGrid stroke="#1E2430" strokeDasharray="3 3" />
                  <XAxis dataKey="label" hide />
                  <YAxis tick={{ fill: "#74829A", fontSize: 10 }} />
                  <Tooltip
                    formatter={(value) =>
                      typeof value === "number" ? `$${value.toFixed(2)}` : value
                    }
                    contentStyle={{
                      background: "#0B0E13",
                      border: "1px solid #2A2F39",
                      borderRadius: "8px",
                      color: "#E6EAF2",
                    }}
                  />
                  <Line type="monotone" dataKey="equity" stroke="#4CC9F0" dot={false} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center rounded border border-dashed border-[#2A2F39] font-mono text-xs text-[#73819A]">
                Equity curve starts after your first trade.
              </div>
            )}
          </div>

          <div className="mt-4 max-h-52 overflow-auto rounded border border-[#232834]">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-[#121925] text-[#7F8EA7]">
                <tr>
                  <th className="px-2 py-2">TIME</th>
                  <th className="px-2 py-2">SIDE</th>
                  <th className="px-2 py-2">SYM</th>
                  <th className="px-2 py-2">QTY</th>
                  <th className="px-2 py-2">PRICE</th>
                </tr>
              </thead>
              <tbody>
                {simulator.trades.map((trade, index) => (
                  <tr key={`${trade.timestamp}-${index}`} className="border-t border-[#1D2430] text-[#D3DBEC]">
                    <td className="px-2 py-2">
                      {new Date(trade.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </td>
                    <td className={`px-2 py-2 ${trade.side === "BUY" ? "text-[#39D98A]" : "text-[#FF5D5D]"}`}>
                      {trade.side}
                    </td>
                    <td className="px-2 py-2">{trade.symbol}</td>
                    <td className="px-2 py-2">{trade.qty}</td>
                    <td className="px-2 py-2">{formatPrice(trade.price)}</td>
                  </tr>
                ))}
                {!simulator.trades.length ? (
                  <tr>
                    <td colSpan="5" className="px-2 py-4 text-center text-[#6E7B92]">
                      No trades yet
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

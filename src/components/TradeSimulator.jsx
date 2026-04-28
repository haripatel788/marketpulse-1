import { useMemo, useState } from "react";

function parseQuantity(raw) {
  const value = Number(raw);
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.floor(value));
}

export default function TradeSimulator({ ticker, currentPrice }) {
  const [quantityInput, setQuantityInput] = useState("1");
  const [positions, setPositions] = useState([]);

  function buy() {
    const qty = parseQuantity(quantityInput);
    if (!currentPrice || qty <= 0) return;

    setPositions((prev) => [
      ...prev,
      {
        symbol: ticker,
        entry: currentPrice,
        qty,
      },
    ]);
  }

  const portfolio = useMemo(() => {
    return positions.reduce(
      (acc, position) => {
        const baselineValue = position.entry * position.qty;
        const markValue = currentPrice ? currentPrice * position.qty : baselineValue;
        const pnl = markValue - baselineValue;
        return {
          value: acc.value + markValue,
          pnl: acc.pnl + pnl,
        };
      },
      { value: 0, pnl: 0 }
    );
  }, [positions, currentPrice]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Trade Simulator</h2>
        <button
          onClick={() => setPositions([])}
          className="rounded-lg border border-red-300 px-3 py-1.5 text-sm text-red-600 transition hover:bg-red-50"
        >
          Clear
        </button>
      </div>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          type="number"
          min="1"
          value={quantityInput}
          onChange={(event) => setQuantityInput(event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-500 sm:w-36"
          placeholder="Qty"
        />
        <button
          onClick={buy}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
        >
          Buy {ticker}
        </button>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
          Positions: {positions.length}
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
          Value: ${portfolio.value.toFixed(2)}
        </div>
        <div
          className={`rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm font-medium ${
            portfolio.pnl >= 0 ? "text-emerald-600" : "text-red-600"
          }`}
        >
          P/L: ${portfolio.pnl.toFixed(2)}
        </div>
      </div>

      <div className="mt-4 max-h-[220px] space-y-2 overflow-auto">
        {positions.map((position, index) => {
          const mark = currentPrice || position.entry;
          const pnl = (mark - position.entry) * position.qty;
          const pct = ((mark - position.entry) / position.entry) * 100;

          return (
            <div
              key={`${position.symbol}-${index}`}
              className="flex items-center justify-between rounded-lg border border-slate-200 p-3 text-sm"
            >
              <span className="text-slate-700">
                {position.symbol} x {position.qty} @ ${position.entry.toFixed(2)}
              </span>
              <span className={pnl >= 0 ? "text-emerald-600" : "text-red-600"}>
                ${pnl.toFixed(2)} ({pct.toFixed(2)}%)
              </span>
            </div>
          );
        })}

        {!positions.length ? (
          <p className="rounded-lg border border-dashed border-slate-300 p-3 text-sm text-slate-500">
            No simulated trades yet.
          </p>
        ) : null}
      </div>
    </section>
  );
}

export default function WatchlistPanel({ watchlist, activeTicker, onPick }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Watchlist</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {watchlist.map((symbol) => {
          const active = activeTicker === symbol;
          return (
            <button
              key={symbol}
              onClick={() => onPick(symbol)}
              className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                active
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              {symbol}
            </button>
          );
        })}
      </div>
    </section>
  );
}

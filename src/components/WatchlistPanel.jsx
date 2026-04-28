export default function WatchlistPanel({ watchlist, activeTicker, onPick }) {
  return (
    <section className="rounded-xl border border-[#2A2F39] bg-[#0F131A] p-4">
      <h2 className="font-mono text-sm uppercase tracking-[0.2em] text-[#95A0B4]">Watchlist Rack</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {watchlist.map((symbol) => {
          const active = activeTicker === symbol;
          return (
            <button
              key={symbol}
              onClick={() => onPick(symbol)}
              className={`rounded border px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider transition ${
                active
                  ? "border-[#4CC9F0] bg-[#12314A] text-[#A6E2FF]"
                  : "border-[#2A2F39] bg-[#0B0F15] text-[#A8B5CB] hover:bg-[#131B27]"
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

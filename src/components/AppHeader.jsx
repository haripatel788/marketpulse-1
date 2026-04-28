export default function AppHeader({ input, onInputChange, onSearch, onAddWatch }) {
  return (
    <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            MarketPulse
          </p>
          <h1 className="text-2xl font-semibold text-slate-900">
            Market Dashboard
          </h1>
          <p className="text-sm text-slate-500">
            Real-time quote tracking, watchlists, and simulator trades.
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <input
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm uppercase text-slate-900 outline-none transition focus:border-slate-500"
            value={input}
            onChange={(event) => onInputChange(event.target.value.toUpperCase())}
            placeholder="Ticker (e.g. AAPL)"
            maxLength={10}
          />
          <button
            onClick={onSearch}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Search
          </button>
          <button
            onClick={onAddWatch}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Add Watch
          </button>
        </div>
      </div>
    </header>
  );
}

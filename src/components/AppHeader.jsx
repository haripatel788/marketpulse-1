export default function AppHeader({ input, onInputChange, onSearch, onAddWatch }) {
  return (
    <header className="rounded-xl border border-[#2A2F39] bg-[#0F131A] p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#73819A]">
            MarketPulse // Desk
          </p>
          <h1 className="font-mono text-2xl font-semibold text-[#E8EDF8]">
            Live Execution Terminal
          </h1>
          <p className="font-mono text-xs text-[#95A0B4]">
            Real-time feed, discretionary execution simulator, and blotter analytics.
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <input
            className="w-full rounded border border-[#2A2F39] bg-[#0B0F15] px-3 py-2 font-mono text-sm uppercase text-[#D5DEF0] outline-none transition focus:border-[#4CC9F0]"
            value={input}
            onChange={(event) => onInputChange(event.target.value.toUpperCase())}
            placeholder="Ticker (e.g. AAPL)"
            maxLength={10}
          />
          <button
            onClick={onSearch}
            className="rounded border border-[#225980] bg-[#12314A] px-4 py-2 font-mono text-xs font-semibold uppercase tracking-widest text-[#9AD7FF] transition hover:bg-[#184567]"
          >
            Load Symbol
          </button>
          <button
            onClick={onAddWatch}
            className="rounded border border-[#30405A] bg-[#151D2A] px-4 py-2 font-mono text-xs font-semibold uppercase tracking-widest text-[#B5C3DB] transition hover:bg-[#1B2638]"
          >
            Add Watch
          </button>
        </div>
      </div>
    </header>
  );
}

import { formatNewsTime } from "../utils/format";

export default function NewsPanel({ news }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Market News</h2>
      <div className="mt-3 max-h-[520px] space-y-3 overflow-auto pr-1">
        {news.slice(0, 20).map((item) => (
          <a
            key={`${item.url}-${item.datetime}`}
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="block rounded-xl border border-slate-200 p-3 transition hover:border-slate-400 hover:bg-slate-50"
          >
            <p className="line-clamp-2 text-sm font-medium text-slate-900">
              {item.headline}
            </p>
            {item.summary ? (
              <p className="mt-1 line-clamp-2 text-xs text-slate-500">{item.summary}</p>
            ) : null}
            <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
              <span>{item.source || "Unknown source"}</span>
              <span>{formatNewsTime(item.datetime)}</span>
            </div>
          </a>
        ))}

        {!news.length ? (
          <p className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
            No news available right now.
          </p>
        ) : null}
      </div>
    </section>
  );
}

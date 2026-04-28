import { formatNewsTime } from "../utils/format";

export default function NewsPanel({ news }) {
  return (
    <section className="rounded-xl border border-[#2A2F39] bg-[#0F131A] p-4">
      <h2 className="font-mono text-sm uppercase tracking-[0.2em] text-[#95A0B4]">News Wire</h2>
      <div className="mt-3 max-h-[520px] space-y-3 overflow-auto pr-1">
        {news.slice(0, 20).map((item) => (
          <a
            key={`${item.url}-${item.datetime}`}
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="block rounded border border-[#232A36] bg-[#0B0F15] p-3 transition hover:border-[#34557B]"
          >
            <p className="line-clamp-2 font-mono text-xs font-semibold uppercase tracking-wide text-[#DCE6F7]">
              {item.headline}
            </p>
            {item.summary ? (
              <p className="mt-1 line-clamp-2 text-xs text-[#8A97AF]">{item.summary}</p>
            ) : null}
            <div className="mt-2 flex items-center justify-between font-mono text-[11px] text-[#697891]">
              <span>{item.source || "Unknown source"}</span>
              <span>{formatNewsTime(item.datetime)}</span>
            </div>
          </a>
        ))}

        {!news.length ? (
          <p className="rounded border border-dashed border-[#2E3644] p-4 font-mono text-xs text-[#7A8CA8]">
            No news available right now.
          </p>
        ) : null}
      </div>
    </section>
  );
}

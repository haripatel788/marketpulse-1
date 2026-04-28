import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function formatAxisDate(timestamp) {
  return new Date(timestamp * 1000).toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });
}

function formatCompactNumber(value) {
  if (typeof value !== "number") return "--";
  return new Intl.NumberFormat(undefined, { notation: "compact" }).format(value);
}

export default function PricePanel({ ticker, candles = [], previousClose }) {
  const chartData = candles.map((point) => ({
    ...point,
    date: formatAxisDate(point.timestamp),
  }));
  const hasPriceData = chartData.length > 1;
  const hasVolumeData = chartData.some((point) => typeof point.volume === "number");

  return (
    <section className="rounded-xl border border-[#2A2F39] bg-[#0F131A] p-4">
      <h2 className="font-mono text-sm uppercase tracking-[0.2em] text-[#95A0B4]">
        Price Tape / {ticker}
      </h2>
      <div className="mt-4 h-64">
        {hasPriceData ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4CC9F0" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#4CC9F0" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#222834" strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fill: "#8290A8", fontSize: 11 }} minTickGap={28} />
              <YAxis domain={["auto", "auto"]} tick={{ fill: "#8290A8", fontSize: 11 }} />
              <Tooltip
                formatter={(value) => (typeof value === "number" ? `$${value.toFixed(2)}` : value)}
                contentStyle={{
                  background: "#0B0E13",
                  border: "1px solid #2A2F39",
                  borderRadius: "8px",
                  color: "#E6EAF2",
                }}
              />
              {typeof previousClose === "number" ? (
                <ReferenceLine
                  y={previousClose}
                  stroke="#7A8CA8"
                  strokeDasharray="4 4"
                  ifOverflow="extendDomain"
                />
              ) : null}
              <Area type="monotone" dataKey="close" stroke="#4CC9F0" fill="url(#priceFill)" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center rounded border border-dashed border-[#2A2F39] font-mono text-xs text-[#73819A]">
            Price history unavailable for this symbol.
          </div>
        )}
      </div>

      <div className="mt-4 h-40">
        {hasVolumeData ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid stroke="#1F2530" strokeDasharray="3 3" />
              <XAxis dataKey="date" hide />
              <YAxis tick={{ fill: "#73819A", fontSize: 10 }} tickFormatter={formatCompactNumber} />
              <Tooltip
                formatter={(value) => formatCompactNumber(value)}
                contentStyle={{
                  background: "#0B0E13",
                  border: "1px solid #2A2F39",
                  borderRadius: "8px",
                  color: "#E6EAF2",
                }}
              />
              <Line type="monotone" dataKey="volume" stroke="#F9A826" dot={false} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center rounded border border-dashed border-[#2A2F39] font-mono text-xs text-[#73819A]">
            Volume series unavailable.
          </div>
        )}
      </div>
    </section>
  );
}

# MarketPulse

MarketPulse is a terminal-style market dashboard built with React + Vite + Tailwind.
It includes live quote tracking, news feed monitoring, a persistent watchlist, and a full trading simulator with account analytics.

## Highlights

- **High-finance terminal UI** with dense, data-first layout and chart panels
- **Secure API architecture** using a server-side proxy route (`/api/market`) so your Finnhub key is never exposed to the browser
- **Live market workspace** with ticker search, quote stats, price/volume charts, and news wire
- **Trading simulator** with:
  - buy/sell orders by quantity
  - cash + position tracking
  - realized and unrealized P&L
  - trade blotter
  - equity curve chart
- **Resilient data handling** with request cancellation, stale-response protection, and fallback handling for partial upstream feed failures

## Tech Stack

- `React` (UI)
- `Vite` (build/dev server)
- `Tailwind CSS` (styling)
- `Recharts` (charting)

## Project Structure

```text
src/
  components/
    AppHeader.jsx
    InlineAlert.jsx
    NewsPanel.jsx
    OverviewPanel.jsx
    PricePanel.jsx
    StatsGrid.jsx
    TradingDesk.jsx
    WatchlistPanel.jsx
  hooks/
    useMarketData.js
    useTradingSimulator.js
    useWatchlist.js
  utils/
    format.js
  constants.js
  App.jsx
```

## Quick Start

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create your env file:

   ```bash
   cp .env.example .env
   ```

3. Add your Finnhub key in `.env`:

   ```bash
   FINNHUB_API_KEY=your_finnhub_key_here
   ```

4. Start development server:

   ```bash
   npm run dev
   ```

5. Open `http://localhost:5173`

## Available Scripts

- `npm run dev` — start local dev server
- `npm run build` — create production build
- `npm run preview` — preview production build locally
- `npm run lint` — run ESLint checks

## Data Flow

1. Frontend requests `GET /api/market?symbol=...`
2. Vite server middleware calls Finnhub endpoints server-side:
   - quote
   - news
   - candles
3. Server returns normalized payload to frontend
4. UI updates charts, cards, and simulator mark prices

## Security Notes

- Do **not** use `VITE_FINNHUB_API_KEY` for this app; it would expose secrets to the client bundle.
- Keep only `FINNHUB_API_KEY` in `.env`.
- If a key was ever committed or exposed in logs/devtools, rotate it immediately.

## Troubleshooting

- **`/api/market` returns 500**
  - Ensure `.env` exists and contains `FINNHUB_API_KEY`
  - Restart dev server after changing env values

- **`/api/market` returns 502/503**
  - Finnhub may be rate-limiting or rejecting the key
  - Try again after a short wait and verify key validity

- **Charts show fallback/empty states**
  - Some symbols may not have full candle/volume coverage in the selected window
  - Quote panel can still function even when auxiliary series are unavailable

## License

For educational and personal project use unless you define otherwise.

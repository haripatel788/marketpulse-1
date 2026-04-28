# MarketPulse

MarketPulse is a lightweight market dashboard with watchlist tracking, live quote data, market news, and a simple trade simulator.

## What's Improved

- Refactored from one large `App.jsx` into smaller UI and hook modules.
- Added server-side market data proxy (`/api/market`) so API keys are not exposed to browsers.
- Added request cancellation and stale request protection to avoid race-condition bugs while searching quickly.
- Added visible loading and error states.
- Upgraded trade simulator to support quantity-based buys.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env` (or copy from `.env.example`) and add:

   ```bash
   FINNHUB_API_KEY=your_finnhub_key_here
   ```

3. Start dev server:

   ```bash
   npm run dev
   ```

## Notes

- The frontend calls `/api/market?symbol=...`; the server route injects `FINNHUB_API_KEY`.
- If your old key was committed/exposed, rotate it in Finnhub before reusing this project.

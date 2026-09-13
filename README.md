# IMDb Clone — Next.js 14 App Router & Enterprise Features

A modern, high-performance **IMDb Clone** migrated from Create React App (CRA) to **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **TanStack Query**, **Framer Motion**, and **IndexedDB**.

The platform is engineered with production-ready architecture: Server Components by default, incremental static regeneration (ISR), real-time cross-tab synchronization, client-side offline storage, resilient API abstractions with rate limiting and circuit breaking, and accessible UI interactions.

---

## 🚀 Key Features

### 1. TMDb / OMDb API Abstraction Layer
- **Token-Bucket Rate Limiter**: Client- and server-safe rate limiter preventing 429 throttling.
- **Retry with Exponential Backoff & Jitter**: Automatic retry mechanism handling transient network failures.
- **Circuit Breaker**: Prevents cascading failures when upstream services degrade.
- **Server-Side Tag-Based Revalidation**: Next.js cache tags (`revalidateTag`) for granular on-demand cache purges (`/api/revalidate`).
- **TanStack Query Integration**: Request deduplication, cache garbage collection, and link-hover prefetching (`prefetchOnHover`).
- **Real-Time Telemetry**: Latency tracking, cache hit ratios, and error logging accessible via `/api/telemetry`.

### 2. Rich Movie Details Page (`/movie/[id]`)
- **Parallel Server Component Data Fetching**: Parallelized RSC streams for metadata, ratings, cast, and reviews.
- **Request Coalescing**: Concurrent identical in-flight server requests are collapsed into a single execution.
- **ETag & HTTP 304 Caching**: Server computes SHA-1 ETags; returns `304 Not Modified` on unchanged requests.
- **Accessible Lightbox / Trailer Modal**: Framer Motion animated modal with focus-trapping (`Tab`/`Shift+Tab`), keyboard shortcuts (`Esc`, `ArrowLeft`, `ArrowRight`), and ARIA dialog attributes.
- **Progressive Suspense Hydration**: Cast section streamed progressively with skeleton fallback loaders.

### 3. Actor Profile & Virtualized Filmography (`/actor/[id]`)
- **Incremental Static Regeneration (ISR)**: Pre-rendered top actors at build time (`generateStaticParams`), statically revalidated on background timer (`revalidate = 3600`).
- **60fps Virtualized List Explorer**: High-performance windowed virtual rendering (`FilmographyVirtualExplorer`) capable of rendering hundreds of credits smoothly.
- **Multi-Criteria Filtering**: Filter by release year range, genre tags, role department (Acting/Directing/Writing), and sort order (rating, year, title).

### 4. Persistent Theming System
- **Themes Supported**: `Dark` (IMDb Gold & Charcoal), `Light`, `High-Contrast` (WCAG AAA compliant), and `Auto` (system preference detection).
- **Zero SSR Flash**: Theme preference stored in cookies (`theme=...`) and parsed server-side in `layout.tsx` before initial paint.
- **Micro-Interactions & A11y**: Framer Motion layout pill selector with `prefers-reduced-motion` detection.

### 5. Community Review & Moderation System
- **Full CRUD Operations**: Users can submit, view, vote, edit, and delete reviews.
- **Zod Validation Schema**: Validates rating (1–10), review title (min 5 chars), and content (min 20 chars).
- **Debounced Autosave Drafts**: Unsubmitted reviews automatically saved to IndexedDB (`review_drafts`) every 500ms; restored seamlessly on return or reload.
- **Wilson Score Ranking**: Mathematically proven binomial proportion confidence interval formula ranks reviews by helpfulness rather than naive difference.
- **Soft-Delete with 6-Second Undo Toast**: Deleting a review queues a 6-second grace period with an instant "Undo" toast before permanent removal.
- **Community Moderation**: Modal workflow to report reviews for spam, harassment, or spoilers.

### 6. Multi-Device Watchlist & Cross-Tab Sync
- **Dual-Layer Cache**: LocalStorage for fast synchronous reads combined with IndexedDB for structured, persistent offline storage.
- **Real-Time Cross-Tab Synchronization**: `BroadcastChannel("imdb_watchlist_sync")` notifies all open browser tabs instantly when items are added or removed.
- **Optimistic UI with Rollback**: Instant UI feedback on toggle; automatic state rollback with toast notification if backend synchronization fails.
- **Failure Simulation Button**: Interactive testing button on `/watchlist` to simulate network errors and verify rollback mechanics.
- **Framer Motion Micro-Animations**: Animated bookmark morph, heart pulse, and golden particle burst.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server Actions, Route Handlers)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & Vanilla CSS variables
- **State & Data Fetching**: [TanStack Query v5](https://tanstack.com/query), [React Context](https://react.dev/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Storage**: [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) & LocalStorage
- **Validation**: [Zod](https://zod.dev/)
- **Icons**: Lucide React / SVG Icons

---

## 📂 Project Structure

```
imdb-clone/
├── public/                     # Static public assets
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root server layout with cookie theme hydration
│   │   ├── page.tsx            # Home page with hero carousel & movie categories
│   │   ├── globals.css         # CSS variables & theme tokens
│   │   ├── loading.tsx         # Global loading skeleton
│   │   ├── error.tsx           # Global error boundary
│   │   ├── movie/[id]/         # Movie details page (RSC + Suspense + Lightbox)
│   │   ├── actor/[id]/         # Actor ISR page + virtualized explorer
│   │   ├── watchlist/          # Multi-device watchlist view with rollback testing
│   │   ├── movies/             # All movies browse page
│   │   ├── top-rated/          # Top 250 rated movies page
│   │   ├── coming-soon/        # Anticipated releases
│   │   ├── awards/             # Award winners showcase
│   │   └── api/                # Next.js Route Handlers
│   │       ├── movies/         # List movies (pagination & search)
│   │       ├── movies/[id]/    # Single movie details (ETag support)
│   │       ├── reviews/        # CRUD reviews & Wilson score sorting
│   │       ├── reviews/[id]/vote/   # Upvote/downvote reviews
│   │       ├── reviews/[id]/flag/   # Moderation flag handler
│   │       ├── watchlist/      # Watchlist backend sync & error simulation
│   │       ├── telemetry/      # API metrics & cache performance
│   │       └── revalidate/     # Tag-based ISR cache invalidation
│   ├── components/
│   │   ├── Navbar.tsx          # Navigation header with live watchlist counter & theme toggle
│   │   ├── movie/              # Movie-specific components (Media modal, Cast section)
│   │   ├── actor/              # FilmographyVirtualExplorer (virtualized list)
│   │   ├── reviews/            # ReviewSystem, review form, draft banner, moderation modal
│   │   ├── watchlist/          # WatchlistButton with spring micro-interactions
│   │   ├── theme/              # ThemeProvider & ThemeToggle pill
│   │   ├── providers/          # QueryProvider (TanStack Query client)
│   │   └── ui/                 # Skeletons, ErrorBoundary, Toast
│   └── lib/
│       ├── api/                # API client, rate limiter, retry, circuit breaker, coalescer, telemetry
│       ├── reviews/            # Zod validation schemas, Wilson score algorithm
│       ├── storage/            # IndexedDB promise wrapper
│       ├── watchlist/          # Watchlist store with BroadcastChannel sync
│       └── data/               # High-fidelity mock dataset fallback
├── next.config.js              # Next.js build configuration
├── tailwind.config.js          # Tailwind CSS theme extension
├── tsconfig.json               # Strict TypeScript settings
└── package.json                # Project scripts and dependencies
```

---

## 🏃 Getting Started

### Prerequisites
- Node.js 18.17+ or higher
- npm 9+ or pnpm / yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/siddhihiran/imdb-clone.git
cd imdb-clone

# Install dependencies
npm install
```

### Environment Variables (Optional)
The application includes a rich built-in mock fallback dataset that works 100% offline out-of-the-box. To stream live data directly from external APIs, create a `.env.local` file in the root directory:

```env
# The Movie Database (TMDb) API Key
TMDB_API_KEY=your_tmdb_api_key_here

# Open Movie Database (OMDb) API Key
OMDB_API_KEY=your_omdb_api_key_here
```

### Development Server
Run the Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
Test and run the optimized production bundle:
```bash
npm run build
npm start
```

### Deploying to Vercel
1. Import repository `siddhihiran/imdb-clone` into [Vercel](https://vercel.com/).
2. Keep **Root Directory** as `./` (default root).
3. Framework Preset: **Next.js** (auto-detected).
4. Click **Deploy**.

---

## 📡 API Endpoints

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/movies?cursor=...&limit=10` | `GET` | Paginated movie catalog with cursor support |
| `/api/movies/:id` | `GET` | Single movie details with ETag caching (`304 Not Modified`) |
| `/api/reviews?movieId=:id&sort=wilson` | `GET` | Fetches reviews sorted by Wilson score confidence |
| `/api/reviews` | `POST` | Validated review creation via Zod |
| `/api/reviews/:id` | `PUT` / `DELETE` | Updates or deletes an existing review |
| `/api/reviews/:id/vote` | `POST` | Upvote or downvote a review |
| `/api/reviews/:id/flag` | `POST` | Report review to moderation queue |
| `/api/watchlist` | `GET` / `POST` / `DELETE` | Watchlist sync backend with `?fail=true` rollback test |
| `/api/telemetry` | `GET` | Latency, cache hit ratio, and error metrics |
| `/api/revalidate?tag=...` | `POST` | On-demand Next.js cache tag revalidation |

---

## 🛡️ License

This project is open source and available under the [MIT License](LICENSE).

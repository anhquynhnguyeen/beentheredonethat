# beentheredonethat — Setup Guide

A personal travel archive. Countries, cities, places, photos — all in one GitHub repository.

---

## Prerequisites

- Node.js 18+ (install from https://nodejs.org)
- A GitHub account
- Basic comfort with a terminal

---

## 1. Install dependencies

```bash
cd beentheredonethat
npm install
```

---

## 2. Run locally

```bash
npm run dev
```

Open http://localhost:5173 in your browser. The world map loads immediately.

---

## 3. Folder structure

```
beentheredonethat/
├── public/
│   └── images/             ← Your photos go here
│       ├── nl/
│       │   └── amsterdam/
│       │       └── rijksmuseum_01.jpg
│       └── jp/
│           └── tokyo/
│               └── senso-ji_01.jpg
│
├── src/
│   ├── data/               ← Your travel data (JSON)
│   │   ├── countries.json
│   │   ├── cities.json
│   │   ├── places.json
│   │   └── trips.json
│   │
│   ├── components/         ← UI building blocks
│   │   ├── maps/           ← Leaflet map components
│   │   └── forms/          ← Admin Mode forms
│   │
│   ├── pages/              ← One file per route
│   ├── utils/              ← Data loading, helpers, storage
│   └── index.css           ← Tailwind + custom styles
│
├── vite.config.js          ← Set base to your repo name
├── tailwind.config.js
└── package.json
```

---

## 4. Adding your travels

### Option A — Edit JSON files directly (recommended for bulk entry)

Edit `src/data/countries.json`, `cities.json`, `places.json`.
Each file is an array of objects — see the existing examples for the schema.

After editing, run `npm run dev` to preview, then commit.

### Option B — Use Admin Mode in the browser

1. Run `npm run dev`
2. Navigate to `/admin` (or click "Admin" in the nav)
3. Add countries, cities, and places using the forms
4. Click **Export JSON** to download the updated files
5. Replace `src/data/*.json` with the downloaded files
6. Commit and push

Changes made through Admin Mode are stored in your browser's localStorage
until you export and commit them. The orange dot in the nav means you have
uncommitted local changes.

---

## 5. Adding photos

1. Place your images in `public/images/`:
   ```
   public/images/[country_code]/[city_id]/[filename].jpg
   ```
   Example:
   ```
   public/images/nl/amsterdam/rijksmuseum_01.jpg
   ```

2. Reference the path in `places.json`:
   ```json
   {
     "id": "rijksmuseum",
     "photos": ["images/nl/amsterdam/rijksmuseum_01.jpg"]
   }
   ```

3. Photos support captions when stored as objects:
   ```json
   "photos": [
     { "src": "images/nl/amsterdam/rijksmuseum_01.jpg", "caption": "The Gallery of Honour" }
   ]
   ```

---

## 6. Deploy to GitHub Pages

### First-time setup

1. Create a new GitHub repository named `beentheredonethat`

2. Update `vite.config.js`:
   ```js
   base: '/beentheredonethat/',   // ← must match your repo name exactly
   ```

3. Push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/beentheredonethat.git
   git push -u origin main
   ```

4. Deploy:
   ```bash
   npm run deploy
   ```

   This runs `vite build` then `gh-pages -d dist`, which pushes the built
   site to a `gh-pages` branch.

5. In your GitHub repo → Settings → Pages:
   - Source: **Deploy from branch**
   - Branch: **gh-pages**
   - Folder: **/ (root)**

Your site will be live at:
`https://YOUR_USERNAME.github.io/beentheredonethat/`

### Subsequent deployments

```bash
# Make changes, then:
npm run deploy
```

---

## 7. Using a custom domain

1. Add a `CNAME` file to `public/`:
   ```
   travel.yourdomain.com
   ```

2. Set your domain's DNS CNAME to `YOUR_USERNAME.github.io`

3. Update `vite.config.js`:
   ```js
   base: '/',
   ```

4. In `src/main.jsx`, consider switching to `<BrowserRouter>` for cleaner URLs
   (requires your host to support SPA fallback, which custom domains on GitHub Pages do not).

---

## 8. Data schemas

### Country
```json
{
  "id": "nl",                    // unique slug (auto-generated from name)
  "name": "Netherlands",
  "code": "NL",                  // ISO 3166-1 alpha-2 — used for map highlighting
  "continent": "Europe",
  "firstVisited": "2019-04-12",  // YYYY-MM-DD
  "lastVisited": "2023-09-05",
  "timesVisited": 3,
  "coverPhoto": "",              // path relative to public/
  "notes": "...",
  "tags": ["cycling", "museums"]
}
```

### City
```json
{
  "id": "amsterdam",
  "countryId": "nl",             // must match a country id
  "name": "Amsterdam",
  "lat": 52.3676,                // decimal degrees — find at latlong.net
  "lng": 4.9041,
  "firstVisited": "2019-04-12",
  "lastVisited": "2023-09-05",
  "timesVisited": 3,
  "coverPhoto": "",
  "notes": "...",
  "tags": ["canals", "museums"]
}
```

### Place
```json
{
  "id": "rijksmuseum",
  "cityId": "amsterdam",         // must match a city id
  "countryId": "nl",             // must match a country id
  "name": "Rijksmuseum",
  "category": "Museum",          // see PLACE_CATEGORIES in utils/helpers.js
  "lat": 52.36,
  "lng": 4.885,
  "dateVisited": "2019-04-13",
  "description": "Public-facing description of the place.",
  "notes": "Personal notes — only you will see these.",
  "photos": ["images/nl/amsterdam/rijksmuseum_01.jpg"],
  "rating": 5,                   // 1–5
  "tags": ["art", "must-see"]
}
```

---

## 9. Future enhancements

The codebase is structured to make these easy to add later:

- **Travel timeline** — trips.json is already populated; add a `/timeline` page
- **Search** — add a search input that filters across `dataLoader.js` accessors
- **Year filtering** — filter by `dateVisited.slice(0, 4)` in any list page
- **Statistics dashboard** — a `/stats` page using data from `getStats()`
- **GitHub API writes** — replace `saveStorage()` in `storage.js` with a GitHub
  Contents API PUT request to commit JSON changes without downloading files

---

## 10. Troubleshooting

**Map doesn't load countries**
The world GeoJSON is fetched from GitHub CDN at runtime. Check your network connection.
The fetch URL is in `src/components/maps/WorldMap.jsx`.

**Country not highlighted on the map**
Verify the `code` field in `countries.json` matches the ISO 3166-1 alpha-2 code
(2-letter, uppercase). Check against https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2.

**Photos don't appear**
- Path in JSON: `images/nl/amsterdam/filename.jpg` (no leading slash)
- File on disk: `public/images/nl/amsterdam/filename.jpg`
- After adding files to `public/`, restart `npm run dev`

**GitHub Pages shows blank page**
- Confirm `base` in `vite.config.js` exactly matches your repo name (case-sensitive)
- Confirm the `gh-pages` branch exists (it's created by `npm run deploy`)
- Wait 2–3 minutes after deployment for GitHub to propagate

**HashRouter vs BrowserRouter**
The app uses `HashRouter` by default for GitHub Pages compatibility.
URLs look like `/#/countries`. If you deploy to Netlify/Vercel/Cloudflare Pages
with a `_redirects` or `vercel.json` fallback, switch to `BrowserRouter` in `main.jsx`.

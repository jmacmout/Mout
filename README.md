# Mout — Your outdoor life, mapped.

A high-fidelity iOS prototype for the Mout app — a social adventure platform for hikers, climbers, and outdoor enthusiasts. Built as a single-file React app with a dark/teal glass design system, running entirely in the browser with no build step required.

---

## Screens

### 🏠 Home
Personalized feed with your adventure stats, a tab-filtered card scroll (Recent / Upcoming / Friends), and a glanceable header with your avatar and handle.

### 🗺️ Map
Full-screen interactive map powered by MapTiler with post cards, a search bar, and a floating action button for creating new adventures.

### 👥 Friends
Social feed showing adventures from people you follow — with likes, comments, verified badges, and relation tags.

### 📅 Plan
Group adventure planning hub. Browse upcoming adventures, RSVP (Going / Maybe / Can't Go), view trail details with AllTrails links, see who's going, and leave comments. Create new adventures with a full form — name, trail, date/time, description, and guest invites.

### 👤 Profile
Your personal profile with a stacked scrollable adventure card deck, friend/adventure stats, and quick access to edit your profile and settings.

---

## Tech Stack

- **React 18** via ESM CDN (no build step, no bundler)
- **Lucide React** for icons
- **MapTiler SDK** for interactive maps
- **Pure JavaScript** (`React.createElement`) — no JSX, no transpilation
- Runs on any static file server

---

## Getting Started

1. **Clone the repo**
   ```bash
   git clone https://github.com/jmacmout/Mout.git
   cd Mout
   ```

2. **Add your MapTiler API key**
   ```bash
   cp config.example.js config.js
   # Open config.js and replace YOUR_MAPTILER_KEY_HERE with your key
   # Get a free key at https://cloud.maptiler.com/account/keys
   ```

3. **Serve the app**
   ```bash
   # Any static server works, e.g.:
   python3 -m http.server 3456
   # Then open http://localhost:3456
   ```

> **Note:** `config.js` is gitignored to keep your API key private. Never commit it.

---

## Design System

| Token | Value |
|---|---|
| Background | `#14141F` |
| Card | `#1C1C28` |
| Cyan accent | `#00CFFF` |
| Glass blur | `blur(18px) saturate(180%)` |
| Font (headings) | Manrope / SF Pro Display |
| Font (body) | SF Pro Text |

The prototype is designed for a **390 × 844px** viewport (iPhone 14 / 15 standard).

---

## Project Structure

```
Mout/
├── index.html          # Entire app — all screens, data, and styles
├── config.js           # Your MapTiler API key (gitignored)
├── config.example.js   # Safe template to share
├── package.json        # Optional — only needed if using Vite dev server
└── vite.config.js      # Optional Vite config
```

---

## License

MIT

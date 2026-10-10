# My Mandarin

A pinyin-first Mandarin app that remembers what you know. Installable on iPhone and Android from GitHub Pages. No build step: edit the files directly.

## Files

| File | What it does |
|---|---|
| `index.html` | The page that loads everything |
| **Content** | |
| `data/essentials.js` | **The Essentials word bank.** Edit words here |
| `data/sentences.js` | **Sentence patterns and replies** |
| **Engine** | |
| `js/store.js` | Saves progress on the device, plus backup/restore |
| `js/memory.js` | Decides how well you know each word and when it's due |
| `js/session.js` | Builds vocab sessions and answer choices |
| `js/sentences.js` | Makes sentences from the patterns, picks decoy tiles, tracks patterns |
| `js/pinyin.js` | Tone colours |
| **Screens** | |
| `js/app.js` | The core: navigation and shared pieces |
| `js/screens/home.js` | Home, the Essentials hub, topics |
| `js/screens/vocab.js` | Vocab modes and one-at-a-time questions |
| `js/screens/match.js` | Quick Match |
| `js/screens/sentences.js` | Sentences page and activities |
| `js/screens/settings.js` | Settings and Word Bank |
| `js/screens/results.js` | The end-of-session screen |
| `css/app.css` | All the styling |
| `sw.js` | Offline support |
| `manifest.json`, `icons/` | What the phone uses when you install the app |

## Editing words

Open `data/essentials.js`. Each word looks like this:

```js
{ id: "food:cha", py: "chá", say: "chah", en: "tea", group: "food" },
```

- **Never change an `id`** once you've used the app: progress is stored against it. To add a word, give it a new id.
- Use `|` between syllables of one word (`péng|you`) so tone colours work. It isn't shown.
- The order of the list is the order New Words teaches them, 4 at a time.

## Editing sentences

Open `data/sentences.js`. The comment at the top explains how a pattern works.
- `PATTERNS` make the Surreal Sentences section (any word in any slot).
- `SECTIONS` (further down) are the four sensible sections. Their slots only take words that fit, such as `drink` or `temp`.
- The easiest changes: add a word to a slot list (with its English in `THINGS`), or add a reply to a section, copying an existing one.

## After any change

Open `sw.js` and change `VERSION` (e.g. `v0.1.0` → `v0.1.1`). Installed copies only pick up new files when this changes.

## Publishing on GitHub Pages

Put this folder in a GitHub repository, then turn on Pages under **Settings → Pages**. The app works from any folder path, e.g. `https://yourname.github.io/repo/mandarin-app/`.

## Installing

- **Android (Chrome):** Settings → Install app.
- **iPhone:** open the page in Safari, tap Share, then Add to Home Screen.
- Progress belongs to each device. Use **Settings → Save backup** to keep it safe or move it to another device.

# My Mandarin Games

A small static website for daily Mandarin vocabulary practice. It can be hosted directly with GitHub Pages: no build command, database or server is required.

## Updating the vocabulary

Edit `vocab-data.js`. Each word is stored once and is then used by:

- Topic Match
- Mixed Match
- Type the English
- Type the Pinyin

Copy an existing word line into the appropriate topic and change these values:

```js
{ id: "food:dòufu", hanzi: "豆腐", pinyin: "dòufu", english: "tofu", pronunciation: "doh-foo", accepted: [] },
```

The `id` must be unique. Add alternative English answers inside `accepted`, separated by commas, for example `accepted: ["store", "shop"]`.

The sentence games have specialised vocabulary and grammar inside their own HTML files. They have deliberately been left separate so existing sentence generation continues to work unchanged.

The three newer fixed sentence collections keep their phrase data in:

- `home-people-data.js`
- `directions-plans-data.js`
- `casual-phrases-data.js`

Number patterns and the number-game ranges are stored in `numbers-data.js` and `number-quiz.js`.

## Progress

The matching and typing games save lightweight word progress in the browser. The **Words to revisit** mode in **Type the Pinyin** uses mistakes from these games. Progress belongs to that browser and device; it is not uploaded to GitHub.

## Publishing on GitHub Pages

Upload all the files together, preserving their filenames. GitHub Pages should serve `index.html` as the homepage. Because the links are relative, the site works either at a repository URL or under a custom domain.

/* Shared "no-repeat" rotation helpers.
   Plain Math.random() picking has no memory, so with a modest vocab pool the
   same words (or the same sentence generator) can cluster within a session —
   it never actually feels random even though it technically is. These helpers
   fix that by remembering what was drawn recently and avoiding it. */
(function () {

  // A shuffled-bag picker: deals every item once in a random order before any
  // item repeats, like drawing cards from a shuffled deck without replacement
  // until it runs out and gets reshuffled. Call .next() each time you need
  // one item. Much less clustering than re-shuffling the whole pool and just
  // taking the first N each round.
  function createBag(items) {
    let bag = [];
    function refill() {
      bag = items.slice();
      for (let i = bag.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [bag[i], bag[j]] = [bag[j], bag[i]];
      }
    }
    return {
      next() {
        if (bag.length === 0) refill();
        return bag.pop();
      },
      // Deal `n` items, refilling mid-deal as needed (used for e.g. a 10-word round).
      // Skips an item that fails `reject(item, alreadyChosen)` so callers can avoid
      // near-duplicates (same pinyin, homophone clashes, etc.) within one deal.
      deal(n, reject) {
        const out = [];
        let guard = n * 20 + 20; // avoid an infinite loop if reject() is too strict
        while (out.length < n && guard-- > 0) {
          const item = this.next();
          if (reject && reject(item, out)) continue;
          out.push(item);
        }
        return out;
      }
    };
  }

  // Recency-weighted picker for a small, fixed set of options (e.g. which
  // sentence generator/mode to use next). Recently-picked options become much
  // less likely to be picked again for the next few draws, then recover.
  // Good for "don't show the same sentence pattern twice in a row" without
  // banning it outright.
  function createRecencyPicker(keys) {
    const lastPickedAt = {};
    let turn = 0;
    return {
      next() {
        turn++;
        const weights = keys.map(k => {
          const seenAt = lastPickedAt[k];
          if (seenAt === undefined) return 1;
          const gap = turn - seenAt;
          // Sharply reduced weight right after being picked, recovering over ~4 turns.
          return Math.min(1, gap / 4) ** 2 || 0.02;
        });
        const total = weights.reduce((a, b) => a + b, 0);
        let r = Math.random() * total;
        for (let i = 0; i < keys.length; i++) {
          r -= weights[i];
          if (r <= 0) { lastPickedAt[keys[i]] = turn; return keys[i]; }
        }
        const k = keys[keys.length - 1];
        lastPickedAt[k] = turn;
        return k;
      }
    };
  }

  window.MandarinRotation = { createBag, createRecencyPicker };
}());

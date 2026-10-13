// Compatibility scoring.
//
// A "unit" is one comparison between two answers:
//   solo item  -> A's answer vs B's answer
//   pair item  -> two units: A top vs B bottom, and B top vs A bottom
//
// Answer values: 0..4 (Hard no .. Love it), "skip" (section skipped, counts as
// 0), or undefined (prompt didn't apply or wasn't answered, unit is left out).
//
// Each unit is classified by the lower and higher of the two answers:
//   neither partner above Neutral -> not scored (both 0 = shared limit)
//   both Into it or Love it       -> match      (1.0)
//   one into it, other Neutral    -> open       (0.5)
//   one into it, other Hesitant   -> hesitant   (0.25)
//   one into it, other Hard no    -> conflict   (0)
// Mutual no's are left out of the score so two people who decline everything
// don't come out "100% compatible".

import { CATEGORIES } from "./questions.js";

export const UNIT_SCORE = { match: 1, open: 0.5, hesitant: 0.25, conflict: 0 };

const num = (v) => (v === "skip" ? 0 : v);

export function classify(a, b) {
  if (a === undefined || b === undefined || a === null || b === null) return null;
  const x = num(a), y = num(b);
  const hi = Math.max(x, y), lo = Math.min(x, y);
  if (hi <= 2) return hi === 0 ? "limit" : "neither";
  if (lo >= 3) return "match";
  if (lo === 2) return "open";
  if (lo === 1) return "hesitant";
  return "conflict";
}

// people: { a: {name, answers}, b: {name, answers} } where answers maps prompt key -> value
export function buildUnits(a, b) {
  const units = [];
  for (const cat of CATEGORIES) {
    for (const item of cat.items) {
      if (item.kind === "solo") {
        const va = a.answers[item.id], vb = b.answers[item.id];
        units.push({ cat: cat.id, item, dir: null, first: va, second: vb, kind: classify(va, vb) });
      } else {
        // A gives (top), B receives (bottom)
        const t1 = a.answers[`${item.id}:t`], b1 = b.answers[`${item.id}:b`];
        units.push({ cat: cat.id, item, dir: "ab", first: t1, second: b1, kind: classify(t1, b1) });
        // B gives (top), A receives (bottom)
        const t2 = b.answers[`${item.id}:t`], b2 = a.answers[`${item.id}:b`];
        units.push({ cat: cat.id, item, dir: "ba", first: t2, second: b2, kind: classify(t2, b2) });
      }
    }
  }
  return units;
}

function summarize(units) {
  const counts = { match: 0, open: 0, hesitant: 0, conflict: 0, limit: 0, neither: 0, missing: 0 };
  let sum = 0, scored = 0;
  for (const u of units) {
    if (u.kind === null) { counts.missing++; continue; }
    counts[u.kind]++;
    if (u.kind in UNIT_SCORE) { sum += UNIT_SCORE[u.kind]; scored++; }
  }
  return { score: scored ? Math.round((sum / scored) * 100) : null, scored, counts };
}

export function compare(a, b) {
  const units = buildUnits(a, b);
  const overall = summarize(units);
  const categories = CATEGORIES.map((cat) => {
    const cu = units.filter((u) => u.cat === cat.id);
    return { cat, ...summarize(cu), units: cu };
  });
  const strength = (u) => num(u.first) + num(u.second);
  const pick = (kinds) => units.filter((u) => kinds.includes(u.kind));
  return {
    units,
    overall,
    categories,
    matches: pick(["match"]).sort((x, y) => strength(y) - strength(x)),
    talk: pick(["open", "hesitant"]).sort((x, y) => strength(y) - strength(x)),
    conflicts: pick(["conflict"]).sort((x, y) => strength(y) - strength(x)),
    limits: pick(["limit"]),
  };
}

// Readable "who does what" for a unit, from the two people's names.
export function unitParties(u, nameA, nameB) {
  if (u.dir === null) return { first: nameA, second: nameB, firstRole: null, secondRole: null };
  const giver = u.dir === "ab" ? nameA : nameB;
  const receiver = u.dir === "ab" ? nameB : nameA;
  return { first: giver, second: receiver, firstRole: u.item.topRole, secondRole: u.item.bottomRole };
}

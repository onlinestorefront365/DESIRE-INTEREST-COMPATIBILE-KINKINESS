import { test } from "node:test";
import assert from "node:assert/strict";
import {
  CATEGORIES, PROMPTS, ITEM_BY_ID, promptApplies, screenerKeys,
  isScreenedOut, livePrompts, effectiveAnswers, followUpsSkippedBy,
} from "../js/questions.js";
import { compare } from "../js/scoring.js";

const BODIES = [["p", "v"], ["v", "p"], ["p", "p"], ["v", "v"], ["a", "a"]];
const hetero = (p) => promptApplies(p, "p", "v");
const ITEMS = CATEGORIES.flatMap((c) => c.items);

test("every gate points at a screener in the same section that comes first", () => {
  const order = new Map(PROMPTS.map((p, i) => [p.key, i]));
  for (const cat of CATEGORIES) {
    for (const item of cat.items.filter((i) => i.gate)) {
      const s = ITEM_BY_ID[item.gate];
      assert.ok(s, `${item.id} gates on missing ${item.gate}`);
      assert.ok(s.screener, `${item.gate} is not marked as a screener`);
      assert.ok(cat.items.includes(s), `${item.id} gates on ${item.gate} from another section`);
      assert.ok(!s.gate, `screener ${s.id} is itself gated`);
    }
  }
  for (const p of PROMPTS) {
    for (const k of screenerKeys(p)) assert.ok(order.get(k) < order.get(p.key), `${k} must come before ${p.key}`);
  }
});

test("every screener gates at least one follow-up", () => {
  for (const s of ITEMS.filter((i) => i.screener)) {
    assert.ok(ITEMS.some((i) => i.gate === s.id), `${s.id} gates nothing`);
  }
});

test("a follow-up is never shown when its screener can't be shown", () => {
  for (const [self, partner] of BODIES) {
    for (const p of PROMPTS.filter((x) => x.item.gate && promptApplies(x, self, partner))) {
      for (const k of screenerKeys(p)) {
        const s = PROMPTS.find((x) => x.key === k);
        assert.ok(promptApplies(s, self, partner), `${p.key} shows but screener ${k} doesn't (${self}/${partner})`);
      }
    }
  }
});

test("not into anal at all: the anal section is two questions", () => {
  const answers = { "anyanal:t": 0, "anyanal:b": 0 };
  const anal = livePrompts(answers, hetero).filter((p) => p.cat === "anal");
  assert.deepEqual(anal.map((p) => p.key), ["anyanal:t", "anyanal:b"]);
});

test("no to receiving anal still asks the giving side", () => {
  const answers = { "anyanal:t": 3, "anyanal:b": 0 };
  const anal = livePrompts(answers, hetero).filter((p) => p.cat === "anal");
  assert.ok(anal.some((p) => p.key === "peg:t"), "pegging your partner should be asked");
  assert.ok(!anal.some((p) => p.key === "peg:b"), "being pegged should be skipped");
  assert.ok(anal.every((p) => p.side !== "bottom" || p.item.screener));
});

test("Hesitant or above on a screener asks the follow-ups", () => {
  for (const v of [1, 2, 3, 4]) {
    const live = livePrompts({ "anyanal:t": v, "anyanal:b": v }, hetero);
    assert.ok(live.some((p) => p.key === "peg:b"), `value ${v}`);
  }
});

test("a solo follow-up under a two-sided screener needs a no on both sides", () => {
  const p247 = PROMPTS.find((p) => p.key === "247");
  assert.equal(isScreenedOut(p247, { "control:t": 0, "control:b": 4 }), false);
  assert.equal(isScreenedOut(p247, { "control:t": 0, "control:b": 0 }), true);
});

test("screened-out answers are sent as skip and score as conflicts against a yes", () => {
  const a = effectiveAnswers({ "anyanal:t": 0, "anyanal:b": 0 }, hetero);
  assert.equal(a["peg:b"], "skip");
  assert.equal(a["anyanal:b"], 0);
  const b = { "anyanal:t": 4, "anyanal:b": 0, "peg:t": 4 };
  const r = compare({ name: "A", answers: a }, { name: "B", answers: b });
  const pegB = r.units.find((u) => u.item.id === "peg" && u.dir === "ba");
  assert.equal(pegB.kind, "conflict");
});

test("follow-up count shown on a screener is exact", () => {
  const anyB = PROMPTS.find((p) => p.key === "anyanal:b");
  const expected = PROMPTS.filter((p) => p.item.gate === "anyanal" && p.side === "bottom" && hetero(p)).length;
  assert.equal(followUpsSkippedBy(anyB, {}, hetero), expected);
  const ctl = PROMPTS.find((p) => p.key === "control:t");
  // With the other side already a no, the solo follow-up is counted too.
  const tops = PROMPTS.filter((p) => p.item.gate === "control" && p.side === "top").length;
  assert.equal(followUpsSkippedBy(ctl, { "control:b": 0 }, hetero), tops + 1);
  assert.equal(followUpsSkippedBy(ctl, { "control:b": 3 }, hetero), tops);
});

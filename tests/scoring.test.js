import { test } from "node:test";
import assert from "node:assert/strict";
import { classify, compare } from "../js/scoring.js";
import { CATEGORIES, PROMPTS, promptApplies } from "../js/questions.js";

const person = (name, answers) => ({ name, answers });
const dom = (v) => ({ "dom:t": v[0], "dom:b": v[1] });

const domScore = (a, b) => {
  const r = compare(person("A", a), person("B", b));
  return r.categories.find((c) => c.cat.id === "power").score;
};

test("dominant + submissive is a perfect match", () => {
  assert.equal(domScore(dom([4, 0]), dom([0, 4])), 100);
});

test("two switches who love both sides are a perfect match", () => {
  assert.equal(domScore(dom([4, 4]), dom([4, 4])), 100);
});

test("two dominants are a mismatch", () => {
  assert.equal(domScore(dom([4, 0]), dom([4, 0])), 0);
});

test("two submissives are a mismatch", () => {
  assert.equal(domScore(dom([0, 4]), dom([0, 4])), 0);
});

test("dominant + switch: one direction works, the other is a conflict", () => {
  const r = compare(person("A", dom([4, 0])), person("B", dom([4, 4])));
  const kinds = r.units.filter((u) => u.item.id === "dom").map((u) => u.kind).sort();
  assert.deepEqual(kinds, ["conflict", "match"]);
});

test("unit classes", () => {
  assert.equal(classify(4, 3), "match");
  assert.equal(classify(4, 2), "open");
  assert.equal(classify(3, 1), "hesitant");
  assert.equal(classify(4, 0), "conflict");
  assert.equal(classify(0, 0), "limit");
  assert.equal(classify(2, 1), "neither");
  assert.equal(classify(4, "skip"), "conflict");
  assert.equal(classify("skip", 0), "limit");
  assert.equal(classify(4, undefined), null);
});

test("mutual no's don't inflate the score", () => {
  const a = { quickie: 4, morning: 0, missionary: 0 };
  const b = { quickie: 0, morning: 0, missionary: 0 };
  const r = compare(person("A", a), person("B", b));
  assert.equal(r.overall.score, 0);
  assert.equal(r.overall.counts.limit, 2);
});

test("nothing scored gives a null score, not 100", () => {
  const r = compare(person("A", { quickie: 0 }), person("B", { quickie: 1 }));
  assert.equal(r.overall.score, null);
});

test("solo items compare directly", () => {
  const r = compare(person("A", { quickie: 4 }), person("B", { quickie: 3 }));
  assert.equal(r.categories.find((c) => c.cat.id === "sex").score, 100);
});

test("question bank: unique ids, every category populated, pair texts present", () => {
  const ids = new Set();
  for (const c of CATEGORIES) {
    assert.ok(c.items.length > 0, c.id);
    for (const i of c.items) {
      assert.ok(!ids.has(i.id), `duplicate ${i.id}`);
      ids.add(i.id);
      if (i.kind === "pair") assert.ok(i.top && i.bottom && i.topRole && i.bottomRole, i.id);
      else assert.ok(i.text, i.id);
    }
  }
});

test("body filters: a hetero couple's views line up for every pair", () => {
  // A has a penis, B has a vulva. Whenever A sees a top prompt, B must see the bottom prompt.
  for (const item of CATEGORIES.flatMap((c) => c.items).filter((i) => i.kind === "pair")) {
    const t = PROMPTS.find((p) => p.key === `${item.id}:t`);
    const b = PROMPTS.find((p) => p.key === `${item.id}:b`);
    assert.equal(promptApplies(t, "p", "v"), promptApplies(b, "v", "p"), item.id);
    assert.equal(promptApplies(t, "v", "p"), promptApplies(b, "p", "v"), item.id);
  }
});

test("body filters hide what can't apply", () => {
  const key = (k) => PROMPTS.find((p) => p.key === k);
  assert.equal(promptApplies(key("prostate:b"), "v", "p"), false);
  assert.equal(promptApplies(key("prostate:t"), "v", "p"), true);
  assert.equal(promptApplies(key("scissor"), "v", "p"), false);
  assert.equal(promptApplies(key("scissor"), "v", "v"), true);
  assert.equal(promptApplies(key("period"), "p", "p"), false);
  assert.equal(promptApplies(key("period"), "p", "v"), true);
  assert.equal(promptApplies(key("prostate:b"), "a", "a"), true);
});

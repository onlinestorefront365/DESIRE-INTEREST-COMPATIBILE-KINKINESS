import { test } from "node:test";
import assert from "node:assert/strict";
import { encode, decode, CodeError } from "../js/codec.js";
import { PROMPTS, promptApplies } from "../js/questions.js";

function makePerson(name, self, partner) {
  const answers = {};
  PROMPTS.forEach((p, i) => {
    if (p.cat === "fluids") answers[p.key] = "skip";
    else if (i % 11 !== 0) answers[p.key] = i % 5;
  });
  return { name, self, partner, answers, applies: (p) => promptApplies(p, self, partner) };
}

test("round trip keeps name, bodies and every applicable answer", () => {
  const p = makePerson("Joé ❤", "p", "v");
  const code = encode(p);
  const back = decode(code);
  assert.equal(back.name, "Joé ❤");
  assert.equal(back.self, "p");
  assert.equal(back.partner, "v");
  for (const pr of PROMPTS) {
    const expected = p.applies(pr) ? p.answers[pr.key] : undefined;
    assert.equal(back.answers[pr.key], expected, pr.key);
  }
});

test("code is short enough to text", () => {
  const code = encode(makePerson("Alexandra", "a", "a"));
  assert.ok(code.length < 200, `length ${code.length}`);
  assert.match(code, /^SP1-[A-Za-z0-9_-]+$/);
});

test("whitespace and line breaks from messaging apps are ignored", () => {
  const code = encode(makePerson("Sam", "v", "v"));
  const mangled = ` ${code.slice(0, 30)}\n${code.slice(30)} `;
  assert.equal(decode(mangled).name, "Sam");
});

test("a changed or truncated code is rejected", () => {
  const code = encode(makePerson("Sam", "v", "p"));
  const flipped = code.slice(0, -3) + (code.at(-3) === "A" ? "B" : "A") + code.slice(-2);
  assert.throws(() => decode(flipped), CodeError);
  assert.throws(() => decode(code.slice(0, 40)), CodeError);
  assert.throws(() => decode("hello"), CodeError);
});

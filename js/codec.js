// Packs one person's answers into a short code they can text to their partner.
// No server: the code itself carries everything.
//
// Layout (bytes, then base64url):
//   [0] bank version
//   [1] bodies: self (bits 0-1), partner (bits 2-3)   0 = all, 1 = penis, 2 = vulva
//   [2] name length n (UTF-8 bytes, max 40)
//   [3..3+n) name
//   then 3 bits per prompt, in PROMPTS order:
//       0-4 answer, 5 not applicable, 6 section skipped, 7 unanswered
//   last byte: checksum (sum of all previous bytes, mod 256)

import { BANK_VERSION, PROMPTS } from "./questions.js";

const PREFIX = "SP1-";
const BODY_TO_BITS = { a: 0, p: 1, v: 2 };
const BITS_TO_BODY = ["a", "p", "v", "a"];
const NA = 5, SKIP = 6, UNANSWERED = 7;

function toBase64Url(bytes) {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(str) {
  const b64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64 + "===".slice((b64.length + 3) % 4));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

// person: { name, self, partner, answers: {key: 0..4 | "skip"}, applies: (prompt) => bool }
export function encode(person) {
  const nameBytes = new TextEncoder().encode((person.name || "").trim()).slice(0, 40);
  const head = [BANK_VERSION, BODY_TO_BITS[person.self] | (BODY_TO_BITS[person.partner] << 2), nameBytes.length, ...nameBytes];

  const bits = [];
  for (const p of PROMPTS) {
    let v;
    if (!person.applies(p)) v = NA;
    else {
      const a = person.answers[p.key];
      v = a === "skip" ? SKIP : Number.isInteger(a) && a >= 0 && a <= 4 ? a : UNANSWERED;
    }
    bits.push((v >> 2) & 1, (v >> 1) & 1, v & 1);
  }
  const packed = new Uint8Array(Math.ceil(bits.length / 8));
  bits.forEach((bit, i) => { if (bit) packed[i >> 3] |= 0x80 >> (i & 7); });

  const body = [...head, ...packed];
  const sum = body.reduce((s, b) => (s + b) & 0xff, 0);
  return PREFIX + toBase64Url(Uint8Array.from([...body, sum]));
}

export class CodeError extends Error {}

export function decode(raw) {
  const code = String(raw || "").trim().replace(/\s+/g, "");
  if (!code.startsWith(PREFIX)) throw new CodeError("That doesn't look like a SyncPulse code. Codes start with SP1-.");
  let bytes;
  try { bytes = fromBase64Url(code.slice(PREFIX.length)); }
  catch { throw new CodeError("The code has characters that don't belong in it. Copy it again in full."); }
  if (bytes.length < 4) throw new CodeError("The code is cut off. Copy it again in full.");

  const sum = bytes.slice(0, -1).reduce((s, b) => (s + b) & 0xff, 0);
  if (sum !== bytes[bytes.length - 1]) throw new CodeError("The code is incomplete or was changed. Copy it again in full.");
  if (bytes[0] !== BANK_VERSION) throw new CodeError("This code was made with a different version of the questions. Both of you need the latest version.");

  const self = BITS_TO_BODY[bytes[1] & 3];
  const partner = BITS_TO_BODY[(bytes[1] >> 2) & 3];
  const n = bytes[2];
  const name = new TextDecoder().decode(bytes.slice(3, 3 + n));
  const packed = bytes.slice(3 + n, -1);
  if (packed.length !== Math.ceil((PROMPTS.length * 3) / 8)) throw new CodeError("The code is the wrong length. Copy it again in full.");

  const answers = {};
  let unanswered = 0;
  PROMPTS.forEach((p, i) => {
    let v = 0;
    for (let k = 0; k < 3; k++) {
      const bit = i * 3 + k;
      v = (v << 1) | ((packed[bit >> 3] >> (7 - (bit & 7))) & 1);
    }
    if (v <= 4) answers[p.key] = v;
    else if (v === SKIP) answers[p.key] = "skip";
    else if (v === UNANSWERED) unanswered++;
  });
  return { name, self, partner, answers, unanswered };
}

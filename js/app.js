import { CATEGORIES, CATEGORY_BY_ID, PROMPTS, SCALE, LABELS, promptApplies } from "./questions.js";
import { compare, unitParties } from "./scoring.js";
import { encode, decode, CodeError } from "./codec.js";

const STORE_KEY = "syncpulse.v1";
const app = document.getElementById("app");

// ---------- state ----------

const blank = () => ({ name: "", self: null, partner: null, answers: {}, skipped: {}, at: null, partnerCode: "" });

function load() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return blank();
    return { ...blank(), ...JSON.parse(raw) };
  } catch {
    return blank();
  }
}

let state = load();
let memoryOnly = false;

function save() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch {
    memoryOnly = true;
  }
}

const isSetUp = () => state.self && state.partner;
const applies = (p) => promptApplies(p, state.self, state.partner);

function buildSteps() {
  const steps = [];
  const active = CATEGORIES.filter((c) => PROMPTS.some((p) => p.cat === c.id && applies(p)));
  active.forEach((cat, i) => {
    const qs = PROMPTS.filter((p) => p.cat === cat.id && applies(p));
    steps.push({ id: `gate:${cat.id}`, type: "gate", cat, count: qs.length, n: i + 1, of: active.length });
    if (!state.skipped[cat.id]) for (const p of qs) steps.push({ id: p.key, type: "q", prompt: p, cat });
  });
  return steps;
}

function effectiveAnswers() {
  const out = {};
  for (const p of PROMPTS) {
    if (!applies(p)) continue;
    if (state.skipped[p.cat]) out[p.key] = "skip";
    else if (state.answers[p.key] !== undefined) out[p.key] = state.answers[p.key];
  }
  return out;
}

function progress() {
  const live = PROMPTS.filter((p) => applies(p) && !state.skipped[p.cat]);
  const answered = live.filter((p) => state.answers[p.key] !== undefined).length;
  return { answered, total: live.length, open: live.length - answered };
}

const hasStarted = () => Object.keys(state.answers).length > 0 || Object.keys(state.skipped).length > 0;

function myCode() {
  return encode({ name: state.name, self: state.self, partner: state.partner, answers: effectiveAnswers(), applies });
}

// ---------- helpers ----------

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function go(hash) {
  if (location.hash === hash) render();
  else location.hash = hash;
}

let toastTimer;
function toast(msg) {
  document.querySelector(".toast")?.remove();
  const el = document.createElement("div");
  el.className = "toast";
  el.setAttribute("role", "status");
  el.textContent = msg;
  document.body.appendChild(el);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.remove(), 2200);
}

async function copyText(text, textarea) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    if (!textarea) return false;
    textarea.removeAttribute("readonly");
    textarea.select();
    const ok = document.execCommand && document.execCommand("copy");
    textarea.setAttribute("readonly", "");
    return !!ok;
  }
}

const markSvg = (cls = "mark") => `
  <svg class="${cls}" viewBox="0 0 112 72" aria-hidden="true">
    <circle cx="40" cy="36" r="32" fill="var(--a)" opacity=".9"/>
    <circle cx="72" cy="36" r="32" fill="var(--b)" opacity=".9"/>
  </svg>`;

const BODY_OPTIONS = [
  ["p", "Penis"],
  ["v", "Vulva"],
  ["a", "Show everything"],
];

// ---------- screens ----------

function viewHome() {
  const prog = progress();
  const started = isSetUp() && hasStarted();
  const done = started && prog.open === 0;
  let actions;
  if (!isSetUp()) {
    actions = `<a class="btn btn-primary" href="#setup">Start</a>`;
  } else if (!done) {
    actions = `
      <a class="btn btn-primary" href="#quiz">${started ? `Continue (${prog.answered} of ${prog.total})` : "Start the questions"}</a>
      <a class="btn btn-quiet" href="#setup">Edit name and settings</a>`;
  } else {
    actions = `
      ${state.partnerCode ? `<a class="btn btn-primary" href="#results">See results</a>` : ""}
      <a class="btn ${state.partnerCode ? "btn-quiet" : "btn-primary"}" href="#done">Swap codes</a>
      <button class="btn btn-quiet" data-action="review">Change my answers</button>`;
  }
  return `
    ${markSvg()}
    <div class="home-title stack">
      <h1>SyncPulse</h1>
      <p class="lede">Answer privately on your own phone, swap codes, and see where your desires line up.</p>
    </div>
    <p class="notice mt-28"><strong>Your partner sees every answer.</strong> Results show both of your answers side by side.</p>
    <p class="small mt-14">Nothing leaves this phone except the code you choose to send. Sections you're not into can be skipped in one tap.</p>
    <div class="spacer"></div>
    <div class="btn-row mt-32">${actions}</div>
    ${isSetUp() ? `<div class="foot">
      ${started && !done ? `<button class="btn btn-text" data-action="restart">Start over</button>` : ""}
      <button class="btn btn-text btn-danger" data-action="wipe">Delete everything on this phone</button>
    </div>` : ""}
    ${memoryOnly ? `<p class="small mt-12">This browser isn't letting SyncPulse save. Your answers will be lost if you close the page.</p>` : ""}`;
}

function segmented(name, value) {
  return `<div class="segmented" role="group" aria-label="${name}">
    ${BODY_OPTIONS.map(([v, label]) => `<button type="button" data-action="body" data-field="${name}" data-v="${v}" aria-pressed="${value === v}">${label}</button>`).join("")}
  </div>`;
}

function viewSetup() {
  const ready = state.self && state.partner;
  return `
    <div class="quiz-top"><a class="btn btn-text" href="#">Back</a></div>
    <div class="stack-lg mt-16">
      <h2>Before you start</h2>
      <label class="field">
        <span class="field-label">Your name or nickname</span>
        <input type="text" id="name" maxlength="24" autocomplete="off" autocapitalize="words" value="${esc(state.name)}" placeholder="Shown to your partner in the results">
      </label>
      <div>
        <span class="field-label">Your body</span>
        ${segmented("self", state.self)}
      </div>
      <div>
        <span class="field-label">Your partner's body</span>
        ${segmented("partner", state.partner)}
      </div>
      <p class="small">Only used to hide questions that can't apply to the two of you, like prostate play when neither of you has a prostate. Pick "Show everything" to see all of them.</p>
    </div>
    <div class="spacer"></div>
    <div class="btn-row mt-32">
      <button class="btn btn-primary" data-action="setup-save" ${ready ? "" : "disabled aria-disabled=\"true\""}>${hasStarted() ? "Save" : "Start the questions"}</button>
    </div>`;
}

const SIDE_ICON = `<svg viewBox="0 0 18 18" aria-hidden="true"><circle cx="6.5" cy="9" r="5" fill="var(--a)" opacity=".9"/><circle cx="11.5" cy="9" r="5" fill="var(--b)" opacity=".9"/></svg>`;

function viewQuiz() {
  const steps = buildSteps();
  if (!steps.length) return viewHome();
  let i = steps.findIndex((s) => s.id === state.at);
  if (i < 0) i = 0;
  const step = steps[i];
  state.at = step.id;

  const prog = progress();
  const qIndex = steps.slice(0, i).filter((s) => s.type === "q").length;
  const fraction = prog.total ? Math.min(1, qIndex / prog.total) : 0;
  const top = `
    <div class="quiz-top">
      <button class="btn btn-text" data-action="back">Back</button>
      <span class="count">${step.type === "q" ? `${qIndex + 1} of ${prog.total}` : `Section ${step.n} of ${step.of}`}</span>
    </div>
    <div class="progress" aria-hidden="true"><svg viewBox="0 0 100 3" preserveAspectRatio="none"><rect x="0" y="0" height="3" width="${(fraction * 100).toFixed(2)}"/></svg></div>`;

  if (step.type === "gate") {
    const skipped = !!state.skipped[step.cat.id];
    return `${top}
      <section class="gate">
        <p class="section-name">Section ${step.n} of ${step.of}</p>
        <h2>${esc(step.cat.name)}</h2>
        <p class="lede">${esc(step.cat.blurb)}</p>
        <p class="small mt-12">${step.count} questions${skipped ? ". You skipped this section." : ""}</p>
      </section>
      <div class="btn-row">
        <button class="btn btn-primary" data-action="gate-open">${skipped ? "Answer these after all" : "Show me these"}</button>
        <button class="btn btn-quiet" data-action="gate-skip">${skipped ? "Keep it skipped" : "Skip this section"}</button>
      </div>
      <p class="small mt-12">Skipping counts every question here as a hard no.</p>`;
  }

  const p = step.prompt;
  const current = state.answers[p.key];
  const sideText = p.side === "solo" ? "Together" : p.side === "top" ? "Two-sided: this role first" : "Two-sided: now the other role";
  return `${top}
    <section class="prompt-area">
      <p class="section-name">${esc(step.cat.name)}</p>
      <span class="side">${SIDE_ICON}${sideText}</span>
      <p class="prompt" id="prompt">${esc(p.text)}</p>
      ${p.item.hint ? `<p class="prompt-hint">${esc(p.item.hint)}</p>` : ""}
    </section>
    <div class="answers" role="group" aria-labelledby="prompt">
      ${SCALE.map((s) => `
        <button class="answer" data-action="answer" data-v="${s.value}" aria-pressed="${current === s.value}">
          <span class="a-label">${s.label}</span><span class="a-hint">${s.hint}</span>
        </button>`).join("")}
    </div>`;
}

function viewDone() {
  const prog = progress();
  let code = "";
  try { code = myCode(); } catch { code = ""; }
  const canShare = typeof navigator.share === "function";
  return `
    <div class="quiz-top"><a class="btn btn-text" href="#">Home</a></div>
    <div class="stack-lg mt-16">
      <div class="stack">
        <h2>${prog.open ? `${prog.open} questions still open` : "You're done"}</h2>
        <p class="lede">${prog.open ? "Your code works now, but open questions show up as unanswered for your partner." : "Send your code to your partner, then paste theirs below."}</p>
        ${prog.open ? `<button class="btn btn-quiet" data-action="first-open">Answer the open questions</button>` : ""}
      </div>
      <div class="stack">
        <label class="field">
          <span class="field-label">Your code</span>
          <textarea id="mycode" readonly rows="4">${esc(code)}</textarea>
        </label>
        <div class="btn-row">
          <button class="btn btn-primary" data-action="copy-code">Copy my code</button>
          ${canShare ? `<button class="btn btn-quiet" data-action="share-code">Send with another app</button>` : ""}
        </div>
        <p class="small">If you change any answers later, send your new code.</p>
      </div>
      <div class="stack">
        <label class="field">
          <span class="field-label">Your partner's code</span>
          <textarea id="partnercode" rows="4" placeholder="Paste the code that starts with SP1-" autocomplete="off" autocapitalize="off" spellcheck="false">${esc(state.partnerCode)}</textarea>
        </label>
        <p class="small" id="code-error" role="alert"></p>
        <button class="btn btn-primary" data-action="compare">Compare answers</button>
      </div>
    </div>`;
}

// ---------- results ----------

const expanded = new Set();

function lvChip(v) {
  if (v === "skip") return `<span class="lv lv-skip">Skipped</span>`;
  if (v === undefined || v === null) return `<span class="lv lv-na">No answer</span>`;
  return `<span class="lv lv-${v}">${LABELS[v]}</span>`;
}

function unitRow(u, names, showCat) {
  const who = unitParties(u, names.a, names.b);
  const dotFirst = who.first === names.a ? "dot-a" : "dot-b";
  const dotSecond = who.second === names.a ? "dot-a" : "dot-b";
  return `<li class="row">
    <div class="row-name">${esc(u.item.name)}</div>
    ${showCat ? `<div class="row-cat">${esc(CATEGORY_BY_ID[u.cat].name)}</div>` : ""}
    <div class="pp">
      <div class="who-line"><span class="dot ${dotFirst}"></span><span class="nm">${esc(who.first)}</span>${who.firstRole ? `<span class="rl">${esc(who.firstRole)}</span>` : ""}</div>
      ${lvChip(u.first)}
      <div class="who-line"><span class="dot ${dotSecond}"></span><span class="nm">${esc(who.second)}</span>${who.secondRole ? `<span class="rl">${esc(who.secondRole)}</span>` : ""}</div>
      ${lvChip(u.second)}
    </div>
  </li>`;
}

function listBlock(id, title, sub, units, names) {
  if (!units.length) return "";
  const limit = 8;
  const all = expanded.has(id);
  const shown = all ? units : units.slice(0, limit);
  return `<section class="stack" id="${id}">
    <div class="block-title"><h3>${title}</h3><span class="small">${units.length}</span></div>
    <p class="small">${sub}</p>
    <ul class="rows">${shown.map((u) => unitRow(u, names, true)).join("")}</ul>
    ${units.length > limit ? `<button class="btn btn-quiet more" data-action="expand" data-id="${id}">${all ? "Show fewer" : `Show all ${units.length}`}</button>` : ""}
  </section>`;
}

function catSub(c) {
  if (c.score === null) return "Nothing either of you is into here";
  const parts = [];
  if (c.counts.match) parts.push(`${c.counts.match} mutual ${c.counts.match === 1 ? "yes" : "yeses"}`);
  const talk = c.counts.open + c.counts.hesitant;
  if (talk) parts.push(`${talk} to talk about`);
  if (c.counts.conflict) parts.push(`${c.counts.conflict} ${c.counts.conflict === 1 ? "conflict" : "conflicts"}`);
  return parts.join(", ");
}

function viewResults() {
  let them;
  try {
    them = decode(state.partnerCode);
  } catch (e) {
    return viewDone();
  }
  const nameA = state.name.trim() || "You";
  let nameB = them.name.trim() || "Partner";
  if (nameB === nameA) nameB = `${nameB} (2)`;
  const names = { a: nameA, b: nameB };

  const r = compare({ name: nameA, answers: effectiveAnswers() }, { name: nameB, answers: them.answers });
  const s = r.overall.score;

  // Two circles; the closer they sit, the higher the score.
  const R = 62, cy = 74, mid = 160;
  const d = 2 * R - ((s ?? 0) / 100) * 1.5 * R;
  const cxA = mid - d / 2, cxB = mid + d / 2;
  const short = (n) => (n.length > 14 ? `${n.slice(0, 13)}…` : n);
  const venn = `
    <svg class="venn" viewBox="0 0 320 172" role="img" aria-label="${esc(nameA)} and ${esc(nameB)}: ${s === null ? "no score yet" : `${s} percent compatible`}">
      <g class="move-a"><circle class="ca" cx="${cxA.toFixed(1)}" cy="${cy}" r="${R}" opacity=".9"/></g>
      <g class="move-b"><circle class="cb" cx="${cxB.toFixed(1)}" cy="${cy}" r="${R}" opacity=".9"/></g>
      <text class="who" x="${(cxA - R).toFixed(1)}" y="${cy + R + 26}" text-anchor="start">${esc(short(nameA))}</text>
      <text class="who" x="${(cxB + R).toFixed(1)}" y="${cy + R + 26}" text-anchor="end">${esc(short(nameB))}</text>
    </svg>`;

  const warnings = [];
  if (them.unanswered) warnings.push(`${esc(nameB)} left ${them.unanswered} questions unanswered. Those are left out until they send a new code.`);
  const prog = progress();
  if (prog.open) warnings.push(`You have ${prog.open} questions still open. Those are left out until you answer them.`);
  const clash = (x, y) => x !== "a" && y !== "a" && x !== y;
  if (clash(state.self, them.partner) || clash(state.partner, them.self))
    warnings.push("Your body settings don't match each other's, so some two-sided questions couldn't be compared. Check them in Edit name and settings.");

  const cats = [...r.categories].sort((x, y) => (y.score ?? -1) - (x.score ?? -1));
  const catList = cats.map((c) => `
    <li class="cat-row">
      <div class="cat-line"><span class="cat-name">${esc(c.cat.name)}</span><span class="cat-pct">${c.score === null ? "–" : `${c.score}%`}</span></div>
      ${c.score === null ? "" : `<svg viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true"><rect class="track" x="0" y="0" width="100" height="10" rx="2"/>${c.score > 0 ? `<rect class="fill" x="0" y="0" width="${c.score}" height="10" rx="2"/>` : ""}</svg>`}
      <div class="cat-sub">${catSub(c)}</div>
    </li>`).join("");

  const sideBySide = r.categories.map((c) => {
    const rows = c.units.filter((u) => !(u.first === undefined && u.second === undefined));
    if (!rows.length) return "";
    return `<details>
      <summary>${esc(c.cat.name)}<span class="small">${c.score === null ? "–" : `${c.score}%`}</span></summary>
      <ul class="rows">${rows.map((u) => unitRow(u, names, false)).join("")}</ul>
    </details>`;
  }).join("");

  const c = r.overall.counts;
  return `
    <div class="quiz-top"><a class="btn btn-text" href="#">Home</a></div>
    <section class="result-head">
      ${venn}
      <h1>${s === null ? "–" : `${s}%`}</h1>
      <p class="small">${s === null ? "Neither of you said yes to anything yet." : `compatible across ${r.overall.scored} things at least one of you is into`}</p>
    </section>
    <div class="tally">
      <button data-action="jump" data-id="matches"><span class="n">${c.match}</span><span class="t">You both want</span></button>
      <button data-action="jump" data-id="talk"><span class="n">${c.open + c.hesitant}</span><span class="t">Worth talking about</span></button>
      <button data-action="jump" data-id="conflicts"><span class="n">${c.conflict}</span><span class="t">Conflicts</span></button>
    </div>
    ${warnings.length ? `<div class="stack mt-18">${warnings.map((w) => `<p class="warn">${w}</p>`).join("")}</div>` : ""}

    <div class="stack-lg mt-36">
      <section class="stack">
        <h3>By section</h3>
        <ul class="cats">${catList}</ul>
      </section>
      ${listBlock("matches", "You both want", "Both of you said Into it or Love it.", r.matches, names)}
      ${listBlock("talk", "Worth talking about", "One of you is into it, the other is neutral or hesitant.", r.talk, names)}
      ${listBlock("conflicts", "Conflicts", "One of you is into it, the other said hard no or skipped the section.", r.conflicts, names)}
      ${r.limits.length ? `<section class="stack"><div class="block-title"><h3>Shared limits</h3><span class="small">${r.limits.length}</span></div>
        <p class="small">Both of you said hard no. These don't count toward the score.</p>
        <details><summary>Show shared limits</summary><ul class="rows">${r.limits.map((u) => unitRow(u, names, true)).join("")}</ul></details></section>` : ""}
      <section class="stack" id="all">
        <h3>Every answer, side by side</h3>
        <p class="small">For two-sided questions, each row shows one direction: who would do it and who would receive it.</p>
        <div>${sideBySide}</div>
      </section>
    </div>
    <div class="foot">
      <a class="btn btn-text" href="#done">Swap codes</a>
      <button class="btn btn-text" data-action="review">Change my answers</button>
    </div>`;
}

// ---------- render + routing ----------

let lastScreen = null;

function render() {
  const route = location.hash.replace(/^#/, "") || "home";
  let html;
  let screen = route;
  if (route === "setup") html = viewSetup();
  else if (!isSetUp()) { screen = "home"; html = viewHome(); }
  else if (route === "quiz") html = viewQuiz();
  else if (route === "done") html = viewDone();
  else if (route === "results") { html = state.partnerCode ? viewResults() : viewDone(); }
  else { screen = "home"; html = viewHome(); }
  app.innerHTML = html;
  app.dataset.screen = screen;
  if (screen !== lastScreen) window.scrollTo(0, 0);
  lastScreen = screen;
}

function moveTo(stepId) {
  state.at = stepId;
  save();
  window.scrollTo(0, 0);
  render();
}

function advanceFrom(index) {
  const steps = buildSteps();
  const next = steps[index + 1];
  if (next) moveTo(next.id);
  else { save(); go("#done"); }
}

function currentIndex(steps) {
  const i = steps.findIndex((s) => s.id === state.at);
  return i < 0 ? 0 : i;
}

function answer(v) {
  const steps = buildSteps();
  const i = currentIndex(steps);
  const step = steps[i];
  if (!step || step.type !== "q") return;
  state.answers[step.prompt.key] = v;
  advanceFrom(i);
}

function back() {
  const steps = buildSteps();
  const i = currentIndex(steps);
  if (i === 0) go("#");
  else moveTo(steps[i - 1].id);
}

app.addEventListener("click", async (e) => {
  const el = e.target.closest("[data-action]");
  if (!el) return;
  const action = el.dataset.action;

  if (action === "answer") return answer(Number(el.dataset.v));
  if (action === "back") return back();

  if (action === "gate-open" || action === "gate-skip") {
    const steps = buildSteps();
    const step = steps[currentIndex(steps)];
    if (!step || step.type !== "gate") return;
    const catId = step.cat.id;
    if (action === "gate-skip") state.skipped[catId] = true;
    else delete state.skipped[catId];
    const fresh = buildSteps();
    return advanceFrom(fresh.findIndex((s) => s.id === step.id));
  }

  if (action === "body") {
    state[el.dataset.field] = el.dataset.v;
    state.name = document.getElementById("name")?.value.slice(0, 24) ?? state.name;
    save();
    return render();
  }

  if (action === "setup-save") {
    state.name = document.getElementById("name").value.trim().slice(0, 24);
    if (!state.self || !state.partner) return;
    save();
    return go(hasStarted() ? "#" : "#quiz");
  }

  if (action === "review") {
    state.at = null;
    save();
    return go("#quiz");
  }

  if (action === "first-open") {
    const first = buildSteps().find((s) => s.type === "q" && state.answers[s.prompt.key] === undefined);
    if (first) { state.at = first.id; save(); }
    return go("#quiz");
  }

  if (action === "copy-code") {
    const ok = await copyText(myCode(), document.getElementById("mycode"));
    return toast(ok ? "Code copied" : "Couldn't copy. Press and hold the code to copy it.");
  }

  if (action === "share-code") {
    try { await navigator.share({ text: myCode() }); } catch { /* cancelled */ }
    return;
  }

  if (action === "compare") {
    const raw = document.getElementById("partnercode").value;
    const err = document.getElementById("code-error");
    try {
      const them = decode(raw);
      if (raw.trim().replace(/\s+/g, "") === myCode()) {
        err.textContent = "That's your own code. Paste the one your partner sent you.";
        return;
      }
      state.partnerCode = raw.trim().replace(/\s+/g, "");
      save();
      void them;
      return go("#results");
    } catch (ex) {
      err.textContent = ex instanceof CodeError ? ex.message : "That code couldn't be read. Copy it again in full.";
      return;
    }
  }

  if (action === "expand") {
    const id = el.dataset.id;
    if (expanded.has(id)) expanded.delete(id); else expanded.add(id);
    render();
    document.getElementById(id)?.scrollIntoView({ block: "start" });
    return;
  }

  if (action === "jump") {
    document.getElementById(el.dataset.id)?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    return;
  }

  if (action === "restart") {
    if (!confirm("Clear all your answers and start again? Your name and settings stay.")) return;
    state = { ...blank(), name: state.name, self: state.self, partner: state.partner, partnerCode: state.partnerCode };
    save();
    return go("#quiz");
  }

  if (action === "wipe") {
    if (!confirm("Delete your answers, settings and your partner's code from this phone? This can't be undone.")) return;
    try { localStorage.removeItem(STORE_KEY); } catch { /* nothing stored */ }
    state = blank();
    return go("#");
  }
});

document.addEventListener("keydown", (e) => {
  if (app.dataset.screen !== "quiz" || e.metaKey || e.ctrlKey || e.altKey) return;
  if (["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) return;
  if (/^[1-5]$/.test(e.key)) {
    const steps = buildSteps();
    const step = steps[currentIndex(steps)];
    if (step?.type === "q") { e.preventDefault(); answer(Number(e.key) - 1); }
  } else if (e.key === "Backspace" || e.key === "ArrowLeft") {
    e.preventDefault();
    back();
  }
});

window.addEventListener("hashchange", render);
render();

if ("serviceWorker" in navigator && location.protocol === "https:") {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}

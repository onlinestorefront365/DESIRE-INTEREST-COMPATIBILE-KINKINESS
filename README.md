# Take the Dick!

A private couples quiz about sexual desires and kinks. Each partner answers on their own phone, then you swap a short code and see where you line up.

There is no server and no account. Answers are saved only in the browser on each phone. The only thing that leaves a phone is the code you choose to send.

## Using it

1. Open the site on your phone and add it to your home screen:
   - iPhone, in Safari: Share, then **Add to Home Screen**.
   - Android, in Chrome: menu, then **Add to Home screen** or **Install app**.

   After the first visit it works offline.
2. Enter a name, your body and your partner's body. These settings only hide questions that can't apply to the two of you.
3. Answer each question with one tap. **Back** goes to the previous question. Progress saves as you go, so you can stop and come back.
4. Broad questions come first. A Hard no on one skips the narrower questions under it, so if you say Hard no to "Having anything anal done to you," you're never asked about being pegged. The giving side is still asked unless you rule that out too. Hesitant or higher asks the narrower questions.
5. When you're done, copy your code and text it to your partner. Paste their code and tap **Compare answers**.

If either of you changes an answer, send a new code.

## How scoring works

- **Answer scale:** Hard no, Hesitant, Neutral, Into it, Love it.
- **Two-sided questions** come in pairs, such as "Spanking your partner" and "Being spanked."
  - Your doing side is compared with your partner's receiving side, and the reverse.
  - A dominant paired with a submissive scores 100%, and so do two switches.
  - Two dominants score 0%.
- **Scoring each comparison:**

  | Answers | Counts as |
  |---|---|
  | Both Into it or Love it | Match (100%) |
  | One into it, the other Neutral | 50% |
  | One into it, the other Hesitant | 25% |
  | One into it, the other Hard no | Conflict (0%) |

- **Screened-out questions** (skipped because of a Hard no on the broad question above them) are sent to your partner as "Screened out" and scored as Hard no.
- **Mutual no's don't count.** If neither of you is above Neutral, that comparison is left out of the score. Mutual hard no's are listed as shared limits.
- **Results show:**
  - the overall score and a score for each section
  - what you both want, what's worth talking about, and conflicts
  - every answer from both of you, side by side

## Content scope

Consensual non-consent appears only as a scene you plan together in advance. The quiz leaves out:

- age play
- animals
- anything framed as real non-consent

## Files

| Path | What it is |
|---|---|
| `index.html`, `css/`, `js/app.js` | The app |
| `js/questions.js` | The question bank, including which broad questions screen out which follow-ups (see the note at the top before editing) |
| `js/scoring.js` | Compatibility scoring |
| `js/codec.js` | Packs answers into the swap code |
| `sw.js`, `manifest.webmanifest`, `icons/` | Offline support and home-screen install |
| `tests/` | Run with `npm test` (Node 20 or newer, no dependencies) |

The site is plain HTML, CSS and JavaScript with no build step and no outside libraries. GitHub Pages serves it straight from the `main` branch. The page's security policy blocks it from making any network requests, and search engines are asked not to index it.

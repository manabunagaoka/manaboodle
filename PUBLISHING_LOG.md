# Publishing Log

A running record of what gets written, posted or changed on manaboodle.com.
Newest entry first. Add an entry whenever a post goes live or a section changes.

Format for each entry: date, what happened, where it lives, and the commit.
Engineering debugging notes stay in the `SESSION_NOTES_*.md` files instead.

---

## October 24, 2026 — "Slurping Manaboodle" published

- **Section:** Random. Live at `/random/slurping-manaboodle`.
- **What it is:** Origin story for the name Manaboodle and for Mana, the new
  mascot. Late nights in Owada Yokocho, Tokyo, designing an adaptive learning
  model in Moodle before the AI era. Moodle, noodles and doodling become the
  name, and Mana becomes its face.
- **Framing decisions:** No mention of Sesame or of the platform the Moodle
  work fed into. Mana is a mascot for doodling and exploring, with no gender
  and no tutor or agent role. The last line, "Come back to see how Mana grows
  while learning adaptive learning," is a deliberate nod to Mitch Resnick's
  MIT course Learning Creative Learning and is left unexplained.
- **Site changes:** Set as homepage featured post, demoting "My First English
  Word". Hero and thumbnail image `public/images/slurping-manaboodle.jpg`.
- **Still open:** Spelling of "Owada Yokocho" not yet confirmed. More photos
  and videos may be added later.
- **Commit:** the commit that adds this entry.

## October 24, 2026 — Site-wide name and Sesame cleanup

- **Why:** The line between work at Sesame Workshop and personal projects was
  getting blurry. The site should read as Manaboodle, a personal project, with
  no suggestion that Sesame is behind it.
- **Header:** Dotted logo symbol and "by Manabu Nagaoka" byline removed. The
  header now shows only "Manaboodle".
- **Footer:** "by Manabu Nagaoka" removed under the logo. Copyright reads
  "© Manaboodle. All rights reserved."
- **About page:** Photo with Grover replaced by a photo with Mana, the new
  Manaboodle mascot (`public/images/manabu-mana.jpg`). Old Grover file deleted.
- **Sign-up:** @sesame.org addresses are no longer approved without a guest
  pass. Approved domains now live in one list, `src/lib/approved-domains.ts`
  (harvard.edu and manaboodle.com).
- **Kept on purpose:** Name in the Terms ownership clause, the signatures on
  the contact and welcome emails, and author fields in the search data.
- **Still open:** Article-by-article review of Sesame mentions. Existing
  database rows with access type "sesame" are unchanged.
- **Favicon:** Mana's face is the site favicon (`src/app/icon.png`) and
  home-screen icon (`src/app/apple-icon.png`). The site had none before.
- **Commits:** 81fdbd9, plus the favicon commit that follows it.

## September 19, 2026 — "My First English Word" published

- **Section:** Case Studies. Live at `/casestudies/my-first-english-word`.
- **What it is:** Personal case study. Learning English from a drawing of the
  word "This", working on Sesame Street English, and returning to HGSE for a
  session in Professor Amin Marei's course Learning Design for All. Ends with
  three questions about who learning technology reaches.
- **Framing decision:** The underlying teaching case is not published, because
  it covers the business of a current employer. The article keeps the personal
  story and the general funding tension, names no business results, and closes
  with "The views in this article are my own and do not represent Sesame
  Workshop."
- **Site changes:** Set as homepage featured post, demoting "The Stories We
  Produce Are Becoming Training Grounds for AI". Hero image `public/images/this.jpg`.
- **Commits:** 6665692, ae9c998 (hero image).

## September 19, 2026 — Tools section and Academic Portal hidden

- **Why:** Hosting tools inside Manaboodle added complexity, and the Academic
  Portal experiment drew no users. Tools comes back only when it can feature
  live tools, linked out to where they actually run, with room for a store or
  subscription layer later.
- **What changed:** `/tools/*` and the browsable Academic Portal pages redirect
  home via `next.config.js`. Tools links removed from header and footer.
  `/api/runway/chat` returns 410 instead of calling OpenAI. Portal login,
  signup, password reset and admin stay up, because SSO for external apps and
  the account emails use them.
- **Article edit:** "Building Tools That Actually Matter" lost its links to the
  hidden tools and gained a closing note pointing readers to `/contact`.
- **Still open:** Whether any external app still needs Manaboodle login. If
  not, portal signup can be closed too. The subscribe form remains disabled
  because of spam; rebuilding it needs Cloudflare Turnstile plus a confirmation
  email before the closing note can offer signup.
- **Commits:** 685bdd9, 35e330e.

## July 5, 2026 — "The Stories We Produce Are Becoming Training Grounds for AI"

- **Section:** Random. Live at `/random/stories-training-grounds-ai`.
- Storytelling as reinforcement-learning environments for AI. Hero image
  `agent_chiks.png`. Set as featured post, demoting "From South Africa to New York".
- Same day: footer copyright year made dynamic.
- **Commits:** 850727a, 48c24ee.

## June 21, 2026 — "From South Africa to New York"

- **Section:** Random. Live at `/random/south-africa-to-new-york`.
- One-year reflection on starting Manaboodle. Set as featured post at the time.
- **Commit:** 2a86d39.

---

Earlier posts predate this log. Their history is in git:
`git log --oneline -- src/lib/content.ts`.

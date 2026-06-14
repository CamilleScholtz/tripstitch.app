---
name: article-writing
description: House writing rules for Tripstitch blog articles (itinerary city guides, how-to/comparison guides, and dev posts). Enforces the voice, bans em dashes and AI/marketing tells, and lists what every post must contain. Use whenever drafting, rewriting, or reviewing any long-form prose under content/blog (or other site copy). Run scripts/check.sh on the file before finishing.
---

# Article Writing

The rules for every article on tripstitch.app. The goal is prose that reads like a person who actually went there or actually built the thing wrote it, and that ranks in search and gets cited by AI models because it is specific and honest. The fastest way to fail both goals is to sound like AI generated it.

Before writing anything new, read two or three existing posts for tone. `content/blog/building-ai-travel-app-that-doesnt-hallucinate.md` is the canonical reference for the dev voice; the `3-days-in-*` posts for itinerary voice. Match what is already there.

When you finish a draft or an edit, run `scripts/check.sh <file>` and clear every hard failure before you call it done.

## Voice

- **Specific and opinionated.** State preferences, give real recommendations, include actual prices and times. "Get the 9 AM slot, the queue triples by 11" beats "visit early to avoid crowds."
- **Conversational but not chatty.** Write like you are telling a friend who asked, not like marketing copy.
- **Honest.** Name downsides, caveats, and tradeoffs. "It's touristy, but the view is worth it" beats pretending everything is perfect. For dev posts, admit the wrong turns and the things that broke.
- **Grounded in experience.** Write as someone who was there or built it. Never sound like you are summarizing someone else's blog.
- **Just start.** No throat-clearing intro about the topic's importance. First sentence does work.

## The em dash rule

**Never use an em dash (—) in article prose.** Not for asides, not for emphasis, not for ranges, not anywhere. It is the single most reliable tell of AI writing and it is banned outright.

- Replace it with a comma, a period, a colon, or parentheses. Rewrite the sentence if none of those fit.
- Do **not** substitute a spaced hyphen ( - ) or a spaced en dash ( – ) as a stand-in. That is the same move wearing a disguise.
- **En dashes (–) are allowed only for numeric ranges:** `€10–18`, `9–10 PM`, `2014–2019`. Never as sentence punctuation.
- Hyphens (-) for compound words are normal and fine.

This is non-negotiable. `scripts/check.sh` fails on any em dash.

## Banned marketing words and phrases

Hard bans. These read as advertisement copy or as AI puffery. Never use them (the travel cliches are allowed only with obvious irony):

- **Marketing verbs:** discover, unlock, elevate, revolutionize, supercharge, leverage (as a verb).
- **Hype adjectives:** seamless, cutting-edge, game-changing, groundbreaking, world-class, next-level, must-see, breathtaking.
- **AI filler vocabulary:** delve, tapestry, testament (as in "a testament to"), boasts, vibrant (of a place/scene), bustling, nestled, "in the heart of", treasure trove, realm, landscape (figurative), meticulous, intricate.
- **Travel cliches:** "hidden gem", "off the beaten path", "Instagram-worthy", "bucket list".
- **Dead openers:** "Let's dive in", "without further ado", "in this article we'll explore", "In today's [world/landscape/era]".
- **False-inclusive opener:** "Whether you're a [X] or a [Y]".
- **Stacked superlatives:** "an absolutely incredible, truly stunning experience."
- **Vague filler:** "experience the magic of", "immerse yourself in the vibrant culture of."

When you catch yourself reaching for one, the fix is almost always a concrete fact. Replace "discover the vibrant food scene" with "the food is mostly Cantonese, and the good places are off the main square."

## AI-writing tells to avoid

These are structural and rhetorical patterns, not single words, drawn from [Wikipedia: Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing). They are what makes text feel machine-made even when no banned word appears.

- **Significance inflation.** "Stands as a testament to", "plays a vital/crucial/pivotal role", "leaves an indelible mark", "marks a turning point", "underscores the importance of", "reflects a broader shift". Cut them. State what the thing is and what it does.
- **Negative parallelism.** "Not only X, but also Y", "It's not just a museum, it's an experience", "Not X, but Y". Almost always padding. Say the thing directly.
- **Rule of three.** Reflexive triads: "fast, reliable, and affordable", "the sights, the sounds, the smells." One or two real specifics beat three vague ones. Vary your sentence rhythm so triads are not the default.
- **Present-participle summary tails.** Sentences ending in "..., highlighting the importance of...", "..., showcasing its rich history", "..., reflecting the broader trend." These are editorializing filler the model bolts on. Delete the clause.
- **Copula avoidance.** Swapping plain "is/are" for "serves as", "stands as", "boasts", "features", "offers", "represents". Just use "is".
- **Editorializing connectors.** "Moreover", "Furthermore", "Additionally", "It's important to note that", "It's worth noting that". Start the sentence with the fact instead.
- **Section summaries and conclusions.** No "In conclusion", "In summary", "Overall", or a closing paragraph that restates the post. End on a real last point. (A genuine "What I learned" section in a dev post is fine; a hollow recap is not.)
- **The "challenges and future prospects" formula.** "Despite its strengths, [X] faces challenges... but the future looks bright." Speculative filler. If you do not have a concrete take on what is next, do not write a paragraph pretending you do.
- **Vague attribution / weasel words.** "Experts say", "industry reports suggest", "many travelers find", "it is widely considered". Either cite a real source with a year, or write it as your own opinion, or cut it.
- **Elegant variation.** Inventing a new synonym every time you refer to the same thing ("the app", "the platform", "the solution", "the tool") to avoid repetition. Repeat the plain word. It reads as natural; the thesaurus parade reads as AI.

## Formatting tells to avoid

- **Headings in sentence case, not Title Case.** "Why I left Apple Maps", not "Why I Left Apple Maps". (Front-matter `title` follows the existing posts.)
- **No bold for emphasis in body prose.** Bold lead-ins on list items are fine when a post genuinely needs a list (see the dev posts). Do not bold random phrases mid-paragraph, and do not bold the same word every time it appears.
- **Prefer prose over bullet lists.** Reach for a list only when the content is genuinely a list (steps, options, a comparison). A wall of bullets where paragraphs belong is an AI tell. Itinerary practical-info blocks are the sanctioned exception.
- **No emoji** as decoration or section markers.
- **Straight quotes and apostrophes** in the markdown source (`'` and `"`), not curly/smart ones. Let Hugo handle typography.

## What good posts include

- **Real numbers.** Prices (`€10–18`), distances ("15 minutes from the old city"), durations, visitor counts, historical dates. These are what AI models extract and cite.
- **Practical warnings.** "Pickpockets are a real issue on Las Ramblas", "Bali belly is real", "the official Swift wrapper does not build against the v11 SDK".
- **Local context.** "Spaniards eat late, restaurants fill up at 9–10 PM."
- **Pro tips** scattered naturally, not collected into a "TOP 10 TIPS" list.
- **Sources and citations** where relevant: studies, surveys, official statistics, with the year.

## Front matter

Front matter drives how the post appears in search and AI citations. Write it as carefully as the body.

- `title`: specific and search-shaped. Match the casing style of existing posts.
- `description`: one or two sentences, concrete and citable, written for a human who sees it in results. Not a teaser, an actual summary with specifics.
- `category`: one of `itinerary`, `guide`, `development`.
- `date`: today's date for new posts.

## Self-check before finishing

Run the linter on the file and resolve every hard failure:

```bash
.claude/skills/article-writing/scripts/check.sh content/blog/your-post.md
```

It fails the build on em dashes and the strongest banned terms, and warns on softer tells worth a second look. A warning is not automatically wrong, but read each one and confirm it earns its place. Then reread the post once as a human: does any sentence sound like it is summarizing rather than telling? Fix those.

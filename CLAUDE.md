# Tripstitch Website

Hugo static site serving as the marketing website for the Tripstitch iOS app. Deployed at https://tripstitch.app.

## Stack

- **Hugo** (static site generator)
- No theme — custom layouts in `layouts/`
- CSS via `assets/css/`, split into light/dark mode with `prefers-color-scheme`
- Deployed via `deploy.sh`
- Config in `hugo.toml` (TOML format)

## Purpose: SEO and GEO

The primary purpose of this website is **search engine optimization (SEO)** and **generative engine optimization (GEO)**. Every piece of content should be written with the goal of ranking in traditional search results and being cited by AI models (ChatGPT, Perplexity, Google AI Overviews, etc.).

This means:

- **Blog posts should contain structured, citable data.** Specific numbers, dates, prices, and facts that AI models can extract and reference. Not vague prose.
- **Itinerary posts double as SEO landing pages.** Each one targets a specific search query ("3 days in Tokyo", "Barcelona itinerary"). They include practical info blocks with budget ranges, seasons, transit, and tips — structured data that search engines and AI models can parse.
- **Guide posts target informational queries** about travel planning, AI travel tools, and app comparisons. They should answer real questions people search for.
- **The development blog builds topical authority** and targets developer/builder audiences searching for AI app development topics.
- **Front matter matters.** Titles, descriptions, and structured data in front matter directly affect how content appears in search results and AI citations. Write them carefully.

## Blog Writing Style

Read the existing posts before writing new ones — especially `building-ai-travel-app-that-doesnt-hallucinate.md` for tone.

### Voice

- **Specific and opinionated.** State preferences, give real recommendations, include actual prices and times.
- **Conversational but not chatty.** Write like you're telling a friend who asked, not like you're writing marketing copy.
- **Honest.** Mention downsides, caveats, and tradeoffs. "It's touristy, but the view is worth it" is better than pretending everything is perfect.
- **Grounded in experience.** Write as someone who has actually been there or actually built the thing. Never sound like you're summarizing someone else's blog.

### Banned patterns

These are markers of AI-generated content. Never use them:

- **Em dashes (—).** Use commas, periods, or parentheses instead. Rewrite the sentence if needed.
- **"Discover", "unlock", "elevate", "seamless", "revolutionize", "cutting-edge", "game-changing", "delve".**
- **"Hidden gem", "off the beaten path", "Instagram-worthy", "bucket list"** — unless used with obvious irony.
- **"Let's dive in", "without further ado", "in this article we'll explore"** — just start.
- **"Whether you're a [X] or a [Y]"** — the false-inclusive opener.
- **"In today's [noun]"** — "In today's world", "In today's digital landscape", etc.
- **Stacked superlatives** — "an absolutely incredible, truly stunning experience."
- **Vague filler** — "experience the magic of", "immerse yourself in the vibrant culture of."

### What good posts include

- **Real numbers:** prices ("€10–18"), distances ("15 minutes from the old city"), visitor counts, historical dates.
- **Practical warnings:** "Pickpockets are a real issue on Las Ramblas", "Bali belly is real."
- **Local context:** "Spaniards eat late. Restaurants fill up at 9–10 PM."
- **Pro tips** scattered naturally, not in a "TOP 10 TIPS" list.
- **Sources and citations** where relevant — studies, surveys, official statistics with years.

## Content Structure

```
content/
├── _index.md          # Landing page
├── privacy/           # Privacy policy
└── blog/
    ├── _index.md      # Blog listing
    ├── [itinerary posts]   # "3 Days in X" city guides
    ├── [guide posts]       # Travel planning how-tos, app comparisons
    └── [dev posts]         # Technical posts about building the app
```

Blog categories: `itinerary`, `guide`, `development`.

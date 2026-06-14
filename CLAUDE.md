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

The full writing rules (voice, the em dash ban, banned marketing/AI tells, what every post must include, and front matter) live in the **`article-writing` skill** (`.claude/skills/article-writing/`). Invoke it whenever drafting, rewriting, or reviewing any post, and run its `scripts/check.sh` on the file before finishing. Read a couple of existing posts for tone first, especially `building-ai-travel-app-that-doesnt-hallucinate.md`.

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

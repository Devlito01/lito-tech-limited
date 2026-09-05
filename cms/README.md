# CMS Integration Notes

The Lito Tech Limited website now supports a real Sanity-backed content workflow with JSON fallbacks for safety.

## CMS-backed content areas

- `content/site-settings.json`
- `content/services.json`
- `content/projects.json`
- `content/insights.json`

These local files still act as the fallback source when Sanity has no published content yet or when the API is unavailable.

## Current Sanity content types

- `siteSettings`
- `service`
- `project`
- `category`
- `post`

## What is already connected on the frontend

- Footer tagline, social links, and footer navigation
- Services highlights and service detail cards
- Projects listing
- Insights featured article, categories, and article cards

## How the frontend behaves

The shared frontend logic lives in `script.js`.

It will:

1. try to load published content from Sanity
2. fall back to the matching file in `content/` if Sanity is empty or unavailable

That means the website stays usable even before the CMS is fully populated.

## Important note for insights

The Insights page now expects:

- `category` documents for category cards
- `post` documents that reference a `category`

This keeps category summaries editable in Sanity instead of generating them automatically from post tags.

## Next CMS tasks later

- create the first published content entries in Sanity
- optionally add images and richer blog URLs
- decide whether the homepage and About page should also become CMS-managed

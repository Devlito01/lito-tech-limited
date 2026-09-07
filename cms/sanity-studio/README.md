# Lito Tech Limited Sanity Studio

This Studio manages the CMS-backed content for the Lito Tech Limited website.

## Connected Sanity project

- Project ID: `z69216el`
- Dataset: `production`

## Content types in this Studio

- `Site Settings`
- `Service`
- `Project`
- `Category`
- `Post`

## Local development

Run these commands from `cms/sanity-studio`:

```bash
npm install
npm run dev
```

The Studio will open locally and connect to the configured Sanity dataset.

## Seed content

A starter dataset export is included at `seed/production.ndjson`.

When you are ready to import it into Sanity, run:

```bash
sanity dataset import seed/production.ndjson production --replace
```

If you want to keep existing content and only add missing records, import without `--replace` after reviewing IDs carefully.

## Recommended content entry order

1. Create one `Site Settings` document
2. Create `Category` documents
3. Create `Post` documents and link each post to a category
4. Create `Service` documents
5. Create `Project` documents

## Frontend integration notes

The main site in `script.js` reads published content directly from Sanity.

If Sanity is empty or unreachable, the site falls back to:

- `content/site-settings.json`
- `content/services.json`
- `content/projects.json`
- `content/insights.json`

## Current scope

The CMS currently powers:

- footer content
- services page content
- projects page content
- insights page content

The homepage, About page, and Start Project page are still primarily static.

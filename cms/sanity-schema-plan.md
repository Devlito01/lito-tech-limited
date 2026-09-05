# Sanity Schema Plan

This document maps the current CMS-ready content layer of the Lito Tech Limited website to a future Sanity setup.

## Goal

Use Sanity as the future headless CMS for the parts of the website that should be editable without changing code.

## Current CMS-ready content layer

- `content/services.json`
- `content/projects.json`
- `content/insights.json`

These files are acting as the current bridge between static page markup and a future hosted CMS.

## Recommended Sanity content types

### 1. `service`

Use for the main service cards on the Services page.

Recommended fields:

- `title` : string
- `slug` : slug
- `indexLabel` : string
- `description` : text
- `items` : array of strings
- `featured` : boolean
- `seoTitle` : string
- `seoDescription` : text

Maps to:

- `content/services.json` -> `services`
- Services page detailed service cards

### 2. `serviceHighlight`

Use for the smaller highlighted service-type items near the top of the Services page.

Recommended fields:

- `title` : string
- `summary` : text
- `order` : number

Maps to:

- `content/services.json` -> `highlights`
- Services page highlight strip

### 3. `project`

Use for project entries and case-study items on the Projects page.

Recommended fields:

- `title` : string
- `slug` : slug
- `tag` : string
- `summary` : text
- `industry` : string
- `focus` : string
- `coverImage` : image
- `visualTheme` : string
- `featured` : boolean
- `seoTitle` : string
- `seoDescription` : text

Maps to:

- `content/projects.json`
- Projects page case-study cards

### 4. `post`

Use for blog posts and article entries on the Insights page.

Recommended fields:

- `title` : string
- `slug` : slug
- `tag` : string
- `excerpt` : text
- `body` : rich text
- `featured` : boolean
- `coverImage` : image
- `category` : reference to `category`
- `publishDate` : datetime
- `author` : reference to `author`
- `seoTitle` : string
- `seoDescription` : text

Maps to:

- `content/insights.json` -> `featured`
- `content/insights.json` -> `articles`
- Insights page featured article and article grid

### 5. `category`

Use for insight/blog categories.

Recommended fields:

- `title` : string
- `slug` : slug
- `summary` : text

Maps to:

- `content/insights.json` -> `categories`
- Insights page category grid

### 6. `author`

Use for blog post ownership later if the company wants a real editorial structure.

Recommended fields:

- `name` : string
- `role` : string
- `bio` : text
- `image` : image
- `socialLinks` : object or array

Maps to:

- future blog/article author support

### 7. `testimonial`

Use later when real client feedback is available.

Recommended fields:

- `name` : string
- `role` : string
- `company` : string
- `quote` : text
- `image` : image
- `featured` : boolean

Maps to:

- future Home page testimonial section
- future Services page trust section
- future Start a Project conversion support section

## Optional global content type

### 8. `siteSettings`

Use if later you want editable global settings in Sanity.

Recommended fields:

- `companyName` : string
- `email` : string
- `phone` : string
- `address` : string
- `socialLinks` : object or array
- `footerText` : text
- `logoLight` : image
- `logoDark` : image

Maps to:

- shared footer information
- social links
- future global brand settings

## Recommended implementation order later

1. `project`
2. `post`
3. `category`
4. `service`
5. `serviceHighlight`
6. `siteSettings`
7. `testimonial`
8. `author`

## Why this order works

- Projects and Insights already use structured content on the frontend.
- Services is also now content-driven.
- Site settings and testimonials can come after the core content models are stable.

## Practical migration path

Current setup:

- JSON files are loaded by frontend JavaScript.

Future setup:

- Sanity will store the content.
- Frontend JavaScript or a future framework layer will request that content from Sanity.
- The page containers and rendering logic can stay conceptually similar.

## Key principle

The page structure should remain mostly stable.

Only the source of the content changes:

- now: local JSON
- later: Sanity data

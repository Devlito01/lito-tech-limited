# Deployment Notes

This project is currently a static multi-page website.

## Current deploy-ready files

- `index.html`
- `about.html`
- `services.html`
- `projects.html`
- `insights.html`
- `start-project.html`
- `thank-you.html`
- `styles.css`
- `script.js`
- `assets/`

## Current structure

```text
Lito Tech Limited/
  index.html
  about.html
  services.html
  projects.html
  insights.html
  start-project.html
  thank-you.html
  styles.css
  script.js
  assets/
    logos/
```

## Why this is deployment-friendly

- Each major page has its own HTML file
- Shared styling is kept in one stylesheet
- Shared interactions are kept in one JavaScript file
- Assets are grouped in a dedicated folder
- The site can be uploaded directly to static hosting when ready

## Likely hosting options later

- Netlify
- Vercel
- cPanel shared hosting
- GitHub Pages for simple static deployment

## Items to add closer to launch

- final logo files
- `favicon.ico`
- analytics
- CMS connection if included before launch

## Form handling

- Inquiry forms are now configured for Netlify Forms
- `general-inquiry` is used across the main site pages
- `project-inquiry` is used on `start-project.html`
- Each submission includes an `inquirySource` field so submissions can be traced back to the page they came from

## Netlify reminder

- Deploy the static site to Netlify to activate form capture
- After the first deploy, submit a live test entry and confirm it appears in the Netlify Forms dashboard
- Keep `thank-you.html` published because forms redirect there on success

## Final reminder

Do not deploy until:

- content is approved
- branding assets are final
- navigation is complete
- form behavior is tested
- mobile layout is checked carefully

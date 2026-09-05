# Website Project Workflow Guide

Use this guide when you want to build a new website project yourself from start to finish.

## 1. Plan the project first

Before writing code, decide:

- what type of website you are building
- who the website is for
- what pages it needs
- what content should be editable later
- whether you need forms
- whether you need a CMS
- where the site will be hosted

### Example planning questions

- Do I need a homepage only or multiple pages?
- Will I need blog posts, services, or projects managed in a CMS?
- Do I need a contact form or application form?
- Will this be a static site or a dynamic web app?

## 2. Build the static website first

Start with the main website files:

- `index.html`
- additional page files like `about.html`, `services.html`, `contact.html`
- `styles.css`
- `script.js`
- `assets/`

Focus first on:

- layout
- typography
- colors
- responsiveness
- navigation
- clean page structure

Do not start with deployment or CMS before the main design works.

## 3. Make the site responsive

Check:

- desktop
- tablet
- mobile

Look for:

- broken spacing
- text too large or too small
- buttons too close together
- content overflowing the screen
- forms that are hard to use on mobile

## 4. Add CMS only where needed

Use a CMS when you want content to be editable without changing code.

Typical CMS-managed content:

- blog posts
- projects
- services
- categories
- footer settings

### Typical CMS workflow

1. Create the CMS project
2. Define the schemas
3. Add the first content entries
4. Fetch content on the frontend
5. Keep fallback content if needed

## 5. Add forms

Decide how form submissions should work.

### For simple static websites

Use:

- Netlify Forms

### For more advanced websites or apps

Use:

- Supabase
- Firebase
- custom backend/API

Form basics to remember:

- include all important fields
- add spam protection if possible
- add a thank-you page
- test on the live site

## 6. Prepare for deployment

Do not upload the full project folder directly unless it only contains live website files.

Instead:

1. create a clean deploy folder
2. copy only the live site files into it
3. upload only that deploy folder

Typical deploy folder contents:

- HTML pages
- CSS
- JS
- `assets/`
- `content/`
- `_redirects`
- `robots.txt`
- `sitemap.xml`
- favicon files

## 7. Deploy the website

For a static site, a common option is:

- Netlify

Basic deployment flow:

1. create or log in to your Netlify account
2. upload the clean deploy folder
3. enable form detection if using Netlify Forms
4. test the live site
5. test the live forms

## 8. Connect CMS on the live site

If using a CMS like Sanity:

- make sure the content is published
- make sure the live domain is allowed in Sanity CORS settings
- refresh the live pages to verify that updates appear

## 9. Do final QA before launch

Check:

- all pages load
- all links work
- forms submit correctly
- CMS updates appear live
- mobile layout looks correct
- favicon works
- logo looks correct
- footer links work
- thank-you page works

## 10. Launch and maintain

After launch:

- update content through the CMS
- monitor form submissions
- improve copy over time
- add better branding later if needed
- connect a custom domain

## Simple rule to remember

Build in this order:

1. plan
2. design
3. build
4. make responsive
5. add CMS
6. add forms
7. create deploy folder
8. deploy
9. test live
10. launch

## Best habit for future projects

Keep a small `docs/` folder in every project with:

- deployment notes
- CMS notes
- form setup notes
- launch checklist
- reusable scripts

That makes every future website project easier to manage.

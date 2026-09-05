# When To Redeploy

This note helps you know when your Lito Tech Limited website needs a new Netlify deploy and when it does not.

## Easy Rule

- `Sanity content change` = usually no redeploy
- `website code or file change` = redeploy needed

## Changes That Usually Do Not Need a Redeploy

These are CMS content updates made in Sanity:

- adding a new post
- editing a post title
- editing a post excerpt
- editing post body content
- changing project text
- changing service text
- changing category names
- updating other content that already comes from Sanity

If the page already supports that content, publishing in Sanity should update the live site without a new Netlify deploy.

## Changes That Do Need a Redeploy

These are local website project changes:

- editing HTML files
- editing CSS
- editing `script.js`
- adding a new page
- changing forms
- changing redirects
- changing favicon
- changing local images or assets
- changing QR code files used in the site
- changing deployment setup files

If you change the website files in the project folder, you need to rebuild the deploy folder and upload it again to Netlify.

## Examples

### No Redeploy Needed

- publish a new insight post
- update a service description in Sanity
- update a project summary in Sanity

### Redeploy Needed

- redesign the homepage
- remove or add a button
- change the layout
- update form handling
- add a new detail page
- update the favicon

## Best Practice

Before deploying, ask:

`Did I change only CMS content, or did I change the website files too?`

If you changed only Sanity content:

- publish in Sanity
- refresh the live site

If you changed website files:

1. rebuild the deploy folder
2. upload to Netlify
3. test the live site

## Project Reminder

For this site:

- Sanity is used for content updates
- Netlify is used to host the website files

So content changes can often go live without a new deploy, but code/design changes still require one.

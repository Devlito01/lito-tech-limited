# Netlify Deployment Guide

Use this workflow whenever you want to deploy the Lito Tech Limited website to Netlify without uploading CMS or project setup files.

## Why create a deploy folder

The main workspace contains extra files and folders used for planning and CMS work, such as:

- `cms/`
- `deployment-notes.md`
- `launch-checklist.md`
- local helper scripts

Netlify only needs the website files that should be published.

## What the deploy script does

The script `prepare-netlify-deploy.ps1` creates a clean folder at:

- `deploy/netlify-site`

It copies only the files needed for the live site:

- HTML pages
- `_redirects`
- `netlify.toml`
- `styles.css`
- `script.js`
- `robots.txt`
- `sitemap.xml`
- `assets/`
- `content/`

## How to create the deploy folder

Open PowerShell in the project folder and run:

```powershell
powershell -ExecutionPolicy Bypass -File .\prepare-netlify-deploy.ps1
```

After it finishes, upload this folder to Netlify:

- `C:\Users\HP\Documents\Lito Tech Limited\deploy\netlify-site`

## How to deploy on Netlify

1. Log in to Netlify
2. Choose `Upload your project files`
3. Select the folder `deploy/netlify-site`
4. Wait for the upload to finish
5. Open the live site URL
6. Test both Netlify forms on the deployed site

## When to rerun the script

Run the script again any time you change:

- page content
- styles
- JavaScript
- `assets/`
- `content/`

That refreshes the clean deploy folder with the latest site files.

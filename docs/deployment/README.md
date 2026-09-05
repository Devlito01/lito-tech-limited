# Deployment Instructions

Keep this folder as your quick reference whenever you want to prepare a website for Netlify or another static host.

## Files in this folder

- `README.md` : deployment basics
- `generic-deploy-template.ps1` : reusable PowerShell template for creating a clean deploy folder
- `netlify-checklist.md` : quick checklist for Netlify uploads and live checks
- `github-netlify-guide.md` : guide for deploying through GitHub instead of manual upload

## Core idea

A deployment folder is a clean copy of only the files your live website needs.

Your main project folder usually contains extra items such as:

- CMS files
- planning notes
- helper scripts
- local development tools

Those files should usually not be uploaded to Netlify.

## Simple manual workflow

For a new static project, follow this process:

1. Decide which files should go live
2. Create a clean deploy folder
3. Copy only the live website files into it
4. Upload that deploy folder to Netlify

## Files that usually belong in a deploy folder

- `index.html`
- other `.html` pages
- `styles.css`
- `script.js`
- image folders like `assets/`
- data folders like `content/`
- `robots.txt`
- `sitemap.xml`

## Manual PowerShell example

```powershell
mkdir deploy
mkdir deploy\site

Copy-Item index.html deploy\site
Copy-Item about.html deploy\site
Copy-Item styles.css deploy\site
Copy-Item script.js deploy\site
Copy-Item assets deploy\site -Recurse
```

After that, upload `deploy\site` to Netlify instead of the full project folder.

## Better repeatable method

The easiest long-term approach is to create a small PowerShell script that rebuilds the deploy folder whenever the site changes.

Example:

```powershell
$deploy = ".\deploy\site"

if (Test-Path $deploy) {
  Remove-Item $deploy -Recurse -Force
}

New-Item -ItemType Directory -Path $deploy | Out-Null

Copy-Item index.html $deploy
Copy-Item about.html $deploy
Copy-Item styles.css $deploy
Copy-Item script.js $deploy
Copy-Item assets $deploy -Recurse
```

## Why this method is useful

- it avoids uploading unnecessary files
- it reduces deployment mistakes
- it gives you one clean publishable folder every time
- it is easy to reuse across different static website projects

## Simple rule to remember

- use the main project folder for building
- use the deploy folder for publishing
- upload only the deploy folder

## For this project

This project already includes:

- `prepare-netlify-deploy.ps1`
- `deployment-guide.md`

The ready-to-upload folder for this website is created at:

- `deploy\netlify-site`

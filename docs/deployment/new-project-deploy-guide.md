# New Project Deploy Guide

This guide explains in a simple way how to prepare a deployment folder for a new website project.

## The Main Idea

When you build a website project, your main folder may contain many things:

- website files
- notes
- draft files
- docs
- CMS files
- helper scripts

But Netlify does not need everything.

It only needs the files that should go live on the website.

So the goal is:

1. keep your main project folder for working
2. create a clean deploy folder for uploading

## Very Simple Example

Imagine your project folder contains:

- `index.html`
- `about.html`
- `styles.css`
- `script.js`
- `assets`
- `docs`
- `notes.txt`

For the live site, Netlify may only need:

- `index.html`
- `about.html`
- `styles.css`
- `script.js`
- `assets`

It does not need:

- `docs`
- `notes.txt`

That is why you create a deploy folder.

## Step 1: Finish the Main Project Files

Build and edit your real website files first.

Examples:

- `index.html`
- `about.html`
- `services.html`
- `styles.css`
- `script.js`
- `assets`
- `robots.txt`
- `sitemap.xml`

## Step 2: Decide What Should Go Live

Ask:

`Which files are needed for the real website?`

Usually these are the files to include:

- HTML pages
- CSS
- JavaScript
- images
- assets folder
- content folder
- `robots.txt`
- `sitemap.xml`

## Step 3: Create a Deploy Script

Inside the project folder, create a file called:

- `prepare-netlify-deploy.ps1`

This file is a small PowerShell script that copies only the live website files into a clean deploy folder.

## Step 4: Use a Simple Starter Script

You can start with this:

```powershell
$ErrorActionPreference = "Stop"

$workspaceRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$deployRoot = Join-Path $workspaceRoot "deploy"
$siteRoot = Join-Path $deployRoot "netlify-site"

$filesToCopy = @(
  "index.html",
  "about.html",
  "styles.css",
  "script.js",
  "robots.txt",
  "sitemap.xml"
)

$foldersToCopy = @(
  "assets",
  "content"
)

if (Test-Path -LiteralPath $siteRoot) {
  Remove-Item -LiteralPath $siteRoot -Recurse -Force
}

New-Item -ItemType Directory -Path $siteRoot | Out-Null

foreach ($file in $filesToCopy) {
  $sourcePath = Join-Path $workspaceRoot $file
  if (Test-Path -LiteralPath $sourcePath) {
    Copy-Item -LiteralPath $sourcePath -Destination $siteRoot
  }
}

foreach ($folder in $foldersToCopy) {
  $sourcePath = Join-Path $workspaceRoot $folder
  if (Test-Path -LiteralPath $sourcePath) {
    Copy-Item -LiteralPath $sourcePath -Destination $siteRoot -Recurse
  }
}

Write-Host "Netlify deploy folder ready:"
Write-Host $siteRoot
```

## What This Script Does

This script:

1. creates a folder called `deploy`
2. creates a folder inside it called `netlify-site`
3. copies only the chosen website files into it

So after running it, you get:

- `deploy\netlify-site`

That is the folder you upload to Netlify.

## Step 5: Run the Script

Open PowerShell in your project folder and run:

```powershell
cd "C:\Path\To\YourProject"
powershell -ExecutionPolicy Bypass -File .\prepare-netlify-deploy.ps1
```

If it works, it will show:

```text
Netlify deploy folder ready:
C:\Path\To\YourProject\deploy\netlify-site
```

## Step 6: Upload the Deploy Folder

Go to Netlify and upload:

- `deploy\netlify-site`

Do not upload the full project folder unless you are sure it only contains live website files.

## Easy Way To Remember It

Think of it like this:

- main project folder = where you work
- deploy folder = what goes online

## Each Time You Make Changes

If you change the real website files:

1. save the changes
2. run the deploy script again
3. upload the refreshed deploy folder

## Beginner Summary

If you are confused, remember only this:

1. build the website in the main folder
2. use the script to make a clean deploy folder
3. upload that clean deploy folder to Netlify

That is the whole idea.

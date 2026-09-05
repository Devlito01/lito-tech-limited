# GitHub To Netlify Guide

Use this method when you want Netlify to redeploy automatically whenever you update your project.

## Why use GitHub deployment

- easier long-term updates
- automatic redeploys after changes
- safer version history
- better for ongoing projects

## Basic workflow

1. Put your project in a GitHub repository
2. Log in to Netlify
3. Choose `Import a Git repository`
4. Select `GitHub`
5. Authorize Netlify if prompted
6. Choose your repository
7. Set deploy options
8. Deploy the site

## For a simple static site

If the website is plain HTML, CSS, and JavaScript:

- Build command: leave empty
- Publish directory: leave empty or use the deploy folder if your repo is structured that way

## If your repo contains extra files

If the repository includes things that should not be published directly, use one of these approaches:

- keep a clean deploy folder in the repo
- use a build script that prepares the publish folder

## Recommended habit

For bigger or ongoing projects:

- work in the main project folder
- push changes to GitHub
- let Netlify deploy from the repo

For quick static projects:

- drag-and-drop deploy is fine

## Important form note

If you use Netlify Forms:

- the deployed HTML must contain the form markup
- test the forms after every meaningful deploy

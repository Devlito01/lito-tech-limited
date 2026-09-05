# Live Chat Guide

This guide shows how to add tawk.to live chat to the Lito Tech Limited website.

## Why We Use tawk.to

tawk.to is a simple live chat option for a static website.

It works well because:

- it is easy to add
- it works on static HTML sites
- you can reply from the dashboard or mobile app
- it is widely used for small business websites

Official setup guide:

- https://help.tawk.to/article/adding-a-widget-to-your-website

## How This Project Is Set Up

This website already includes a reusable live chat loader file:

- `live-chat.js`

That means you do not need to paste the full tawk.to snippet into every HTML page.

You only need to:

1. get your widget details from tawk.to
2. update `live-chat.js`
3. rebuild the deploy folder
4. upload to Netlify

## Step 1: Create or Log In to Your tawk.to Account

1. Go to https://www.tawk.to/
2. Log in
3. Create a property for your website if needed

Use your website URL for the property:

- `https://dynamic-meringue-d9ad95.netlify.app/`

## Step 2: Find the Widget Code

According to tawk.to's setup guide:

1. select the correct property
2. click `Administration`
3. click `Chat Widget`
4. copy the widget code

Official source:

- https://help.tawk.to/article/adding-a-widget-to-your-website

## Step 3: Open the Local Chat Config File

Open this file:

- `live-chat.js`

You will see:

```js
window.LITO_LIVE_CHAT = {
  provider: "tawkto",
  enabled: false,
  widgetSrc: "",
  propertyId: "",
  widgetId: "",
};
```

## Step 4: Fill the Chat Values

You have two easy options.

### Option A: Paste the Full Widget Script URL

From the tawk.to snippet, find the `src` value.

It will look something like:

```text
https://embed.tawk.to/PROPERTY_ID/WIDGET_ID
```

Paste it into:

```js
widgetSrc: "https://embed.tawk.to/PROPERTY_ID/WIDGET_ID",
```

Then change:

```js
enabled: true,
```

This is the easiest method.

### Option B: Paste Property ID and Widget ID

If you want, you can split the values:

```js
enabled: true,
propertyId: "PROPERTY_ID",
widgetId: "WIDGET_ID",
```

The loader will build the full URL for you.

## Step 5: Save the File

After updating `live-chat.js`, save it.

## Step 6: Rebuild the Deploy Folder

Run this in PowerShell from the project folder:

```powershell
powershell -ExecutionPolicy Bypass -File .\prepare-netlify-deploy.ps1
```

## Step 7: Upload the Deploy Folder to Netlify

Upload this folder:

- `deploy\netlify-site`

This is needed because live chat is a website code change, not just a CMS content change.

## Step 8: Test the Live Chat

After the new deploy:

1. open the live website
2. wait a few seconds
3. confirm the chat widget appears
4. send a test message
5. reply from the tawk.to dashboard or app

## Where the Chat Appears

The chat loader is included on the main user-facing pages.

That means once enabled, it can appear across the site after deploy.

## Best Practice

- keep the widget enabled only after testing
- make sure you are using the correct tawk.to property
- test from a private or incognito window

## Quick Reminder

If chat is not showing:

- check that `enabled` is set to `true`
- check that the widget URL or IDs are correct
- rebuild the deploy folder again
- upload the latest deploy folder to Netlify
- refresh the live site in a private window

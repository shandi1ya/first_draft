# First Draft — website

Static site. No build step.

## Deploy on Vercel
1. Push this folder to a GitHub repo (these files at the repo root).
2. Vercel → Add New → Project → import the repo.
3. Framework preset: **Other**. Leave build command and output directory empty.
4. Deploy.

## Run locally
Serve the folder over HTTP (opening index.html directly may block assets):
```
npx serve .
```

## Not yet connected
- Checkout (shows a "not connected" note)
- Newsletter and contact forms (no backend)
- Placeholder contact details and FSSAI number in the footer

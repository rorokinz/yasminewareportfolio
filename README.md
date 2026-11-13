# Player Pulse

A small, local campaign planner and community feedback workspace prepared for Yasmine Ware's social media and community internship portfolio. This is not a Riot Games product, commissioned campaign, or prior employer deliverable.

## Open the demo

Download or clone the repository and open **index.html** in a modern browser. No install, API key, login, or network connection is required. An optional local server is `python3 -m http.server 8000`, then open `http://localhost:8000`.

## What it demonstrates

- Content coordination across TikTok, Instagram, YouTube Shorts, and X.
- Visible creator ownership, creative approval, and workflow status.
- An approval/owner check before scheduling or marking a post published. This is a workflow aid, not a publishing integration.
- Manual routing of player feedback; no automatic sentiment or safety classification.
- Campaign CSV import, platform filtering, safe export, and weighted engagement calculations.
- Responsive layout, native controls, keyboard focus, live status messages, and semantic tables.

All data is fictional. Published demo cards contain sample historical results; the draft begins with zero results. Do not use this sample data as candidate employment results.

## Measurement

Total engagements = likes + comments + shares + saves. Weighted engagement rate = total engagements / total impressions across selected posts. Zero impressions produce N/A. Impressions are not unique people; these descriptive numbers do not establish causal lift or player retention.

## Data boundaries

Changes exist only in the current tab and reset on refresh. No browser storage or network analytics are used. Imports replace campaign posts; the feedback queue stays fictional. Required CSV columns are `title,platform,impressions,likes,comments,shares,saves`. Import limit is 500 rows / 200 KB; counts must be nonnegative integers. Titles are rendered as text, not HTML. Exported values with spreadsheet formula prefixes are escaped.

## Tests

With Node.js installed, run `npm test` or `node --test tests/core.test.js`. No packages are required. Tests cover weighted rates, zero denominators, CSV escaping/parsing, invalid data, and scheduling gates.
Seven automated core tests pass. JavaScript syntax is checked. Browser rendering was not verified in the authoring environment; open index.html and check the controls, CSV import, and layout before submitting.

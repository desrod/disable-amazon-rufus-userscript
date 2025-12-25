# Kill Amazon Rufus (Violentmonkey Userscript)

A minimal, resilient browser userscript that **removes Amazon’s “Rufus” AI shopping assistant** and **reclaims the wasted screen space** it leaves behind.

This script is designed to survive Amazon’s aggressive DOM obfuscation techniques, including randomized class names, dynamic reinjection, and closed Shadow DOM.

All of the suggestions on [this detailed Reddit thread](https://www.reddit.com/r/amazonprime/comments/1ezd7u4/rufus_how_to_disable/) were useless, so I wrote this instead. 

---

## What This Does

- Completely hides the Rufus dock / panel (even when rendered inside opaque or closed Shadow DOM)
- Prevents Rufus from reappearing during navigation or dynamic page updates
- Removes Amazon’s “dock-left” layout offset so content snaps back to the left
- Works on search pages, product pages, and other Amazon layouts
- Requires **no selectors tied to Amazon internals** (IDs/classes/text are not relied upon)

---

## Why This Exists

Amazon’s Rufus widget is:
- Injected dynamically
- Frequently renamed
- Often hosted inside closed Shadow DOM
- Re-applied on every navigation event

Traditional CSS rules and DOM selectors are unreliable here.  
This script uses **edge probing + geometry heuristics** to remove the actual dock container and then fixes the layout shift it causes.

---

## Requirements

- A Chromium- or Firefox-based browser
- One of the following userscript managers:
  - **Violentmonkey** (recommended)
  - Tampermonkey (should work, but not primary target)

---

## Installation

### Step 1: Install Violentmonkey

- Chrome / Edge:  
  https://violentmonkey.github.io/get-it/
- Firefox:  
  https://addons.mozilla.org/firefox/addon/violentmonkey/

---

### Step 2: Create the Userscript

1. Click the Violentmonkey icon
2. Choose **“Create new script”**
3. Delete the default template
4. Paste the contents of the script file (`amazon-kill-rufus.user.js`)
5. Save

---

## Supported Domains

```
https://www.amazon.com/*
https://www.amazon.*/*
```

---

## How It Works (High Level)

1. Early CSS override to reclaim layout space
2. Screen-edge probing to identify the dock container
3. Geometry-based scoring to avoid false positives
4. Safe hiding (no DOM removal)
5. Persistent MutationObserver enforcement

---

## Known Tradeoffs

- Any future Amazon UI that introduces a fixed left-docked panel with similar geometry may also be hidden.
- This is intentional and considered an acceptable tradeoff for reliability.

---

## License

Apache 2.0, see LICENSE file for details 

---

## Disclaimer

This project is not affiliated with Amazon.  
It modifies client-side rendering only.

// ==UserScript==
// @name           Amazon: Kill Rufus + Reclaim Left Space (minimal)
// @namespace      https://amazon.com/
// @author         setuid@gmail.com
// @match          https://www.amazon.com/*
// @match          https://www.amazon.*/*
// @run-at         document-start
// @updateURL      https://github.com/desrod/disable-amazon-rufus-userscript/edit/main/block-amazon-rufus.js
// @downloadURL    https://github.com/desrod/disable-amazon-rufus-userscript/edit/main/block-amazon-rufus.js
// @version        25.12.25.1
// @grant          none
// ==/UserScript==

(function () {
  "use strict";

  const S = document.createElement("style");
  S.textContent =
    'html,body,#a-page,#pageContent,#search,#dp,main,[role="main"],#search>div,#search>div>div{margin-left:0!important;padding-left:0!important;left:0!important;transform:none!important}';
  document.documentElement.appendChild(S);

  const ROOT_IDS = new Set(["a-page", "pageContent", "nav-main", "search", "dp"]);
  const isRootish = (e) =>
    !e || !(e instanceof Element) || e.tagName === "HTML" || e.tagName === "BODY" || (e.id && ROOT_IDS.has(e.id));

  const stripBody = () => {
    const b = document.body;
    if (!b) return;
    for (const c of Array.from(b.classList)) {
      const t = c.toLowerCase();
      if (t.startsWith("rufus-") || t.includes("rufus")) b.classList.remove(c);
    }
  };

  const hide = (e) => {
    if (isRootish(e) || e.getAttribute("data-vm-hidden") === "1") return;
    e.setAttribute("data-vm-hidden", "1");
    e.style.setProperty("display", "none", "important");
    e.style.setProperty("visibility", "hidden", "important");
    e.style.setProperty("pointer-events", "none", "important");
  };

  const score = (e) => {
    if (isRootish(e)) return -1;
    const r = e.getBoundingClientRect();
    if (!r || r.width <= 0 || r.height <= 0) return -1;
    if (r.left > 30 || r.width < 240 || r.width > 750 || r.height < 240) return -1;
    const cs = getComputedStyle(e);
    let s = 0;
    if (cs.position === "fixed" || cs.position === "sticky") s += 3;
    const zi = parseInt(cs.zIndex, 10);
    if (Number.isFinite(zi) && zi >= 50) s += 2;
    if (r.height > r.width * 1.1) s += 1;
    if (r.top < 140) s += 1;
    if (r.width > innerWidth * 0.95 && r.height > innerHeight * 0.95) s -= 10;
    return s;
  };

  const climb = (hit) => {
    let best = null,
      bestS = -1,
      cur = hit;
    for (let i = 0; i < 12 && cur && cur instanceof Element; i++) {
      const s = score(cur);
      if (s > bestS) (bestS = s), (best = cur);
      cur = cur.parentElement;
      if (cur && isRootish(cur)) break;
    }
    return bestS >= 3 ? best : null;
  };

  const killDock = () => {
    stripBody();
    const xs = [2, 6, 12, 18],
      ys = [80, 120, 180, 260, 340, 420, 520, 620, 720];
    let best = null,
      bestS = -1;
    for (const x of xs)
      for (const y of ys) {
        if (y >= innerHeight - 5) continue;
        const hit = document.elementFromPoint(x, y);
        if (!hit) continue;
        const cand = climb(hit);
        if (!cand) continue;
        const s = score(cand);
        if (s > bestS) (bestS = s), (best = cand);
      }
    if (best) hide(best);
  };

  const reclaim = () => {
    stripBody();
    const roots = [
      document.getElementById("search"),
      document.getElementById("dp"),
      document.getElementById("pageContent"),
      document.getElementById("a-page"),
      document.querySelector("main"),
      document.querySelector('[role="main"]'),
    ].filter(Boolean);

    for (const e of roots) {
      const r = e.getBoundingClientRect();
      if (r && r.left > 50) {
        e.style.setProperty("margin-left", "0", "important");
        e.style.setProperty("padding-left", "0", "important");
        e.style.setProperty("left", "0", "important");
        e.style.setProperty("transform", "none", "important");
      }
    }

    const cs = document.querySelectorAll("div,section,main");
    for (const e of cs) {
      if (isRootish(e)) continue;
      const r = e.getBoundingClientRect();
      if (r && r.left > 120 && r.width > innerWidth * 0.35 && r.height > innerHeight * 0.35) {
        e.style.setProperty("margin-left", "0", "important");
        e.style.setProperty("padding-left", "0", "important");
        e.style.setProperty("left", "0", "important");
        e.style.setProperty("transform", "none", "important");
        break;
      }
    }
  };

  const sweep = () => {
    killDock();
    reclaim();
  };

  new MutationObserver(sweep).observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["class", "style"],
  });

  sweep();
  setTimeout(sweep, 200);
  setTimeout(sweep, 1200);
  setInterval(sweep, 2500);
})();

// Drives the running canvasManagement dev server with a real browser and
// screenshots each route. Runs INSIDE the playwright container (see SKILL.md),
// never on the WSL host — there is no browser installed there.
//
//   node driver.mjs [route ...]      routes default to "/"
//   BASE=http://localhost:3000       dev server, reached via --network host
//   OUT=/out                         mounted screenshot directory
//
// Exits non-zero if a route renders an empty body, which is what a failed
// launch looks like from the outside.

import { chromium } from "playwright";

const base = process.env.BASE || "http://localhost:3000";
const outDir = process.env.OUT || "/out";
const routes = process.argv.slice(2).length ? process.argv.slice(2) : ["/"];

const slug = (route) =>
  route.replace(/^\//, "").replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "") ||
  "home";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });

const problems = [];
page.on("console", (m) => {
  if (m.type() === "error") problems.push("CONSOLE " + m.text().slice(0, 180));
});
page.on("pageerror", (e) => problems.push("PAGEERROR " + String(e).slice(0, 180)));

let failed = false;

for (const route of routes) {
  const name = slug(route);
  try {
    // networkidle alone is not enough: tanstack start streams the shell first,
    // so the interesting panels appear a beat later
    await page.goto(base + route, { waitUntil: "networkidle", timeout: 45000 });
  } catch (e) {
    console.log(`${name}: navigation problem — ${String(e).slice(0, 140)}`);
  }
  await page.waitForTimeout(2500);

  const path = `${outDir}/${name}.png`;
  await page.screenshot({ path });

  const info = await page.evaluate(() => {
    const el = document.querySelector("body > div") || document.body;
    const cs = getComputedStyle(el);
    return {
      background: cs.backgroundColor,
      color: cs.color,
      // a styled page has hundreds of tailwind rules; single digits means the
      // stylesheet never compiled
      cssRules: [...document.styleSheets].reduce((n, s) => {
        try {
          return n + s.cssRules.length;
        } catch {
          return n;
        }
      }, 0),
      text: document.body.innerText.replace(/\s+/g, " ").trim().slice(0, 120),
    };
  });

  if (!info.text) {
    failed = true;
    console.log(`${name}: EMPTY BODY — the app did not render`);
  }
  console.log(`${name} -> ${path} ${JSON.stringify(info)}`);
}

// hydration mismatches and quiz parse noise are expected on this project, see
// the Gotchas section of SKILL.md before chasing them
console.log(
  "problems:",
  problems.length ? JSON.stringify([...new Set(problems)].slice(0, 8)) : "none"
);

await browser.close();
process.exit(failed ? 1 : 0);

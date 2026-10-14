// Captures showcase screenshots of the running storefront.
// Usage:  node scripts/capture-screenshots.mjs [outputDir]
// Needs the frontend (5173) and backend (8080) running.
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import path from "node:path";

const BASE = process.env.BASE_URL ?? "http://localhost:5173";
const OUT = path.resolve(process.argv[2] ?? "screenshots");
mkdirSync(OUT, { recursive: true });

const settle = async (page) => {
  await page.waitForLoadState("networkidle");
  // scroll through the page so lazy images load, then return to the top
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
    await Promise.all(
      [...document.images]
        .filter((i) => !i.complete)
        .map((i) => new Promise((r) => { i.onload = i.onerror = r; }))
    );
  });
  await page.waitForTimeout(500);
};

const snap = async (page, name, fullPage = false) => {
  await settle(page);
  await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage });
  console.log("saved", `${name}.png`);
};

const browser = await chromium.launch();

async function run(viewport, prefix, steps) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 2, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await steps(page, prefix);
  await ctx.close();
}

// Desktop
await run({ width: 1440, height: 900 }, "desktop", async (page, p) => {
  await page.goto(`${BASE}/`);
  await page.waitForSelector(".slide");
  await snap(page, `${p}-home-hero`);
  await snap(page, `${p}-home-full`, true);

  await page.goto(`${BASE}/shop`);
  await page.waitForSelector(".grid--shop .card");
  await snap(page, `${p}-shop`);

  await page.goto(`${BASE}/shop?category=1`);
  await page.waitForSelector(".grid--shop .card");
  await snap(page, `${p}-shop-category`, true);

  await page.goto(`${BASE}/shop`);
  await page.waitForSelector(".grid--shop .card");
  await page.locator(".grid--shop .card").nth(2).click();
  await page.waitForSelector(".detail");
  await snap(page, `${p}-product`);

  // add two different products to fill the cart
  await page.getByRole("button", { name: "Add to cart" }).click();
  await page.goto(`${BASE}/shop`);
  await page.waitForSelector(".grid--shop .card");
  await page.locator(".grid--shop .card").nth(9).click();
  await page.waitForSelector(".detail");
  await page.getByRole("button", { name: "Add to cart" }).click();
  await page.waitForSelector(".cart");
  await snap(page, `${p}-cart`);

  await page.goto(`${BASE}/account`);
  await snap(page, `${p}-account`);
});

// Mobile
await run({ width: 390, height: 844 }, "mobile", async (page, p) => {
  await page.goto(`${BASE}/`);
  await page.waitForSelector(".slide");
  await snap(page, `${p}-home`);

  await page.goto(`${BASE}/shop`);
  await page.waitForSelector(".grid--shop .card");
  await snap(page, `${p}-shop`);

  await page.locator(".grid--shop .card").nth(2).click();
  await page.waitForSelector(".detail");
  await snap(page, `${p}-product`);
});

await browser.close();
console.log("Done:", OUT);

import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

await mkdir("screenshots", { recursive: true });
const browser = await chromium.launch();
try {
  for (const [device, viewport] of Object.entries({
    desktop: { width: 1440, height: 1000 },
    mobile: { width: 390, height: 844 },
  })) {
    const page = await browser.newPage({ viewport });
    for (const [name, route] of Object.entries({
      home: "/",
      projects: "/projects",
      detail: "/projects/the-courtyard-house",
      people: "/people",
      contact: "/contact",
    })) {
      await page.goto(`http://127.0.0.1:5173${route}`);
      await page.evaluate(async () => {
        await document.fonts.ready;
        for (const image of document.images) image.loading = "eager";
        await Promise.all([...document.images].map((image) => image.decode()));
      });
      await page.screenshot({
        path: `screenshots/${name}-${device}.png`,
        fullPage: true,
      });
      if (name === "home")
        await page.screenshot({ path: `screenshots/hero-${device}.png` });
    }
    await page.close();
  }
} finally {
  await browser.close();
}
console.log("Captured desktop and mobile pages with all local images decoded.");

import { test, expect } from "@playwright/test";

test("interior items reveal once as they enter the viewport", async ({
  page,
}) => {
  await page.goto("/expertise");

  const story = page.locator("#expertise-news .editorial-story").first();
  await expect(page.locator("#expertise-news")).toHaveAttribute(
    "data-reveal-ready",
    "true",
  );
  await expect(story).not.toHaveAttribute("data-reveal", "visible");

  await story.scrollIntoViewIfNeeded();
  await expect(story).toHaveAttribute("data-reveal", "visible");
  await expect(story).toHaveCSS("animation-name", "reveal-exhibition-panel");
  await expect(story).toHaveCSS("opacity", "1");

  await page.evaluate(() => window.scrollTo(0, 0));
  await story.scrollIntoViewIfNeeded();
  await expect(story).toHaveAttribute("data-reveal", "visible");
});

test("reduced motion keeps all content immediately visible", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/people");

  const person = page.locator(".person").first();
  await expect(person).toBeVisible();
  await expect(person).toHaveCSS("opacity", "1");
  await expect(person).toHaveCSS("animation-name", "none");
});

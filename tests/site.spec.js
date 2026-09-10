import { test, expect } from "@playwright/test";

test("landing fills the screen without scrolling and carousel works", async ({
  page,
}, testInfo) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map((image) => image.decode()));
  });
  await expect(page.locator("footer")).toHaveCount(0);
  await expect(page.locator(".landing-slide.is-active")).toHaveAttribute(
    "aria-label",
    "Explore The Courtyard House",
  );
  const geometry = await page.evaluate(() => {
    const header = document.querySelector("header").getBoundingClientRect();
    const carousel = document
      .querySelector(".landing-carousel")
      .getBoundingClientRect();
    return {
      left: carousel.left,
      right: carousel.right,
      top: carousel.top,
      bottom: carousel.bottom,
      headerTop: header.top,
      headerBottom: header.bottom,
      width: innerWidth,
      height: innerHeight,
      scrollHeight: document.documentElement.scrollHeight,
    };
  });
  expect(geometry.left).toBe(0);
  expect(geometry.right).toBe(geometry.width);
  expect(geometry.top).toBe(0);
  expect(geometry.headerTop).toBe(0);
  expect(geometry.headerBottom).toBeLessThan(geometry.bottom);
  expect(geometry.bottom).toBe(geometry.height);
  expect(geometry.scrollHeight).toBe(geometry.height);
  await page.mouse.wheel(0, 800);
  expect(await page.evaluate(() => scrollY)).toBe(0);
  await page.screenshot({
    path: `screenshots/home-${testInfo.project.name}.png`,
  });
  await page.screenshot({
    path: `screenshots/hero-${testInfo.project.name}.png`,
  });
  await page.getByRole("button", { name: "Show The White Pavilion" }).click();
  await expect(page.locator(".landing-slide.is-active")).toHaveAttribute(
    "aria-label",
    "Explore The White Pavilion",
  );
  await page.getByRole("button", { name: "Show The Courtyard House" }).click();
  await expect(page.locator(".landing-slide.is-active")).toHaveAttribute(
    "aria-label",
    "Explore The Courtyard House",
  );
  await page.getByRole("button", { name: "Show A House in the Trees" }).click();
  await expect(page.locator(".landing-slide.is-active")).toHaveAttribute(
    "aria-label",
    "Explore A House in the Trees",
  );
  await page.keyboard.press("ArrowRight");
  await expect(page.locator(".landing-slide.is-active")).toHaveAttribute(
    "aria-label",
    "Explore The Courtyard House",
  );
  await page
    .getByRole("link", { name: "Explore The Courtyard House", exact: true })
    .click();
  await expect(page).toHaveURL(/projects\/the-courtyard-house/);
  await expect(page.locator("footer")).toBeVisible();
  expect(errors).toEqual([]);
});

test("slideshow advances slowly, pauses, resumes and respects reduced motion", async ({
  page,
}) => {
  await page.clock.install();
  await page.goto("/");
  const carousel = page.locator(".landing-carousel");
  const active = page.locator(".landing-slide.is-active");
  await expect(carousel).toHaveAttribute("data-playing", "true");
  await page.clock.fastForward(7100);
  await expect(active).toHaveAttribute(
    "aria-label",
    "Explore The White Pavilion",
  );
  await page.getByRole("button", { name: "Pause slideshow" }).click();
  await page.mouse.move(5, 200);
  await expect(carousel).toHaveAttribute("data-playing", "false");
  await page.clock.fastForward(20000);
  await expect(active).toHaveAttribute(
    "aria-label",
    "Explore The White Pavilion",
  );
  await page.getByRole("button", { name: "Play slideshow" }).click();
  await page.mouse.move(5, 200);
  await expect(carousel).toHaveAttribute("data-playing", "true");
  await page.clock.fastForward(7100);
  await expect(active).toHaveAttribute(
    "aria-label",
    "Explore A House in the Trees",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(carousel).toHaveAttribute("data-playing", "false");
  await page.clock.fastForward(20000);
  await expect(active).toHaveAttribute(
    "aria-label",
    "Explore A House in the Trees",
  );
  await expect(active.locator("img")).toHaveCSS("animation-name", "none");
  await page.getByRole("button", { name: "Show The Courtyard House" }).click();
  await expect(active).toHaveAttribute(
    "aria-label",
    "Explore The Courtyard House",
  );
});

test("project filters, search, empty state and list view", async ({
  page,
}, testInfo) => {
  await page.goto("/projects");
  await expect(page.locator(".project-card")).toHaveCount(6);
  await page.getByRole("button", { name: "Residential" }).click();
  await expect(page.locator(".project-card")).toHaveCount(2);
  await page.reload();
  await expect(page.locator(".project-card")).toHaveCount(2);
  await page.getByRole("button", { name: "All", exact: false }).first().click();
  await page.getByRole("textbox", { name: "Search projects" }).fill("Pune");
  await expect(page.locator(".project-card")).toHaveCount(1);
  await expect(page.locator(".project-card")).toContainText("Common Ground");
  await page
    .getByRole("textbox", { name: "Search projects" })
    .fill("no-such-project");
  await expect(
    page.getByRole("heading", { name: "No projects found." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Reset filters" }).click();
  await page.getByRole("button", { name: "List view" }).click();
  await expect(page.locator(".projects-list .project-card")).toHaveCount(6);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Grid view" }).click();
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: `screenshots/projects-${testInfo.project.name}.png`,
    fullPage: true,
  });
});

test("expertise navigation shows services and routes project enquiries", async ({
  page,
}) => {
  await page.goto("/");
  if (await page.getByRole("button", { name: "Open menu" }).isVisible()) {
    await page.getByRole("button", { name: "Open menu" }).click();
  }
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Expertise" })
    .click();
  await expect(page).toHaveURL(/\/expertise$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Structural clarity.",
  );
  const expertiseNav = page.getByRole("navigation", {
    name: "Expertise sections",
  });
  await expect(expertiseNav.getByRole("link")).toHaveCount(4);
  await expertiseNav.getByRole("link", { name: "Clients" }).click();
  await expect(page).toHaveURL(/#expertise-clients$/);
  await expect(page.locator("#expertise-clients")).toBeInViewport();
  await expertiseNav.getByRole("link", { name: "Stats" }).click();
  await expect(page).toHaveURL(/#expertise-stats$/);
  await expect(page.locator("#expertise-stats")).toBeInViewport();
  await expect(page.locator(".expertise-stats dl > div")).toHaveCount(4);
  await expect(page.locator(".expertise-stats")).toContainText(
    "80+Projects imagined & built",
  );
  await expect(page.locator(".expertise-offerings article")).toHaveCount(4);
  await expect(page.locator(".expertise-news-grid > a")).toHaveCount(3);
  await expect(page.locator(".expertise-client-list > span")).toHaveCount(5);
  await page.getByRole("link", { name: "Making room for the sky" }).click();
  await expect(page).toHaveURL(/\/journal\/room-for-the-sky$/);
  await page.goBack();
  await page
    .getByRole("link", { name: "Structural design", exact: true })
    .first()
    .click();
  await expect(page).toHaveURL(/\/contact\?service=Structural%20design/);
  await expect(page.getByRole("combobox")).toHaveValue("Structural design");
});

test("project detail drawings, accessible lightbox and next project", async ({
  page,
}, testInfo) => {
  await page.goto("/projects/the-courtyard-house");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "The Courtyard House",
  );
  await expect(page.locator(".project-facts")).toContainText("Design partner");
  await page.getByRole("button", { name: "Drawings", exact: true }).click();
  const trigger = page.getByRole("button", {
    name: "Enlarge Ground floor plan",
  });
  await trigger.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator(".lightbox-caption")).toContainText(
    "Concept sketch",
  );
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await page.getByRole("button", { name: "Sketches", exact: true }).click();
  await expect(page.locator(".project-gallery .sketch")).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: `screenshots/detail-${testInfo.project.name}.png`,
    fullPage: true,
  });
  await page.locator(".next-project").click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "The White Pavilion",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

test("contact validates input and prepares an honest email handoff", async ({
  page,
}, testInfo) => {
  await page.goto("/contact?service=Structural%20retrofit");
  await expect(page.getByRole("combobox")).toHaveValue("Structural retrofit");
  await page.getByRole("button", { name: "Prepare enquiry" }).click();
  await expect(
    page.getByRole("heading", { name: "Your enquiry is ready." }),
  ).toHaveCount(0);
  await page.getByLabel("Your name").fill("Sample Client");
  await page.getByLabel("Email address").fill("client@example.com");
  await page.getByLabel("Project location").fill("Pune");
  await page
    .getByLabel("A little about your project")
    .fill(
      "We are planning to adapt an existing workplace and would like to discuss structural options.",
    );
  await page.screenshot({
    path: `screenshots/contact-${testInfo.project.name}.png`,
    fullPage: true,
  });
  await page.getByRole("button", { name: "Prepare enquiry" }).click();
  await expect(
    page.getByRole("heading", { name: "Your enquiry is ready." }),
  ).toBeVisible();
  await expect(
    page.getByText("Nothing has been sent.", { exact: false }),
  ).toBeVisible();
  await expect(
    page.getByRole("textbox", { name: "Prepared enquiry" }),
  ).toContainText("Sample Client");
  await expect(
    page.getByRole("link", { name: "Open email app" }),
  ).toHaveAttribute("href", /^mailto:hello@specs\.example\?/);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

test("navigation, people, journal and unknown routes", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  if (testInfo.project.name === "mobile")
    await page.getByRole("button", { name: "Open menu" }).click();
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "People" })
    .click();
  await expect(page.locator(".person")).toHaveCount(3);
  await page.evaluate(async () => {
    for (const image of document.querySelectorAll(".person img"))
      image.loading = "eager";
    await Promise.all(
      [...document.querySelectorAll(".person img")].map((image) =>
        image.decode(),
      ),
    );
  });
  expect(
    await page.evaluate(() => {
      const cards = [...document.querySelectorAll(".person")];
      const valuesTop = document
        .querySelector(".people-values")
        .getBoundingClientRect().top;
      return cards.every(
        (card) =>
          card.querySelector("p").getBoundingClientRect().bottom <= valuesTop &&
          card.querySelector("p").getBoundingClientRect().bottom <=
            card.getBoundingClientRect().bottom + 1,
      );
    }),
  ).toBe(true);
  if (testInfo.project.name === "mobile")
    await expect(
      page.getByRole("button", { name: "Open menu" }),
    ).toHaveAttribute("aria-expanded", "false");
  await page.screenshot({
    path: `screenshots/people-${testInfo.project.name}.png`,
    fullPage: true,
  });
  await page.goto("/journal/room-for-the-sky");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Making room for the sky",
  );
  await page.getByRole("link", { name: "Explore the project" }).click();
  await expect(page).toHaveURL(/projects\/the-courtyard-house/);
  await page.goto("/not-a-page");
  await expect(
    page.getByRole("heading", { name: "A little off plan." }),
  ).toBeVisible();
});

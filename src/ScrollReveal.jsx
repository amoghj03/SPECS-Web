import { useEffect, useRef } from "react";

export default function ScrollReveal({
  as: Component = "div",
  children,
  className = "",
  items = ":scope > *",
  ...props
}) {
  const root = useRef(null);

  useEffect(() => {
    const container = root.current;
    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    if (
      !container ||
      motionPreference.matches ||
      !("IntersectionObserver" in window)
    ) {
      return;
    }

    const registeredItems = new WeakSet();
    const observer = new IntersectionObserver(
      (entries) => {
        const enteringItems = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => {
            const verticalDifference =
              a.boundingClientRect.top - b.boundingClientRect.top;
            return Math.abs(verticalDifference) > 12
              ? verticalDifference
              : a.boundingClientRect.left - b.boundingClientRect.left;
          });

        enteringItems.forEach((entry, index) => {
          entry.target.style.setProperty(
            "--reveal-delay",
            `${Math.min(index, 4) * 70}ms`,
          );
          entry.target.dataset.reveal = "visible";
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -7%" },
    );

    const registerItems = () => {
      container.querySelectorAll(items).forEach((item) => {
        if (registeredItems.has(item)) return;
        registeredItems.add(item);
        item.dataset.scrollRevealItem = "";
        observer.observe(item);
      });
    };

    registerItems();
    container.dataset.revealReady = "true";

    const mutations = new MutationObserver(registerItems);
    mutations.observe(container, { childList: true, subtree: true });

    const finishImmediately = (event) => {
      if (!event.matches) return;
      observer.disconnect();
      mutations.disconnect();
      container
        .querySelectorAll("[data-scroll-reveal-item]")
        .forEach((item) => {
          item.dataset.reveal = "visible";
          item.style.removeProperty("--reveal-delay");
        });
    };

    motionPreference.addEventListener("change", finishImmediately);

    return () => {
      observer.disconnect();
      mutations.disconnect();
      motionPreference.removeEventListener("change", finishImmediately);
    };
  }, [items]);

  return (
    <Component
      ref={root}
      className={`scroll-reveal ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
}

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Pause, Play } from "lucide-react";
import { imagePath, projects } from "./data";
import "./landing.css";

// Order and focal points are curated for a full-screen architectural portfolio.
const featured = [
  { slug: "the-material-house", image: "hero-residence", position: "50% 60%", mobilePosition: "45% 50%", alt: "Sculpted timber-clad residence with a sheltered entrance" },
  { slug: "the-evening-house", image: "hero-opening-dusk", position: "50% 45%", mobilePosition: "40% 45%", overview: true, alt: "Warmly illuminated glass and brick residence framed by trees at dusk" },
  { slug: "the-sky-court", image: "hero-single-tower", position: "50% 20%", mobilePosition: "78% 50%", overview: true, alt: "Full-height view of the Burj Al Arab, with sea and open sky surrounding its sail-shaped silhouette" },
  { slug: "the-garden-residence", image: "hero-landscape-courtyard", position: "50% 55%", mobilePosition: "40% 50%", overview: true, alt: "Olive trees, stone planters, and a reflecting pool beside contemporary architecture" },
  { slug: "the-courtyard-house", image: "hero-interior", position: "50% 58%", mobilePosition: "50% 50%", alt: "Light-filled living room with arched windows and exposed timber beams" },
  { slug: "the-exchange", image: "hero-landscape-garden", position: "50% 52%", mobilePosition: "62% 50%", overview: true, alt: "Glass-fronted architecture opening onto a planted garden and lily pond" },
  { slug: "a-house-in-the-trees", image: "hero-living", position: "50% 62%", mobilePosition: "60% 50%", alt: "Timber and glass residence framed by mature trees and garden planting" },
].map((slide) => ({ ...projects.find((project) => project.slug === slide.slug), ...slide }));
const SLIDE_DURATION = 7000;

export default function Landing() {
  const [{ index, previous }, setSlide] = useState({
    index: 0,
    previous: null,
  });
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);
  const [controlsHovered, setControlsHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(document.hidden);
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const carousel = useRef(null);
  const touchStart = useRef(null);
  const swiped = useRef(false);
  const playing =
    ready &&
    !paused &&
    !controlsHovered &&
    !focused &&
    !hidden &&
    !reducedMotion;

  useEffect(() => {
    let cancelled = false;
    Promise.all(
      [...carousel.current.querySelectorAll("img")].map((image) =>
        image.decode().catch(() => {}),
      ),
    ).then(() => {
      if (!cancelled) setReady(true);
    });
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(media.matches);
    const updateVisibility = () => setHidden(document.hidden);
    media.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      cancelled = true;
      media.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => {
      setSlide((current) => ({
        index: (current.index + 1) % featured.length,
        previous: current.index,
      }));
    }, SLIDE_DURATION);
    return () => window.clearTimeout(timer);
  }, [playing, index]);

  const select = (next) => {
    setPaused(true);
    setSlide((current) =>
      next === current.index
        ? current
        : { index: next, previous: current.index },
    );
  };
  const move = (direction) =>
    select((index + direction + featured.length) % featured.length);

  return (
    <section
      ref={carousel}
      className="landing-carousel"
      data-playing={playing}
      data-ready={ready}
      aria-label="Featured projects"
      aria-roledescription="carousel"
      onFocusCapture={(event) =>
        setFocused(!event.target.closest("[data-autoplay-toggle]"))
      }
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFocused(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          move(event.key === "ArrowRight" ? 1 : -1);
        }
      }}
      onTouchStart={(event) => {
        touchStart.current = event.touches[0].clientX;
        swiped.current = false;
      }}
      onTouchEnd={(event) => {
        if (touchStart.current === null) return;
        const distance = event.changedTouches[0].clientX - touchStart.current;
        if (Math.abs(distance) > 50) {
          swiped.current = true;
          move(distance < 0 ? 1 : -1);
        }
        touchStart.current = null;
      }}
      onClickCapture={(event) => {
        if (swiped.current) {
          event.preventDefault();
          event.stopPropagation();
          swiped.current = false;
        }
      }}
    >
      <h1 className="visually-hidden">
        SPECS — Structural thinking. Human spaces.
      </h1>
      {featured.map((project, slideIndex) => (
        <Link
          key={project.slug}
          to={`/projects/${project.slug}`}
          className={`landing-slide ${slideIndex === index ? "is-active" : slideIndex === previous ? "is-previous" : ""}`}
          aria-label={`Explore ${project.name}`}
          aria-hidden={slideIndex !== index}
          tabIndex={slideIndex === index ? 0 : -1}
          style={{ "--slide-position": project.position, "--slide-mobile-position": project.mobilePosition, "--slide-zoom-from": project.overview ? 1 : 1.04, "--slide-zoom-to": project.overview ? 1 : 1.01 }}
        >
          <picture>
          {project.mobileImage && <source media="(max-width: 600px)" srcSet={imagePath(project.mobileImage)} />}
          <img
            src={imagePath(project.image)}
            alt={project.alt || `${project.name} — architecture photograph`}
            decoding="async"
            draggable="false"
            fetchPriority={slideIndex === 0 ? "high" : "auto"}
          />
          </picture>
        </Link>
      ))}
      <div
        className="landing-controls"
        aria-label="Carousel controls"
        onMouseEnter={() => setControlsHovered(true)}
        onMouseLeave={() => setControlsHovered(false)}
      >
        {featured.map((project, slideIndex) => (
          <button
            key={project.slug}
            className="landing-dot"
            onClick={() => select(slideIndex)}
            aria-label={`Show ${project.name}`}
            aria-pressed={slideIndex === index}
          >
            <span />
          </button>
        ))}
        {!reducedMotion && (
          <button
            className="landing-playback"
            data-autoplay-toggle
            onClick={() => {
              setFocused(false);
              setPaused((current) => !current);
            }}
            aria-label={paused ? "Play slideshow" : "Pause slideshow"}
          >
            {paused ? <Play size={14} /> : <Pause size={14} />}
          </button>
        )}
      </div>
      <span
        className="visually-hidden"
        role="status"
        aria-live={playing ? "off" : "polite"}
      >
        {featured[index].name}, slide {index + 1} of {featured.length}
      </span>
    </section>
  );
}

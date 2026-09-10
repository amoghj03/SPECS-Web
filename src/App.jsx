import { useEffect, useRef, useState } from "react";
import {
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  X,
  Menu,
  Grid2X2,
  List,
  Search,
  Maximize2,
  Check,
  Copy,
  Mail,
  MapPin,
  Instagram,
  Linkedin,
  Facebook,
  Youtube,
  Twitter,
} from "lucide-react";
import { projects, services, people, articles, imagePath, studioContact } from "./data";
import Landing from "./Landing.jsx";
import ScrollReveal from "./ScrollReveal.jsx";

const ArrowLink = ({ to, children, className = "" }) => (
  <Link className={`arrow-link ${className}`} to={to}>
    {children}
    <ArrowUpRight size={19} aria-hidden="true" />
  </Link>
);
const Photo = ({ name, alt, eager = false, ...props }) => (
  <img
    src={imagePath(name)}
    alt={alt}
    loading={eager ? "eager" : "lazy"}
    decoding="async"
    {...props}
  />
);

const projectCategories = ["All", "Residential", "Commercial", "Cultural", "Institutional"];
const pageSections = {
  "/expertise": [
    ["Stats", "expertise-stats"],
    ["Services", "expertise-services"],
    ["News & Articles", "expertise-news"],
    ["Clients", "expertise-clients"],
  ],
  "/people": [
    ["Profile", "people-profile"],
    ["Team", "people-team"],
    ["Philosophy", "people-philosophy"],
  ],
};

function SectionNavigation({ pathname, onNavigate }) {
  const [params, setParams] = useSearchParams();
  const sections = pageSections[pathname];
  const [active, setActive] = useState("");

  useEffect(() => {
    if (!sections) return;
    let frame;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        let current = sections[0][1];
        for (const [, id] of sections) {
          const element = document.getElementById(id);
          if (element && element.getBoundingClientRect().top <= window.innerHeight * 0.35) {
            current = id;
          }
        }
        setActive(current);
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [sections]);

  if (!sections && pathname !== "/projects") return null;

  return (
    <nav className="section-navigation" aria-label={pathname === "/projects" ? "Project categories" : pathname === "/people" ? "People sections" : "Expertise sections"}>
      <div className="section-navigation-links">
        {sections ? sections.map(([label, id]) => (
          <a key={id} href={`#${id}`} aria-current={(active || sections[0][1]) === id ? "location" : undefined} onClick={onNavigate}>
            {label}
          </a>
        )) : projectCategories.map((category) => (
          <button key={category} type="button" aria-pressed={(params.get("category") || "All") === category} onClick={() => {
            const next = new URLSearchParams(params);
            category === "All" ? next.delete("category") : next.set("category", category);
            setParams(next, { replace: true });
            onNavigate();
          }}>
            {category}<sup>{category === "All" ? projects.length : projects.filter((project) => project.category === category).length}</sup>
          </button>
        ))}
      </div>
    </nav>
  );
}

function Navigation() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  useEffect(() => {
    const close = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  return (
    <>
    <header className="site-header">
      <Link className="wordmark" to="/" aria-label="SPECS home">
        specs<span className="brand-dot">.</span>
      </Link>
      <span className="brand-description">
        Structure. Space.
        <br />
        Possibility.
      </span>
      <nav aria-label="Main navigation" className={open ? "nav open" : "nav"}>
        <NavLink to="/expertise">Expertise</NavLink>
        <NavLink to="/people">People</NavLink>
        <NavLink to="/projects">Projects</NavLink>
        <NavLink to="/contact">
          Contact
          <ArrowUpRight size={16} />
        </NavLink>
      </nav>
      <button
        className="menu-toggle icon-button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
      >
        {open ? <X /> : <Menu />}
      </button>
    </header>
    <SectionNavigation pathname={pathname} onNavigate={() => setOpen(false)} />
    </>
  );
}

function Footer() {
  const isContact = useLocation().pathname === "/contact";
  return (
    <footer className={isContact ? "site-footer site-footer--compact" : "site-footer"}>
      {!isContact && (
      <div className="footer-main">
        <div>
          <h2>
            Good things begin
            <br />
            with a conversation.
          </h2>
          <ArrowLink to="/contact">Contact the studio</ArrowLink>
        </div>
        <Link
          to="/"
          className="wordmark footer-wordmark"
          aria-label="SPECS home"
        >
          specs.
        </Link>
      </div>
      )}
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} SPECS Studio</span>
        {isContact && <Link to="/" aria-label="SPECS home">specs.</Link>}
      </div>
    </footer>
  );
}

function PageManager() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    const project = projects.find((p) => pathname === `/projects/${p.slug}`);
    const article = articles.find((a) => pathname === `/journal/${a.slug}`);
    const service = services.find((s) => pathname === `/expertise/${s.slug}`);
    const title =
      project?.name ||
      article?.title ||
      service?.name ||
      ({
        "/": "Structural thinking. Human spaces.",
        "/expertise": "Our expertise",
        "/projects": "Our projects",
        "/people": "Our people",
        "/contact": "Let’s talk",
      }[pathname] ??
        "Page not found");
    document.title = `${title} — SPECS`;
    document.querySelector("main")?.focus({ preventScroll: true });
  }, [pathname]);
  return null;
}

function ProjectCard({ project, mosaic = false }) {
  if (mosaic) {
    return (
      <Link to={`/projects/${project.slug}`} className="project-card mosaic-tile" aria-label={`${project.name} — ${project.location} — ${project.scope}`}>
        <Photo name={project.image} alt={`${project.name}, ${project.category.toLowerCase()} project`} />
        <span className="mosaic-category">{project.category}</span>
        <span className="mosaic-open" aria-hidden="true"><ArrowUpRight size={24} /></span>
        <div className="mosaic-caption">
          <h2>{project.name}</h2>
          <dl className="mosaic-facts">
            <div><dt>Location</dt><dd>{project.location}</dd></div>
            <div><dt>Scope</dt><dd>{project.scope}</dd></div>
          </dl>
        </div>
      </Link>
    );
  }
  return (
    <Link to={`/projects/${project.slug}`} className="project-card">
      <div className="image-wrap">
        <Photo
          name={project.image}
          alt={`${project.name}, ${project.category.toLowerCase()} project`}
        />
        <span className="card-arrow">
          <ArrowUpRight size={23} />
        </span>
      </div>
      <div className="project-card-title">
        <h2>{project.name}</h2>
        <span>{project.year}</span>
      </div>
      <div className="project-card-meta">
        <span>{project.location}</span>
        <span>{project.scope}</span>
      </div>
    </Link>
  );
}

function CountUp({ value }) {
  const target = useRef(null);
  const [count, setCount] = useState(value);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches || !("IntersectionObserver" in window)) return;
    let frame;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      setCount(0);
      const tick = (now) => {
        const progress = Math.min((now - start) / 1600, 1);
        setCount(Math.round(value * (1 - Math.pow(1 - progress, 3))));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    observer.observe(target.current);
    const finish = () => {
      if (!preference.matches) return;
      observer.disconnect();
      cancelAnimationFrame(frame);
      setCount(value);
    };
    preference.addEventListener("change", finish);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      preference.removeEventListener("change", finish);
    };
  }, [value]);

  return <span ref={target} className="stat-number">
    <span className="stat-accessible-value">{value}+</span>
    <span aria-hidden="true">{count}<sup>+</sup></span>
  </span>;
}

const expertiseMetrics = [
  { value: 12, label: "Years of practice" },
  { value: 80, label: "Projects imagined & built" },
  { value: 16, label: "Cities connected" },
  { value: 4, label: "Service areas" },
];
const conciseServices = [
  "Clear, buildable structures. From first sketch to final detail.",
  "Strengthen what exists. Make room for what comes next.",
  "Architects, engineers, and builders. Thinking together.",
  "Practical site guidance that brings the drawings to life.",
];

function Expertise() {
  return (
    <section className="expertise-page page section">
      <div className="page-heading">
        <h1>
          Structural clarity.
          <br />
          <span>At every scale.</span>
        </h1>
        <div className="expertise-hero-note">
          <p>Engineering ideas.<br />Creating possibilities.</p>
          <ArrowLink to="/projects">Explore our work</ArrowLink>
        </div>
      </div>
      <ScrollReveal
        as="section"
        id="expertise-stats"
        className="expertise-stats"
        aria-labelledby="expertise-stats-title"
        items=".expertise-section-heading, .expertise-stat-card"
      >
        <div className="expertise-section-heading">
          <h2 id="expertise-stats-title">Stats<span>.</span></h2>
          <p>Small details. Lasting impact.</p>
        </div>
        <dl>
          {expertiseMetrics.map(({ value, label }) => (
            <div key={label} className="expertise-stat-card">
              <dt><CountUp value={value} /></dt>
              <dd>{label}</dd>
            </div>
          ))}
        </dl>
      </ScrollReveal>
      <ScrollReveal
        as="section"
        id="expertise-services"
        className="expertise-services"
        aria-labelledby="expertise-services-title"
        items=".expertise-section-heading, .service-preview"
      >
        <div className="expertise-section-heading">
          <h2 id="expertise-services-title">Services<span>.</span></h2>
          <p>From possibility to precision.</p>
        </div>
        <div className="service-gallery">
        {services.map((service, index) => (
          <Link className="service-preview" key={service.slug} to={`/expertise/${service.slug}`}>
            <div className="image-wrap">
              <Photo name={service.image} alt={service.imageAlt} />
            </div>
            <h3>{service.name}<ArrowUpRight size={23} aria-hidden="true" /></h3>
            <p>{conciseServices[index]}</p>
            <span className="editorial-read-link">Explore service <ArrowRight size={17} aria-hidden="true" /></span>
          </Link>
        ))}
        </div>
      </ScrollReveal>
      <ScrollReveal
        as="section"
        id="expertise-news"
        className="expertise-news"
        aria-labelledby="expertise-news-title"
        items=".expertise-section-heading, .editorial-story"
      >
        <div className="expertise-section-heading">
          <h2 id="expertise-news-title">News &amp; Articles<span>.</span></h2>
          <p>Ideas, conversations, and work in progress.</p>
        </div>
        <div className="editorial-grid">
          {articles.map((article, index) => (
            <Link className={`editorial-story ${index === 0 ? "editorial-feature" : ""}`} to={`/journal/${article.slug}`} key={article.slug}>
              <div className="image-wrap">
                <Photo name={article.image} alt={article.title} />
                <span className="card-arrow">
                  <ArrowUpRight size={21} />
                </span>
              </div>
              <div className="editorial-story-copy">
              <div className="editorial-meta">
                <span>{article.type}</span>
                <span>{article.date}</span>
              </div>
              <h3>{article.title}</h3>
              <p>{article.intro}</p>
              <span className="editorial-read-link">Read article <ArrowRight size={17} aria-hidden="true" /></span>
              </div>
            </Link>
          ))}
        </div>
      </ScrollReveal>
      <ScrollReveal
        as="section"
        id="expertise-clients"
        className="expertise-clients"
        aria-labelledby="expertise-clients-title"
        items=":scope > div:first-child, .expertise-client-list > span"
      >
        <div>
          <h2 id="expertise-clients-title">Clients<span>.</span></h2>
          <p>Good work starts with good partnerships.</p>
        </div>
        <div className="expertise-client-list" aria-label="Collaborators">
          <span className="partner-north">
            NORTH<span>STUDIO</span>
          </span>
          <span className="partner-form">
            form<span>collective</span>
          </span>
          <span className="partner-earth">earth &amp; line</span>
          <span className="partner-axis">
            AXIS<span>ARCHITECTS</span>
          </span>
          <span className="partner-field">
            fieldwork<span>STUDIO</span>
          </span>
        </div>
      </ScrollReveal>
    </section>
  );
}

function Projects() {
  const [params, setParams] = useSearchParams();
  const latestParams = useRef(params);
  useEffect(() => {
    latestParams.current = params;
  }, [params]);
  const category = params.get("category") || "All";
  const query = params.get("q") || "";
  const [view, setView] = useState("grid");
  const isMosaic = view === "grid";
  const filtered = projects.filter(
    (p) =>
      (category === "All" || p.category === category) &&
      `${p.name} ${p.location} ${p.scope}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const update = (key, value) => {
    const next = new URLSearchParams(latestParams.current);
    value && value !== "All" ? next.set(key, value) : next.delete(key);
    latestParams.current = next;
    setParams(next, { replace: true });
  };
  return (
    <ScrollReveal
      as="section"
      className="archive page section"
      items=".page-heading, .project-tools, .archive-search, .project-card, .empty-state"
    >
      <div className="page-heading">
        <h1>
          Ideas, made real<span>.</span>
        </h1>
        <p>
          Different scales. Shared conviction.
          <br />
          Explore the structures and spaces we help shape.
        </p>
      </div>
      <div className="project-tools">
        <span className="project-tools-label">{isMosaic ? "Explore the work · Select a project to discover more" : "View projects"}</span>
        <div className="view-toggle">
          <button
            className="icon-button"
            onClick={() => setView("grid")}
            aria-label="Grid view"
            aria-pressed={view === "grid"}
          >
            <Grid2X2 size={19} />
          </button>
          <button
            className="icon-button"
            onClick={() => setView("list")}
            aria-label="List view"
            aria-pressed={view === "list"}
          >
            <List size={21} />
          </button>
        </div>
      </div>
      <div className="archive-search">
        <span role="status">
          {filtered.length} {filtered.length === 1 ? "project" : "projects"}
        </span>
        <label>
          <Search size={17} />
          <input
            aria-label="Search projects"
            placeholder="Search name, place or scope"
            value={query}
            onChange={(e) => update("q", e.target.value)}
          />
        </label>
      </div>
      {filtered.length ? (
        <div
          className={`projects-grid ${isMosaic ? "projects-mosaic" : "projects-list"}`}
          data-category={category.toLowerCase()}
          data-count={filtered.length}
        >
          {filtered.map((project) => (
            <ProjectCard key={project.slug} project={project} mosaic={isMosaic} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>No projects found.</h2>
          <p>Try another name, location, or category.</p>
          <button className="solid-button" onClick={() => setParams({})}>
            Reset filters
            <ArrowRight size={18} />
          </button>
        </div>
      )}
    </ScrollReveal>
  );
}

function Drawing({ sketch = false }) {
  return (
    <svg
      className={`drawing ${sketch ? "sketch" : ""}`}
      viewBox="0 0 700 470"
      role="img"
      aria-label={
        sketch
          ? "Perspective sketch of a courtyard building"
          : "Courtyard building floor plan"
      }
    >
      <defs>
        <pattern
          id={sketch ? "sketch-grid" : "plan-grid"}
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M20 0H0V20"
            fill="none"
            stroke="currentColor"
            strokeOpacity=".075"
          />
        </pattern>
      </defs>
      <rect
        width="700"
        height="470"
        fill={`url(#${sketch ? "sketch-grid" : "plan-grid"})`}
      />
      {sketch ? (
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        >
          <path d="M105 290 340 170 598 254 371 390Z M105 290V176L340 63 598 145V254 M105 176 369 270 598 145 M369 270V390 M340 63V170 M153 193V266L260 213V157 M400 259V350L466 314V224 M500 207V293L558 267V175 M200 148 430 225 M267 115 496 190 M134 165 397 254" />
          <path d="M214 243 340 180 471 224 352 285Z M214 243V206L340 145 471 187V224 M214 206 352 249 471 187 M352 249V285" />
          <path
            strokeWidth=".7"
            d="m95 305 275 98 241-136 M91 177 7-6 M361 396v17 M605 253l11 3 M332 52l-6-12"
          />
          <text
            x="70"
            y="430"
            stroke="none"
            fill="currentColor"
            fontSize="11"
            letterSpacing="1"
          >
            CONCEPT STUDY / COURTYARD & LIGHT
          </text>
        </g>
      ) : (
        <g fill="none" stroke="currentColor">
          <path
            strokeWidth="5"
            d="M140 95H558V368H140Z M280 95V183 M280 243V368 M419 95V183 M419 243V368 M140 230H233 M463 230H558 M280 170H419V285H280Z"
          />
          <path
            strokeWidth="1"
            d="M150 105H548V358H150Z M290 180H409V275H290Z M155 120h91v62h-91z M163 129h30v17h-30z M204 129h32v17h-32z M164 152h72v25h-72z M460 120h68v45h-68z M472 126h20v30h-20z M502 126h20v30h-20z M160 278h77v45h-77z M173 287h49v27h-49z M466 279h60v55h-60z M470 310h52 M330 300h42v42h-42z"
          />
          <g strokeWidth=".8">
            <path d="M120 95H95M120 368H95M106 95V368M140 76V50M558 76V50M140 60H558" />
            <path d="m100 101 12-12m-12 285 12-12M134 66l12-12m406 12 12-12" />
            <circle cx="349" cy="227" r="25" />
            <path d="m333 223 22-18 15 28-24 15Z" />
          </g>
          <g
            fill="currentColor"
            stroke="none"
            fontSize="10"
            textAnchor="middle"
          >
            <text x="349" y="48">
              18 000
            </text>
            <text x="210" y="211">
              LIVING
            </text>
            <text x="490" y="203">
              BEDROOM
            </text>
            <text x="349" y="267">
              COURTYARD
            </text>
            <text x="204" y="343">
              DINING
            </text>
            <text x="492" y="348">
              STUDY
            </text>
            <text x="350" y="415" letterSpacing="2">
              GROUND FLOOR / CONCEPT STUDY
            </text>
          </g>
        </g>
      )}
    </svg>
  );
}

function Lightbox({ items, current, onClose, onChange }) {
  const dialog = useRef(null);
  const closeButton = useRef(null);
  const previousFocus = useRef(document.activeElement);
  useEffect(() => {
    const modal = dialog.current;
    modal.showModal();
    closeButton.current.focus();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      modal.close();
      document.body.style.overflow = overflow;
      previousFocus.current?.focus();
    };
  }, []);
  return (
    <dialog
      ref={dialog}
      className="lightbox"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") onChange((current + 1) % items.length);
        if (e.key === "ArrowLeft")
          onChange((current + items.length - 1) % items.length);
      }}
      aria-label="Project images"
    >
      <button
        ref={closeButton}
        className="icon-button lightbox-close"
        onClick={onClose}
        aria-label="Close image viewer"
      >
        <X />
      </button>
      <div className="lightbox-image">
        {items[current].type === "photo" ? (
          <Photo name={items[current].image} alt={items[current].label} eager />
        ) : (
          <Drawing sketch={items[current].type === "sketch"} />
        )}
      </div>
      <div className="lightbox-caption">
        <button
          className="icon-button"
          aria-label="Previous image"
          onClick={() => onChange((current + items.length - 1) % items.length)}
        >
          <ChevronLeft />
        </button>
        <span>
          {items[current].label} · {current + 1} / {items.length}
        </span>
        <button
          className="icon-button"
          aria-label="Next image"
          onClick={() => onChange((current + 1) % items.length)}
        >
          <ChevronRight />
        </button>
      </div>
    </dialog>
  );
}

function ProjectDetail() {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);
  const [tab, setTab] = useState("Photography");
  const [lightbox, setLightbox] = useState(null);
  useEffect(() => {
    setTab("Photography");
    setLightbox(null);
  }, [slug]);
  if (!project) return <NotFound />;
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  const gallery = [
    {
      type: "photo",
      image: project.image,
      label: `${project.name} — exterior / interior`,
    },
    {
      type: "photo",
      image: project.secondary,
      label: "Material and spatial study",
    },
    { type: "plan", label: "Ground floor plan" },
    { type: "sketch", label: "Concept sketch" },
  ];
  const visible =
    tab === "Photography" ? [0, 1] : tab === "Drawings" ? [2] : [3];
  return (
    <article className="project-detail page">
      <div className="detail-heading section">
        <Link className="back-link" to="/projects">
          <ArrowLeft size={17} />
          All projects
        </Link>
        <div className="page-heading">
          <h1>
            {project.name}
            <span>.</span>
          </h1>
          <p>
            {project.category}
            <br />
            {project.location} · {project.year}
          </p>
        </div>
      </div>
      <div className="detail-hero">
        <Photo name={project.image} alt={project.name} eager />
        <button
          className="hero-open"
          onClick={() => setLightbox(0)}
          aria-label="Enlarge project photo"
        >
          <Maximize2 size={24} />
        </button>
      </div>
      <ScrollReveal
        as="section"
        className="project-story section"
        items=":scope > div, .project-facts > div"
      >
        <div>
          <h2>Design approach.</h2>
          <p>{project.description}</p>
          <p>{project.approach}</p>
        </div>
        <dl className="project-facts">
          {Object.entries({
            Project: project.name,
            Location: project.location,
            Scope: project.scope,
            Year: project.year,
            Status: project.status,
            "Design partner": project.partner,
            Area: project.area,
            Awards: "Not listed",
          }).map(([key, value]) => (
            <div key={key}>
              <dt>{key}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </ScrollReveal>
      <ScrollReveal
        as="section"
        className="project-gallery section"
        items=".section-top, .detail-gallery > figure"
      >
        <div className="section-top">
          <h2>A closer look.</h2>
          <div className="filters" aria-label="Project media">
            {["Photography", "Drawings", "Sketches"].map((name) => (
              <button
                key={name}
                className={tab === name ? "active" : ""}
                aria-pressed={tab === name}
                onClick={() => setTab(name)}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
        <div
          className={`detail-gallery ${tab !== "Photography" ? "single" : ""}`}
        >
          {visible.map((i) => (
            <figure key={i}>
              <button
                className="gallery-open"
                onClick={() => setLightbox(i)}
                aria-label={`Enlarge ${gallery[i].label}`}
              >
                {gallery[i].type === "photo" ? (
                  <Photo name={gallery[i].image} alt={gallery[i].label} />
                ) : (
                  <Drawing sketch={gallery[i].type === "sketch"} />
                )}
                <span className="card-arrow">
                  <Maximize2 size={21} />
                </span>
              </button>
              <figcaption>{gallery[i].label}</figcaption>
            </figure>
          ))}
        </div>
      </ScrollReveal>
      <Link className="next-project section" to={`/projects/${next.slug}`}>
        <div>
          <span>Next project</span>
          <h2>{next.name}</h2>
        </div>
        <ArrowUpRight size={44} />
      </Link>
      {lightbox !== null && (
        <Lightbox
          items={gallery}
          current={lightbox}
          onChange={setLightbox}
          onClose={() => setLightbox(null)}
        />
      )}
    </article>
  );
}

function People() {
  return (
    <div className="people-page page">
      <ScrollReveal
        as="section"
        className="section"
        items=".page-heading, .people-intro, .team-title, .person"
      >
        <div className="page-heading">
          <h1>
            People make
            <br />
            the possibilities<span>.</span>
          </h1>
          <p>
            Engineers by training.
            <br />
            Collaborators by nature.
          </p>
        </div>
        <div className="people-intro" id="people-profile">
          <Photo name="people-studio" alt="A studio meeting room with large windows" eager />
          <div>
            <h2>The practice.</h2>
            <p>
              We work with architects and builders on structural design,
              retrofit, and construction support—from the first sketch to site.
            </p>
          </div>
        </div>
        <div className="section-top team-title" id="people-team">
          <h2>Meet the studio.</h2>
        </div>
        <div className="team-grid">
          {people.map((person) => (
            <article className="person" key={person.name}>
              <Photo name={person.image} alt={person.name} />
              <h3>{person.name}</h3>
              <span>{person.role}</span>
              <p>{person.bio}</p>
            </article>
          ))}
        </div>
      </ScrollReveal>
      <ScrollReveal
        as="section"
        className="people-values section"
        id="people-philosophy"
        items=":scope > h2, :scope > div > article"
      >
        <h2>
          How we work
          <br />
          is what we value.
        </h2>
        <div>
          <article>
            <h3>Curiosity before certainty.</h3>
            <p>
              We ask, explore, and test. Every project is an opportunity to
              discover a better way to build.
            </p>
          </article>
          <article>
            <h3>Clarity in the complex.</h3>
            <p>
              Our role is to make structural thinking useful, understandable,
              and closely connected to the architecture.
            </p>
          </article>
          <article>
            <h3>Better, together.</h3>
            <p>
              We make room for every discipline and keep the conversation open,
              from concept to construction.
            </p>
          </article>
        </div>
      </ScrollReveal>
    </div>
  );
}

const socialIcons = { Instagram, LinkedIn: Linkedin, Facebook, YouTube: Youtube, X: Twitter };

function Contact() {
  const [params] = useSearchParams();
  const [prepared, setPrepared] = useState(null);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const submit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get("name").trim();
    const email = data.get("email").trim();
    const message = data.get("message").trim();
    if (!name || !message) {
      const input = event.currentTarget.elements.namedItem(
        !name ? "name" : "message",
      );
      input.setCustomValidity("Please enter more than spaces.");
      input.reportValidity();
      return;
    }
    setPrepared({
      subject: `${data.get("service") || "Project enquiry"} — ${name}`,
      body: `Hello SPECS,\n\n${message}\n\nName: ${name}\nEmail: ${email}\nLocation: ${data.get("location") || "Not specified"}\nInterest: ${data.get("service") || "General enquiry"}`,
    });
  };
  useEffect(() => {
    if (prepared) document.getElementById("enquiry-ready")?.focus();
  }, [prepared]);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(prepared.body);
      setCopied(true);
      setCopyError(false);
    } catch {
      setCopyError(true);
    }
  };
  return (
    <ScrollReveal
      as="section"
      className="contact-page page section"
      items=".page-heading, .contact-info, .contact-form, .enquiry-ready"
    >
      <div className="page-heading">
        <h1>
          Let’s make
          <br />
          something matter<span>.</span>
        </h1>
      </div>
      <div className="contact-layout">
        <div className="contact-info">
          <h2>Project enquiries.</h2>
          <p>
            Share your project’s location, scope, and timeline.
          </p>
          <section className="contact-socials" aria-labelledby="contact-socials-title">
            <h3 id="contact-socials-title">Follow the studio</h3>
            <div className="contact-social-links">
              {studioContact.socials.map(({ name, url }) => {
                const Icon = socialIcons[name];
                return url ? (
                  <a key={name} href={url} target="_blank" rel="noopener noreferrer" aria-label={`${name} (opens in a new tab)`}>
                    <Icon size={19} aria-hidden="true" />
                  </a>
                ) : (
                  <span key={name} className="social-coming-soon" role="img" aria-label={`${name} — coming soon`} title={`${name} — coming soon`}>
                    <Icon size={19} aria-hidden="true" />
                  </span>
                );
              })}
            </div>
            {!studioContact.socials.some(({ url }) => url) && <p>Social profiles coming soon.</p>}
          </section>
          <dl className="contact-details">
            <div>
              <dt>Email</dt>
              <dd><a href={`mailto:${studioContact.email}`}>{studioContact.email}<ArrowUpRight size={17} aria-hidden="true" /></a></dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>{studioContact.phone ? <a href={`tel:${studioContact.phone.replace(/[^+\d]/g, "")}`}>{studioContact.phone}</a> : "Phone details coming soon."}</dd>
            </div>
            <div>
              <dt>Studio address</dt>
              <dd><address>{studioContact.address || "India · Full address coming soon."}</address></dd>
            </div>
          </dl>
          <section className="contact-location" aria-labelledby="contact-location-title">
            <MapPin size={25} strokeWidth={1.5} aria-hidden="true" />
            <div>
              <h3 id="contact-location-title">Find us on Google Maps</h3>
              {studioContact.googleMapsUrl ? (
                <a href={studioContact.googleMapsUrl} target="_blank" rel="noopener noreferrer" aria-label="Get directions on Google Maps (opens in a new tab)">Get directions <ArrowUpRight size={16} aria-hidden="true" /></a>
              ) : <p>Studio location coming soon.</p>}
            </div>
          </section>
        </div>
        {prepared ? (
          <div className="enquiry-ready" id="enquiry-ready" tabIndex={-1}>
            <span className="success-icon">
              <Check size={27} />
            </span>
            <h2>Your enquiry is ready.</h2>
            <p>
              Copy your message, or open it in your email app. Nothing has been
              sent. Change the recipient to the studio’s email before sending.
            </p>
            <textarea
              aria-label="Prepared enquiry"
              readOnly
              value={prepared.body}
              rows={9}
            />
            <div className="enquiry-actions">
              <button className="solid-button" onClick={copy}>
                {copied ? "Copied" : "Copy message"}
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
              <a
                className="outline-button"
                href={`mailto:${studioContact.email}?subject=${encodeURIComponent(prepared.subject)}&body=${encodeURIComponent(prepared.body)}`}
              >
                Open email app
                <Mail size={18} />
              </a>
            </div>
            <span role="status">
              {copied
                ? "Your enquiry has been copied."
                : copyError
                  ? "Copy is unavailable. Select and copy the message above."
                  : ""}
            </span>
            <button
              className="text-button"
              onClick={() => {
                setPrepared(null);
                setCopied(false);
              }}
            >
              Write another enquiry
              <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="contact-form">
            <div className="form-row">
              <label>
                Your name <span>*</span>
                <input
                  name="name"
                  autoComplete="name"
                  placeholder="Alex Morgan"
                  required
                  maxLength={100}
                  onInput={(e) => e.target.setCustomValidity("")}
                />
              </label>
              <label>
                Email address <span>*</span>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="alex@yourstudio.com"
                  required
                  maxLength={200}
                />
              </label>
            </div>
            <div className="form-row">
              <label>
                I’m interested in
                <select
                  name="service"
                  defaultValue={params.get("service") || ""}
                >
                  <option value="">Select a service</option>
                  {services.map((s) => (
                    <option key={s.name}>{s.name}</option>
                  ))}
                  <option>General enquiry</option>
                  <option>Careers & collaboration</option>
                </select>
              </label>
              <label>
                Project location
                <input
                  name="location"
                  placeholder="City, region"
                  maxLength={200}
                />
              </label>
            </div>
            <label className="message-field">
              <span className="field-label">A little about your project <span>*</span></span>
              <textarea
                name="message"
                rows={6}
                placeholder="What would you like help with?"
                required
                minLength={10}
                maxLength={5000}
                onInput={(e) => e.target.setCustomValidity("")}
              />
            </label>
            <p className="form-note">
              Prepare an email to review and send. Your information is not
              stored or submitted here.
            </p>
            <button className="solid-button" type="submit">
              Prepare enquiry
              <ArrowUpRight size={20} />
            </button>
          </form>
        )}
      </div>
    </ScrollReveal>
  );
}

function ServiceDetail() {
  const { slug } = useParams();
  const service = services.find((item) => item.slug === slug);
  if (!service) return <NotFound />;
  return (
    <ScrollReveal
      as="article"
      className="service-detail page section"
      items=":scope > .back-link, :scope > .page-heading, :scope > .service-detail-hero, .service-detail-content > section, :scope > .service-related"
    >
      <Link className="back-link" to="/expertise"><ArrowLeft size={17} aria-hidden="true" />Back to expertise</Link>
      <div className="page-heading">
        <h1>{service.name}<span>.</span></h1>
        <p>{service.detail}</p>
      </div>
      <Photo className="service-detail-hero" name={service.image} alt={service.imageAlt} eager />
      <div className="service-detail-content">
        <section>
          <h2>Our approach.</h2>
          <p>{service.approach}</p>
          <h2>What to expect.</h2>
          <p>{service.outcome}</p>
        </section>
        <section className="service-scope">
          <h2>How we can help.</h2>
          <ul>{service.includes.map((item) => <li key={item}>{item}</li>)}</ul>
          <ArrowLink to={`/contact?service=${encodeURIComponent(service.name)}`}>Discuss this service</ArrowLink>
        </section>
      </div>
      <nav className="service-related" aria-label="Other services">
        <h2>Explore other services.</h2>
        {services.filter((item) => item.slug !== slug).map((item) => <ArrowLink key={item.slug} to={`/expertise/${item.slug}`}>{item.name}</ArrowLink>)}
      </nav>
    </ScrollReveal>
  );
}

function Article() {
  const { slug } = useParams();
  const article = articles.find((a) => a.slug === slug);
  if (!article) return <NotFound />;
  return (
    <ScrollReveal
      as="article"
      className="article-page page section"
      items=":scope > .back-link, :scope > .page-heading, :scope > .article-hero, .article-body > *"
    >
      <Link className="back-link" to="/expertise">
        <ArrowLeft size={17} />
        Back to expertise
      </Link>
      <div className="page-heading">
        <h1>
          {article.title}
          <span>.</span>
        </h1>
        <p>
          {article.type}
          <br />
          {article.date}
        </p>
      </div>
      <Photo
        className="article-hero"
        name={article.image}
        alt={article.title}
        eager
      />
      <div className="article-body">
        <h2>{article.intro}</h2>
        {article.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
        <ArrowLink to={`/projects/${article.project}`}>
          Explore the project
        </ArrowLink>
      </div>
    </ScrollReveal>
  );
}

function NotFound() {
  return (
    <section className="not-found page section">
      <span>404</span>
      <h1>A little off plan.</h1>
      <p>We couldn’t find that page. Let’s get you back to the work.</p>
      <ArrowLink to="/projects">Explore our projects</ArrowLink>
    </section>
  );
}

export default function App() {
  const isLanding = useLocation().pathname === "/";
  return (
    <div className={isLanding ? "landing-shell" : "site-shell"}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navigation />
      <PageManager />
      <main id="main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/expertise" element={<Expertise />} />
          <Route path="/expertise/:slug" element={<ServiceDetail />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/people" element={<People />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/journal/:slug" element={<Article />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isLanding && <Footer />}
    </div>
  );
}

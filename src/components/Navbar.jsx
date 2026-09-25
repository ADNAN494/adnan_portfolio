import React, { useEffect, useState } from "react";
import { styles } from "../styles";
import { navLinks } from "../constants";

// Height of the band across the middle of the viewport that decides which
// section is "current". Expressed as top/bottom insets, so -45%/-50% leaves a
// 5%-tall strip: whatever crosses it owns the highlight. A band rather than a
// single line means the observer fires on entry and exit, and a strip rather
// than the whole viewport means two sections are never both current.
const ACTIVE_BAND = "-45% 0px -50% 0px";

const Navbar = () => {
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setScrolled(scrollTop > 100);
      // Back at the hero, which has no nav entry of its own  nothing should be
      // lit. Also what the logo click does.
      if (scrollTop <= 100) setActive("");
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keep the highlight tied to where the visitor actually is, not only to what
  // they last clicked. The anchors are the .hash-span elements SectionWrapper
  // injects; the section around each one is what we observe, since the span
  // itself is a 100px offset shim rather than the content.
  //
  // navLinks is not in DOM order (Skills sits above Experience in the nav but
  // below it on the page), so this reads the real elements and compares their
  // positions instead of trusting the array.
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const targets = navLinks
      .map(({ id, title }) => {
        const anchor = document.getElementById(id);
        if (!anchor) return null;
        return { title, el: anchor.closest("section") ?? anchor };
      })
      .filter(Boolean);

    if (!targets.length) return;

    const titleFor = new Map(targets.map(({ title, el }) => [el, title]));
    const inBand = new Set();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) inBand.add(entry.target);
          else inBand.delete(entry.target);
        }

        // Normally exactly one section crosses the band. When a short section
        // lets two in at once, the higher one wins  that's the one the reader
        // has reached.
        let top = null;
        for (const el of inBand) {
          if (
            !top ||
            el.getBoundingClientRect().top < top.getBoundingClientRect().top
          ) {
            top = el;
          }
        }

        // Nothing in the band (mid-gap between sections) leaves the previous
        // highlight alone rather than blinking it off.
        if (top) setActive(titleFor.get(top) ?? "");
      },
      { rootMargin: ACTIVE_BAND },
    );

    targets.forEach(({ el }) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      className={`${
        styles.paddingX
      } w-full flex items-center py-4 fixed top-0 z-20 transition-colors duration-300 ${
        scrolled || toggle
          ? "bg-canvas/90 backdrop-blur-md border-b border-line"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="w-full flex justify-between items-center max-w-7xl mx-auto">
        <a
          href="#"
          className="flex items-center gap-2"
          onClick={(e) => {
            e.preventDefault();
            setActive("");
            setToggle(false);
            window.scrollTo(0, 0);
          }}
        >
          <p className="font-mono text-[18px] font-semibold text-ink cursor-pointer">
            <span className="text-pine">~/</span>adnan
            <span className="text-ember">.dev</span>
          </p>
        </a>

        {/* md, not sm: Plus Jakarta Sans sets wider than Inter did, and five
            links plus the button no longer fit a 640px bar without crowding
            the logo. Tablets in portrait get the drawer instead. */}
        <div className="hidden md:flex flex-row items-center lg:gap-10 gap-7">
          <ul className="list-none flex flex-row lg:gap-8 gap-6">
            {navLinks.map((nav) => (
              <li key={nav.id} onClick={() => setActive(nav.title)}>
                {/* The underline, not only the colour, marks the current
                    section  colour alone isn't enough to carry state. */}
                <a
                  href={`#${nav.id}`}
                  aria-current={active === nav.title ? "true" : undefined}
                  className={`relative font-heading text-[15px] font-semibold transition-colors after:absolute after:left-0 after:-bottom-1.5 after:h-[2px] after:rounded-full after:bg-ember after:transition-all after:duration-300 ${
                    active === nav.title
                      ? "text-ink after:w-full"
                      : "text-ink-muted hover:text-ink after:w-0"
                  }`}
                >
                  {nav.title}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="https://api.whatsapp.com/send?phone=923408752827"
            target="_blank"
            rel="noopener noreferrer"
            className="font-heading text-[14px] font-bold bg-ink text-canvas px-5 py-2.5 rounded-full hover:bg-ember transition-colors"
          >
            Hire me
          </a>
        </div>

        <div className="md:hidden flex flex-1 justify-end items-center">
          {/* A real button with inline icons: the old <img> SVGs were filled
              #FFF, invisible on the light theme, and an <img> with onClick
              was unreachable by keyboard. */}
          <button
            type="button"
            aria-label={toggle ? "Close menu" : "Open menu"}
            aria-expanded={toggle}
            aria-controls="mobile-menu"
            onClick={() => setToggle(!toggle)}
            className="w-11 h-11 -mr-2 flex items-center justify-center rounded-full text-ink hover:bg-surface-muted transition-colors"
          >
            {toggle ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M4 4l12 12M16 4L4 16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M3 6h16M3 11h16M9 16h10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>

          <div
            id="mobile-menu"
            className={`${
              !toggle ? "hidden" : "flex"
            } p-2 bg-surface absolute top-[72px] right-0 mx-4 min-w-[220px] z-10 rounded-2xl border border-line shadow-lift`}
          >
            <ul className="list-none flex flex-1 flex-col">
              {navLinks.map((nav) => (
                <li
                  key={nav.id}
                  onClick={() => {
                    setToggle(!toggle);
                    setActive(nav.title);
                  }}
                >
                  <a
                    href={`#${nav.id}`}
                    aria-current={active === nav.title ? "true" : undefined}
                    className={`flex items-center justify-between gap-6 rounded-xl px-4 py-3 font-heading font-semibold text-[16px] transition-colors ${
                      active === nav.title
                        ? "bg-ember-soft text-ember"
                        : "text-ink hover:bg-surface-muted"
                    }`}
                  >
                    {nav.title}
                    {active === nav.title && (
                      <span
                        aria-hidden="true"
                        className="w-1.5 h-1.5 rounded-full bg-ember"
                      />
                    )}
                  </a>
                </li>
              ))}
              <li className="mt-1 pt-2 border-t border-line">
                <a
                  href="https://api.whatsapp.com/send?phone=923408752827"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex justify-center rounded-xl px-4 py-3 bg-ink text-canvas font-heading font-bold text-[15px] hover:bg-ember transition-colors"
                >
                  Hire me
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

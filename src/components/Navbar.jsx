import React, { useEffect, useState } from "react";
import { styles } from "../styles";
import { navLinks } from "../constants";
import { menu, close } from "../assets";

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
      // Back at the hero, which has no nav entry of its own — nothing should be
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
        // lets two in at once, the higher one wins — that's the one the reader
        // has reached.
        let top = null;
        for (const el of inBand) {
          if (!top || el.getBoundingClientRect().top < top.getBoundingClientRect().top) {
            top = el;
          }
        }

        // Nothing in the band (mid-gap between sections) leaves the previous
        // highlight alone rather than blinking it off.
        if (top) setActive(titleFor.get(top) ?? "");
      },
      { rootMargin: ACTIVE_BAND }
    );

    targets.forEach(({ el }) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      className={`${
        styles.paddingX
      } w-full flex items-center py-5 fixed top-0 z-20 ${
        scrolled ? "bg-primary/90 backdrop-blur border-b border-white/5" : "bg-transparent"
      }`}
    >
      <div className='w-full flex justify-between items-center max-w-7xl mx-auto'>
        <a
          href='#'
          className='flex items-center gap-2'
          onClick={(e) => {
            e.preventDefault();
            setActive("");
            window.scrollTo(0, 0);
          }}
        >
          <p className='font-mono text-[18px] font-semibold text-white cursor-pointer'>
            <span className='text-mint'>~/</span>adnan<span className='text-peach'>.dev</span>
          </p>
        </a>

        <div className='hidden sm:flex flex-row items-center gap-10'>
          <ul className='list-none flex flex-row gap-8'>
            {navLinks.map((nav) => (
              <li
                key={nav.id}
                className={`${
                  active === nav.title ? "text-white" : "text-secondary"
                } hover:text-white text-[16px] font-medium cursor-pointer transition-colors`}
                onClick={() => setActive(nav.title)}
              >
                <a
                  href={`#${nav.id}`}
                  aria-current={active === nav.title ? "true" : undefined}
                >
                  {nav.title}
                </a>
              </li>
            ))}
          </ul>
          <a
            href='https://api.whatsapp.com/send?phone=923408752827'
            target='_blank'
            rel='noopener noreferrer'
            className='font-mono text-[14px] border border-peach text-peach px-5 py-2 rounded-full hover:bg-peach hover:text-primary transition-colors'
          >
            Hire me
          </a>
        </div>

        <div className='sm:hidden flex flex-1 justify-end items-center'>
          <img
            src={toggle ? close : menu}
            alt='menu'
            className='w-[28px] h-[28px] object-contain'
            onClick={() => setToggle(!toggle)}
          />

          <div
            className={`${
              !toggle ? "hidden" : "flex"
            } p-6 black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[140px] z-10 rounded-xl border border-white/10`}
          >
            <ul className='list-none flex justify-end items-start flex-1 flex-col gap-4'>
              {navLinks.map((nav) => (
                <li
                  key={nav.id}
                  className={`font-mono font-medium cursor-pointer text-[16px] ${
                    active === nav.title ? "text-peach" : "text-secondary"
                  }`}
                  onClick={() => {
                    setToggle(!toggle);
                    setActive(nav.title);
                  }}
                >
                  <a
                    href={`#${nav.id}`}
                    aria-current={active === nav.title ? "true" : undefined}
                  >
                    {nav.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

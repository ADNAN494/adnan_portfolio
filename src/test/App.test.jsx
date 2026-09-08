import { describe, expect, it } from "vitest";
import { act, render, screen } from "@testing-library/react";

import App from "../App";
import { MockIntersectionObserver } from "./mocks";

// The smoke test the codebase never had. Its job is to catch the class of crash
// that took the whole page down twice already: anything thrown out of the
// canvas tree used to unmount <App> rather than degrade. Here WebGL is
// unavailable (see test/setup.js), which is the same code path as a browser
// Chrome has blocked — the page must still render every section.
describe("App", () => {
  it("renders the whole page without WebGL", () => {
    const { container } = render(<App />);

    expect(container.textContent).toContain("Adnan");
    expect(container.textContent).toContain("Yousaf.");
    // ROLES[0], shown statically because matchMedia is stubbed to no
    // reduced-motion preference and the typewriter starts on the first word.
    expect(container.textContent).toContain("Full Stack Developer");
  });

  it("renders every nav link and its target section", () => {
    render(<App />);

    for (const title of ["About", "Skills", "Experience", "Projects", "Contact"]) {
      expect(screen.getAllByText(title).length).toBeGreaterThan(0);
    }

    for (const id of ["about", "skills", "work", "project", "contact"]) {
      expect(document.getElementById(id)).not.toBeNull();
    }
  });

  it("shows the client section rather than testimonials", () => {
    const { container } = render(<App />);

    expect(container.textContent).toContain("Who I build for");
    expect(container.textContent).toContain("WOAH");
    // The invented names and stock photos are gone for good.
    expect(container.textContent).not.toContain("Sara Lee");
    expect(container.querySelector('img[src*="randomuser.me"]')).toBeNull();
  });

  it("survives every section scrolling into view", () => {
    render(<App />);

    // Fires LazyShow's gate, the canvas visibility observers, the Navbar's
    // active-link band and framer-motion's whileInView all at once. Nothing
    // here may throw, even though no canvas can be created.
    expect(() =>
      act(() => MockIntersectionObserver.triggerAll(true))
    ).not.toThrow();
    expect(() =>
      act(() => MockIntersectionObserver.triggerAll(false))
    ).not.toThrow();
  });
});

import { afterEach, describe, expect, it } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";

import ThemeToggle from "../components/ThemeToggle";
import { setTheme } from "../utils/theme";

const scrollTo = (y) =>
  act(() => {
    window.scrollY = y;
    window.dispatchEvent(new Event("scroll"));
  });

describe("ThemeToggle", () => {
  afterEach(() => {
    setTheme("light");
    localStorage.clear();
    window.scrollY = 0;
  });

  it("stays hidden on the hero and appears once the page scrolls", async () => {
    render(<ThemeToggle />);
    expect(screen.queryByRole("switch")).toBeNull();

    scrollTo(400);
    expect(await screen.findByRole("switch")).toBeInTheDocument();
  });

  // jsdom has no View Transitions API, so this also covers the fallback path.
  it("switches to the dark theme and back, and remembers the choice", async () => {
    render(<ThemeToggle />);
    scrollTo(400);
    const toggle = await screen.findByRole("switch", { name: "Dark theme" });

    expect(toggle).toHaveAttribute("aria-checked", "false");
    expect(document.documentElement.dataset.theme).toBeUndefined();

    fireEvent.click(toggle);
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(localStorage.getItem("theme")).toBe("dark");
    expect(toggle).toHaveAttribute("aria-checked", "true");

    fireEvent.click(toggle);
    expect(document.documentElement.dataset.theme).toBeUndefined();
    expect(localStorage.getItem("theme")).toBe("light");
    expect(toggle).toHaveAttribute("aria-checked", "false");
  });

  // The inline script in index.html sets the attribute before React loads; the
  // switch has to read that rather than assume light.
  it("reflects a theme that was already applied before it mounted", async () => {
    document.documentElement.dataset.theme = "dark";
    render(<ThemeToggle />);
    scrollTo(400);

    expect(await screen.findByRole("switch")).toHaveAttribute("aria-checked", "true");
  });
});

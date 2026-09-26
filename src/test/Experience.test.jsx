import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";

import Experience from "../components/Experience";
import { experiences } from "../constants";

// Hidden panels carry aria-hidden, so role queries only ever see the one the
// visitor can see  exactly what a screen reader gets.
const activePanel = () => screen.getByRole("tabpanel");

// framer-motion measures a `height: "auto"` animation (the "Show all" reveal)
// and restores the scroll position with window.scrollTo, which jsdom lacks.
beforeEach(() => {
  window.scrollTo = vi.fn();
});

describe("Experience role switcher", () => {
  it("has a tab per role, with the current role selected first", () => {
    render(<Experience />);
    const tabs = screen.getAllByRole("tab");

    expect(tabs).toHaveLength(experiences.length);
    experiences.forEach((role, index) => {
      expect(tabs[index]).toHaveAccessibleName(
        expect.stringContaining(role.company_name)
      );
    });
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    expect(tabs[0]).toHaveAccessibleName(expect.stringContaining("2025 – Now"));
    expect(activePanel()).toHaveTextContent(experiences[0].title);
  });

  it("shows four highlights until the visitor asks for the rest", () => {
    render(<Experience />);
    const [role] = experiences;
    const panel = activePanel();

    expect(within(panel).getAllByRole("listitem")).toHaveLength(4);
    expect(panel).not.toHaveTextContent(role.points[4]);

    const more = within(panel).getByRole("button", {
      name: `Show all ${role.points.length} highlights`,
    });
    expect(more).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(more);

    expect(more).toHaveAttribute("aria-expanded", "true");
    expect(more).toHaveTextContent("Show fewer");
    expect(within(panel).getAllByRole("listitem")).toHaveLength(
      role.points.length
    );
  });

  it("switches roles on click and collapses what was expanded", () => {
    render(<Experience />);
    fireEvent.click(
      within(activePanel()).getByRole("button", { name: /Show all/ })
    );

    const second = screen.getAllByRole("tab")[1];
    fireEvent.click(second);

    expect(second).toHaveAttribute("aria-selected", "true");
    expect(screen.getAllByRole("tab")[0]).toHaveAttribute(
      "aria-selected",
      "false"
    );
    const panel = activePanel();
    expect(panel).toHaveAttribute("aria-labelledby", second.id);
    expect(panel).toHaveTextContent(experiences[1].title);
    expect(
      within(panel).getByRole("button", { name: /Show all/ })
    ).toHaveAttribute("aria-expanded", "false");
  });

  it("moves between roles with the arrow keys, Home and End", () => {
    render(<Experience />);
    const tabs = screen.getAllByRole("tab");
    const last = tabs.length - 1;
    tabs[0].focus();

    fireEvent.keyDown(tabs[0], { key: "ArrowDown" });
    expect(tabs[1]).toHaveAttribute("aria-selected", "true");
    expect(tabs[1]).toHaveFocus();

    fireEvent.keyDown(tabs[1], { key: "End" });
    expect(tabs[last]).toHaveAttribute("aria-selected", "true");

    // Wraps round from the last role to the first.
    fireEvent.keyDown(tabs[last], { key: "ArrowRight" });
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    expect(tabs[0]).toHaveFocus();

    // Only the selected tab is in the page's Tab order.
    expect(tabs.map((tab) => tab.tabIndex)).toEqual(
      tabs.map((_, i) => (i === 0 ? 0 : -1))
    );
  });

  it("links every company in a new tab", () => {
    render(<Experience />);
    const link = within(activePanel()).getByRole("link", {
      name: new RegExp(experiences[0].company_name),
    });
    expect(link).toHaveAttribute("href", experiences[0].link);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });
});

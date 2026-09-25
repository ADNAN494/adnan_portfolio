import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";

import SocialRail from "../components/SocialRail";
import SocialIcons from "../components/SocialIcons";
import { socials } from "../constants";

describe("social links", () => {
  it("puts every social link on the left rail, opening in a new tab", () => {
    render(<SocialRail />);
    const rail = screen.getByRole("navigation", { name: "Social links" });

    for (const social of socials) {
      const link = within(rail).getByRole("link", { name: social.name });
      expect(link).toHaveAttribute("href", social.href);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
    }
  });

  // Every glyph id in the data must have artwork, or the rail shows an empty
  // 40px box with a working link and nothing to click on.
  it("has a glyph for every entry", () => {
    const { container } = render(<SocialIcons />);
    const paths = [...container.querySelectorAll("a svg")].map(
      (svg) => svg.querySelectorAll("path").length
    );
    expect(paths).toHaveLength(socials.length);
    paths.forEach((count) => expect(count).toBeGreaterThan(0));
  });
});

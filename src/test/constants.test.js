import { describe, expect, it } from "vitest";

import { clients, experiences, projects, stats } from "../constants";

// ARCHITECTURE.md §6: "Every number on the page must be checkable." The stats
// row sits directly above a project grid a visitor can count, so a mismatch is
// visible to anyone who bothers — which is exactly the sort of thing that gets
// noticed in an interview.
describe("content invariants", () => {
  it("keeps the Projects shipped stat equal to the number of projects", () => {
    const shipped = stats.find((stat) => stat.label === "Projects shipped");

    expect(shipped).toBeDefined();
    expect(Number(shipped.value)).toBe(projects.length);
  });

  it("gives every project a live link and an image", () => {
    for (const project of projects) {
      expect(project.source_code_link, project.name).toMatch(/^https?:\/\//);
      expect(project.image, project.name).toBeTruthy();
    }
  });

  it("carries no stock-photo or invented-name testimonials", () => {
    const serialised = JSON.stringify(clients);

    expect(serialised).not.toContain("randomuser.me");
    for (const invented of ["Sara Lee", "Chris Brown", "Lisa Wang"]) {
      expect(serialised).not.toContain(invented);
    }
  });

  it("points every client card at a live platform", () => {
    for (const client of clients) {
      expect(client.link, client.org).toMatch(/^https:\/\//);
      expect(client.work.length, client.org).toBeGreaterThan(40);
    }
  });

  it("spells the recurring tech tags correctly", () => {
    // "boostrap" shipped on eight project cards before anyone noticed.
    const tags = projects.flatMap((project) =>
      project.tags.map((tag) => tag.name)
    );

    expect(tags).not.toContain("boostrap");
    expect(tags).toContain("bootstrap");
  });

  it("keeps experience entries complete", () => {
    for (const role of experiences) {
      expect(role.title, role.company_name).toBeTruthy();
      expect(role.date, role.company_name).toBeTruthy();
      expect(role.points.length, role.company_name).toBeGreaterThan(0);
    }
  });
});

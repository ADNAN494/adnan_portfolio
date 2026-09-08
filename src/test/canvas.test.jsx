import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import EarthCanvas from "../components/canvas/Earth";
import StarsCanvas from "../components/canvas/Stars";

// setup.js makes getContext("webgl") return null for every test, so these render
// the "no WebGL" branch. That is the branch a blocked page ends up on too — the
// one that used to throw out of <Canvas> and unmount the entire app.
describe("canvases without WebGL", () => {
  it("degrades the globe to its fallback disc instead of throwing", () => {
    expect(() => render(<EarthCanvas />)).not.toThrow();

    expect(
      screen.getByText("This browser can't render 3D graphics.")
    ).toBeInTheDocument();
  });

  it("hides the retry link when retrying cannot help", () => {
    render(<EarthCanvas />);

    // "unsupported" is the one reason where a retry is pointless: no amount of
    // asking will give this browser a context.
    expect(screen.queryByRole("button", { name: /try again/i })).toBeNull();
  });

  it("renders the starfield container with no canvas and no crash", () => {
    const { container } = render(<StarsCanvas />);

    expect(container.querySelector("canvas")).toBeNull();
    expect(container.firstChild).toBeInTheDocument();
  });
});

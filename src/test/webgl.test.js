import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Regression guard for "Web page caused context loss and was blocked".
//
// Chrome's block is per host and expires after two minutes (see utils/webgl.js).
// The probe used to answer a plain yes/no and cache it, so a page that happened
// to load during a block decided "no WebGL" and never rendered a canvas again
// for the rest of the visit. It must tell "blocked" apart from "unsupported",
// and must not cache the temporary answer.

const loadProbe = async () => {
  vi.resetModules();
  return (await import("../utils/webgl")).probeWebGL;
};

const stubGetContext = (impl) => {
  HTMLCanvasElement.prototype.getContext = vi.fn(impl);
};

describe("probeWebGL", () => {
  let original;
  beforeEach(() => {
    original = HTMLCanvasElement.prototype.getContext;
  });
  afterEach(() => {
    HTMLCanvasElement.prototype.getContext = original;
  });

  it("reports ok, and releases the probe context straight away", async () => {
    const loseContext = vi.fn();
    stubGetContext(() => ({
      getExtension: (name) =>
        name === "WEBGL_lose_context" ? { loseContext } : null,
    }));
    const probeWebGL = await loadProbe();

    expect(probeWebGL()).toBe("ok");
    expect(loseContext).toHaveBeenCalledOnce();
  });

  it("reports blocked when Chrome refuses the host, and does not cache it", async () => {
    let blocked = true;
    stubGetContext(function () {
      if (!blocked) return { getExtension: () => null };
      const event = new Event("webglcontextcreationerror");
      event.statusMessage = "Web page caused context loss and was blocked";
      this.dispatchEvent(event);
      return null;
    });
    const probeWebGL = await loadProbe();

    expect(probeWebGL()).toBe("blocked");

    // Two minutes later Chrome lifts the block; the next probe must see that.
    blocked = false;
    expect(probeWebGL()).toBe("ok");
  });

  it("reports unsupported when there is no WebGL at all, and caches it", async () => {
    stubGetContext(() => null);
    const probeWebGL = await loadProbe();

    expect(probeWebGL()).toBe("unsupported");
    expect(probeWebGL()).toBe("unsupported");
    expect(HTMLCanvasElement.prototype.getContext).toHaveBeenCalledTimes(3);
  });
});

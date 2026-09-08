import { describe, expect, it, vi } from "vitest";

import { preventForcedContextLoss } from "../utils/webgl";

// Regression guard for "Web page caused context loss and was blocked".
//
// @react-three/fiber ends its teardown with state.gl.forceContextLoss(), which
// is WEBGL_lose_context.loseContext() — the call Chrome counts and eventually
// blocks the page for. Every canvas unmount used to spend one: HMR updates,
// StrictMode double-mounts, retries after a lost context, and the fallback swap
// that fired on all three canvases at once. If this override is ever dropped,
// the page starts burning that budget again and the failure is unrecoverable
// without a reload, so it is worth a test of its own.
describe("preventForcedContextLoss", () => {
  it("replaces forceContextLoss so an unmount costs nothing", () => {
    const loseContext = vi.fn();
    const renderer = {
      forceContextLoss: () => loseContext(),
    };

    preventForcedContextLoss(renderer);
    renderer.forceContextLoss();

    expect(loseContext).not.toHaveBeenCalled();
  });

  it("leaves a callable method behind, since r3f invokes it unconditionally", () => {
    const renderer = { forceContextLoss: () => {} };

    preventForcedContextLoss(renderer);

    expect(typeof renderer.forceContextLoss).toBe("function");
    expect(() => renderer.forceContextLoss()).not.toThrow();
  });

  it("tolerates a renderer that never had the method", () => {
    expect(() => preventForcedContextLoss({})).not.toThrow();
    expect(() => preventForcedContextLoss(null)).not.toThrow();
    expect(() => preventForcedContextLoss(undefined)).not.toThrow();
  });

  it("does not disturb the rest of the renderer", () => {
    const dispose = vi.fn();
    const renderer = {
      forceContextLoss: () => {},
      renderLists: { dispose },
      domElement: "canvas",
    };

    preventForcedContextLoss(renderer);
    renderer.renderLists.dispose();

    // Everything three actually frees still gets freed — the override only
    // removes the context kill, which is the last step and the only guilty one.
    expect(dispose).toHaveBeenCalledOnce();
    expect(renderer.domElement).toBe("canvas");
  });
});

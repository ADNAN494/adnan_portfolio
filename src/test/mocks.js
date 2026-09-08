import { vi } from "vitest";

// jsdom ships neither IntersectionObserver nor ResizeObserver, and this app
// leans on the former for four separate things: LazyShow's mount gate, the
// canvas pause/resume in visibility.jsx, the Navbar's active link, and
// framer-motion's whileInView. A stub that records its instances lets a test
// decide when something scrolls into view instead of guessing.
export class MockIntersectionObserver {
  static instances = [];

  constructor(callback, options = {}) {
    this.callback = callback;
    this.options = options;
    this.elements = new Set();
    MockIntersectionObserver.instances.push(this);
  }

  observe(element) {
    this.elements.add(element);
  }

  unobserve(element) {
    this.elements.delete(element);
  }

  disconnect() {
    this.elements.clear();
  }

  // Nothing intersects until a test says so, which keeps the default render
  // quiet: no lazy canvas chunks, no reveal animations mid-assertion.
  trigger(isIntersecting = true) {
    const entries = [...this.elements].map((target) => ({
      target,
      isIntersecting,
      intersectionRatio: isIntersecting ? 1 : 0,
      boundingClientRect: target.getBoundingClientRect(),
    }));
    if (entries.length) this.callback(entries, this);
  }

  static triggerAll(isIntersecting = true) {
    MockIntersectionObserver.instances.forEach((observer) =>
      observer.trigger(isIntersecting)
    );
  }

  static reset() {
    MockIntersectionObserver.instances = [];
  }
}

export class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// The default for every test: a browser with no WebGL at all. isWebGLAvailable()
// returns false, so SafeCanvas renders its fallback and never constructs a
// THREE.WebGLRenderer — which is the only way three.js can run under jsdom, and
// also the exact path a real visitor on a blocked or unsupported browser takes.
export const stubWebGLUnavailable = () => {
  const original = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = vi.fn(function (type, ...rest) {
    if (String(type).includes("webgl")) return null;
    return original ? original.call(this, type, ...rest) : null;
  });
};

export const stubMatchMedia = (matches = false) => {
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: typeof matches === "function" ? matches(query) : matches,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
};

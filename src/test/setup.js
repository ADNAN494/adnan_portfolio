import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach } from "vitest";
import { cleanup } from "@testing-library/react";

import {
  MockIntersectionObserver,
  MockResizeObserver,
  stubMatchMedia,
  stubWebGLUnavailable,
} from "./mocks";

beforeEach(() => {
  MockIntersectionObserver.reset();
  global.IntersectionObserver = MockIntersectionObserver;
  window.IntersectionObserver = MockIntersectionObserver;
  global.ResizeObserver = MockResizeObserver;
  window.ResizeObserver = MockResizeObserver;
  stubMatchMedia(false);
  stubWebGLUnavailable();
});

afterEach(() => {
  cleanup();
});

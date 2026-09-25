import { useSyncExternalStore } from "react";

// The theme lives on <html data-theme="dark">, not in React state. That
// attribute is what the CSS variables in index.css key off, and it is set by
// the inline script in index.html before the first paint  so a returning
// visitor who chose dark never sees a flash of the light page while React
// loads. This module treats the DOM as the source of truth and only lets React
// components subscribe to it.

export const THEME_STORAGE_KEY = "theme";

// Browser chrome colour (mobile address bar), per theme. Mirrors --canvas.
const THEME_COLOR = { light: "#f7f5f0", dark: "#0c1110" };

const listeners = new Set();

export const getTheme = () =>
  typeof document !== "undefined" &&
  document.documentElement.dataset.theme === "dark"
    ? "dark"
    : "light";

export const setTheme = (theme) => {
  const root = document.documentElement;
  if (theme === "dark") root.dataset.theme = "dark";
  else delete root.dataset.theme;

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Private mode or blocked storage: the switch still works for this visit.
  }

  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", THEME_COLOR[theme]);

  listeners.forEach((listener) => listener());
};

const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

// Re-renders the caller whenever the theme changes. Works anywhere, including
// inside an r3f <Canvas>, since it doesn't depend on React context.
export const useTheme = () =>
  useSyncExternalStore(subscribe, getTheme, () => "light");

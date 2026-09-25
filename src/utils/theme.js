import { useSyncExternalStore } from "react";

// The theme lives on <html data-theme="dark">.
// Dark is the default theme unless the user has explicitly selected light.

export const THEME_STORAGE_KEY = "theme";

// Browser chrome colour (mobile address bar), per theme.
const THEME_COLOR = {
  light: "#f7f5f0",
  dark: "#0c1110",
};

const listeners = new Set();

export const getTheme = () =>
  typeof document !== "undefined" &&
  document.documentElement.dataset.theme === "light"
    ? "light"
    : "dark";

export const setTheme = (theme) => {
  const root = document.documentElement;

  if (theme === "dark") {
    root.dataset.theme = "dark";
  } else {
    root.dataset.theme = "light";
  }

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Private mode or blocked storage:
    // the switch still works for this visit.
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

export const useTheme = () =>
  useSyncExternalStore(subscribe, getTheme, () => "dark");

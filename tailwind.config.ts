import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Art Showcase palette
        "as-text": "#1b1817",
        "as-dark": "#292423",
        "as-gray": "#57524d",
        "as-muted": "#78706b",
        "as-rich": "#443f3b",
        "as-border": "#e7e4e3",
        "as-border-light": "#d6d3d0",
        "as-card": "#f5f5f4",
        "as-section": "#fafaf9",
        "as-btn": "#030213",
        // DaVinci Project palette
        "dv-bg": "#fffef9",
        "dv-text": "#2d3748",
        "dv-muted": "#718096",
        "dv-accent": "#ff8c42",
        "dv-accent-border": "#ff8b41",
        // Admin palette
        "ad-bg": "#f1f1f1",
        "ad-dark": "#070c2c",
        "ad-gray": "#495565",
        "ad-purple": "#685ebb",
        "ad-purple-light": "#dba9ff",
        "ad-border": "#d9d9d9",
        "ad-border-light": "#e5e7eb",
      },
      fontFamily: {
        serif: ["Times New Roman", "Georgia", "serif"],
        sans: ["Arial", "Helvetica", "sans-serif"],
        "dm-sans": ["DM Sans", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;

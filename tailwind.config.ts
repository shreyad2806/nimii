import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        nimii: {
          primary: "#6C5CE7",
          "primary-hover": "#5A49D6",
          "primary-active": "#4E3DBE",
          lavender: "#EDE9FE",
          "lavender-light": "#F5F3FF",
          "lavender-subtle": "#FAF8FF",
          border: "#DDD6FE",
          navy: "#1E1B4B",
          "navy-light": "#2E2A5E",
          "navy-muted": "#64748B",
          slate: "#4B4E6D",
          peach: "#FED7AA",
          "peach-light": "#FFF7ED",
          sky: "#E0F2FE",
          "sky-light": "#F0F9FF",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
      },
      borderRadius: {
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(112, 71, 235, 0.08)",
        "glass-sm": "0 4px 16px 0 rgba(112, 71, 235, 0.05)",
        "glass-lg": "0 14px 40px -4px rgba(112, 71, 235, 0.14), 0 4px 14px -2px rgba(30, 27, 75, 0.05)",
        float: "0 20px 45px -8px rgba(108, 92, 231, 0.22)",
      },
      backdropBlur: {
        xs: "2px",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.65" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2.5s ease-in-out infinite",
        wiggle: "wiggle 1s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;

import type { Config } from "tailwindcss";

export default {
  content: ["./client/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Digital Custody Academy brand colors
        dca: {
          navy: {
            dark: "#0F2847",
            base: "#1B3A6B",
            light: "#2C5AA0",
          },
          white: "#FFFFFF",
          grey: {
            light: "#F3F4F6",
            medium: "#D1D5DB",
            dark: "#6B7280",
          },
          accent: {
            blue: "#5B8FD9",
          },
          text: {
            dark: "#1F2937",
            light: "#F9FAFB",
          },
        },
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        space: ["Space Mono", "monospace"],
      },
    },
  },
} satisfies Config;

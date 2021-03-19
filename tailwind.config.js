const defaultTheme = require("tailwindcss/defaultTheme");
const plugin = require("tailwindcss/plugin");

const mode = process.env.NODE_ENV;
const dev = mode === "development";

const svelteClassExtractor = (content) => {
  const tokens = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [];
  return tokens.map((m) => {
    if (!m.startsWith("class:")) return m;
    const equalIndex = m.indexOf("=");
    if (equalIndex !== -1) return m.slice(6, equalIndex);
    const slashIndex = m.indexOf("/");
    if (slashIndex !== -1) return m.slice(6, slashIndex);
    return m.slice(6);
  });
};

const shadow = (...params) =>
  params.map(([x, y, b, s, c]) => `${x}px ${y}px ${b}px ${s}px ${c}`).join(",");
const shadows = {
  sm: (shade) => shadow([0, 1, 2, 0, shade]),
  DEFAULT: (shade1, shade2) =>
    shadow([0, 1, 12, 0, shade1], [0, 1, 2, 0, shade2]),
  md: (shade1, shade2) => shadow([0, 4, 18, -1, shade1], [0, 2, 4, -1, shade2]),
  lg: (shade1, shade2) =>
    shadow([0, 10, 45, -3, shade1], [0, 4, 6, -2, shade2]),
  xl: (shade1, shade2) =>
    shadow([0, 20, 25, -5, shade1], [0, 10, 10, -5, shade2]),
};

module.exports = {
  purge: {
    enabled: !dev,
    content: ["./src/**/*.svelte", "./src/**/*.html"],
    options: {
      defaultExtractor: svelteClassExtractor,
    },
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    aspectRatio: {
      square: [1, 1],
    },
    extend: {
      animation: {
        "wave-y": "wave-y 1s ease-in-out infinite alternate both running",
        "bump-y": "bump-y 5s ease-in-out 2s infinite both running",
      },
      borderWidth: {
        3: "3px",
      },
      boxShadow: (theme) => ({
        DEFAULT: shadows.DEFAULT("rgba(0, 0, 0, 0.1)", "rgba(0, 0, 0, 0.06)"),
        md: shadows.md("rgba(0, 0, 0, 0.1)", "rgba(0, 0, 0, 0.06)"),
        lg: shadows.lg("rgba(0, 0, 0, 0.1)", "rgba(0, 0, 0, 0.05)"),
        "sm-primary": shadows.sm(theme("colors.primary.opacity-30")),
        primary: shadows.DEFAULT(
          theme("colors.primary.opacity-60"),
          theme("colors.primary.opacity-30")
        ),
        "md-primary": shadows.md(
          theme("colors.primary.opacity-60"),
          theme("colors.primary.opacity-30")
        ),
        "lg-primary": shadows.lg(
          theme("colors.primary.opacity-60"),
          theme("colors.primary.opacity-30")
        ),
        "xl-primary": shadows.xl(
          theme("colors.primary.opacity-60"),
          theme("colors.primary.opacity-30")
        ),
      }),
      colors: {
        primary: {
          DEFAULT: "var(--primary)",
          lighter: "var(--primary-lighter)",
          darker: "var(--primary-darker)",
          warmer: "var(--primary-warmer)",
          cooler: "var(--primary-cooler)",
          "opacity-30": "var(--primary-opacity-30)",
          "opacity-60": "var(--primary-opacity-60)",
        },
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
      height: {
        fit: "fit-content",
      },
      keyframes: {
        "wave-y": {
          "33%": { transform: "translateY(10px)" },
          "66%": { transform: "translateY(-10px)" },
          "100%": { transform: "translateY(0)" },
        },
        "bump-y": {
          "0%": { transform: "translateY(0px)" },
          "3%": { transform: "translateY(-5px)" },
          "4.5%": { transform: "translateY(6px)" },
          "6%": { transform: "translateY(-3px)" },
          "7.5%": { transform: "translateY(3px)" },
          "9%": { transform: "translateY(-2px)" },
          "10.5%": { transform: "translateY(2px)" },
          "12%": { transform: "translateY(0px)" },
          "100%": { transform: "translateY(0px)" },
        },
      },
      margin: {
        "1/4": "25%",
      },
      minHeight: (theme) => theme("height"),
      minWidth: (theme) => theme("width"),
      maxWidth: (theme) => theme("width"),
      padding: {
        half: "50%",
      },
      width: {
        fit: "fit-content",
      },
      zIndex: {
        "-1": "-1",
      },
    },
  },
  variants: {
    extend: {
      animation: ["hover"],
      backgroundColor: ["active"],
      borderWidth: ["last"],
      boxShadow: ["active"],
      display: ["before"],
      margin: ["first", "important", "responsive"],
    },
    aspectRatio: ["before"],
    scrollSnapType: ["responsive"],
  },
  plugins: [
    require("tailwind-css-variables"),
    require("tailwindcss-aspect-ratio"),
    require("tailwindcss-pseudo-elements"),
    plugin(({ addUtilities }) => {
      addUtilities(
        {
          ".content-empty": {
            content: "''",
          },
        },
        ["before"]
      );
    }),
    plugin(({ addUtilities }) => {
      addUtilities(
        {
          ".basis-full": {
            flexBasis: "100%",
          },
        },
        {
          variants: ["responsive"],
        }
      );
    }),
    require("tailwindcss-scroll-snap"),
    require("tailwindcss-important")(),
  ],
};

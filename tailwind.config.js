/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        "inter-light": "Inter_300Light",
        "inter-regular": "Inter_400Regular",
        "inter-medium": "Inter_500Medium",
        "inter-semibold": "Inter_600SemiBold",
        "inter-bold": "Inter_700Bold",
      },
      colors: {
        primary: "#000000",
        background: "#0F1115",
        surface: "#1A1D23",
        muted: "#8E939C",
        brand: {
          bg: "#0B0E14",
          text: "#F2EFE9",
          body: "#F5F4F0",
          surface: "#141822",
          primary: "#2ECC71",
          "surface-border": "#232838",
          "text-primary": "#F2EFE9",
          "text-secondary": "#8A8D96",
          "text-muted": "#5C5F68",
          blue: "#1A85FF",
          coral: "#FF6B4A",
          success: "#3DDC84",
        },
      },
    },
  },
  plugins: [],
};

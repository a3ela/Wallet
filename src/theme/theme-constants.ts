export type ThemePreference = "system" | "light" | "dark";

export type ResolvedTheme = "light" | "dark";

export const THEME_PREFERENCE_KEY = "appThemePreference";

export const FontFamily = {
  light: "Inter_300Light",
  regular: "Inter_400Regular",
  medium: "Inter_500Medium",
  semibold: "Inter_600SemiBold",
  bold: "Inter_700Bold",
};

export const textVariants = {
  h1: "text-[28px] font-inter-bold",
  h2: "text-[22px] font-inter-semibold",
  h3: "text-[18px] font-inter-medium",
  h4: "text-[16px] font-inter-medium",
  body: "text-[14px] leading-[20px] font-inter-regular",
  bodyLarge: "text-[16px] leading-[22px] font-inter-regular",
  description: "text-[14px] leading-[20px] font-inter-regular",
  caption: "text-[12px] leading-[14px] font-inter-regular",
  f_12: "text-[12px] leading-[16px] font-inter-regular",
  f_11: "text-[12px] leading-[15px] font-inter-regular",
  f_10: "text-[10px] leading-[14px] font-inter-regular",
  f_8: "text-[8px] leading-[12px] font-inter-regular",
};

export type TextVariant = keyof typeof textVariants;

export const getTextStyle = (variant: TextVariant) => {
  return textVariants[variant];
};
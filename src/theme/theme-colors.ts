import { vars } from "nativewind";

/**
 * Theme variables mapped from the wallet brand palette
 * (see tailwind.config.js -> theme.extend.colors).
 */
export const themes = {
  light: vars({
    /* Core */
    "--background": "#F5F4F0", // brand.body
    "--foreground": "#0F1115", // background (ink)
    "--link": "#1A85FF", // brand.blue

    /* Primary */
    "--primary": "#2ECC71", // brand.primary
    "--primary-muted": "rgba(46, 204, 113, 0.15)", // brand.primary @ 15%

    /* Secondary */
    "--secondary": "#1A85FF", // brand.blue
    "--secondary-foreground": "#FFFFFF",

    /* Danger */
    "--destructive": "#FF6B4A", // brand.coral
    "--destructive-muted": "rgba(255, 107, 74, 0.12)", // brand.coral @ 12%

    /* Surface */
    "--surface": "#FFFFFF",
    "--surface-elevated": "#FFFFFF",
    "--card": "#FFFFFF",
    "--border": "rgba(35, 40, 56, 0.12)", // brand.surface-border @ 12%
    "--tab-border": "rgba(35, 40, 56, 0.12)", // brand.surface-border @ 12%

    "--muted": "rgba(35, 40, 56, 0.06)", // brand.surface-border @ 6%
    "--muted-foreground": "#8A8D96", // brand.text-secondary

    /* Input */
    "--input": "#FFFFFF",
    "--input-border": "rgba(35, 40, 56, 0.25)", // brand.surface-border @ 25%

    /* Icon */
    "--icon-primary": "#0F1115", // background (ink)
    "--icon-secondary": "#8A8D96", // brand.text-secondary
    "--icon-tertiary": "#5C5F68", // brand.text-muted
    "--icon-active": "#2ECC71", // brand.primary

    /* Banner */
    "--banner": "rgba(255, 107, 74, 0.10)", // brand.coral @ 10%
    "--banner-foreground": "#FF6B4A", // brand.coral
    "--camera-placeholder": "#FFFFFF",
    "--camera-outline": "rgba(35, 40, 56, 0.20)", // brand.surface-border @ 20%
    "--camera-accent": "#1A85FF", // brand.blue
    "--camera-accent-text": "#0B0E14", // brand.bg
    "--camera-gallery-border": "rgba(35, 40, 56, 0.15)", // brand.surface-border @ 15%
    "--camera-gallery-text": "#8A8D96", // brand.text-secondary
  }),
  dark: vars({
    /* Core */
    "--background": "#0B0E14", // brand.bg
    "--foreground": "#F2EFE9", // brand.text
    "--link": "#1A85FF", // brand.blue

    /* Primary */
    "--primary": "#2ECC71", // brand.primary
    "--primary-muted": "rgba(46, 204, 113, 0.15)", // brand.primary @ 15%

    /* Secondary */
    "--secondary": "#1A85FF", // brand.blue
    "--secondary-foreground": "#FFFFFF",

    /* Danger */
    "--destructive": "#FF6B4A", // brand.coral
    "--destructive-muted": "rgba(255, 107, 74, 0.15)", // brand.coral @ 15%

    /* Surface */
    "--surface": "#141822", // brand.surface
    "--surface-elevated": "#1A1D23", // surface (generic)
    "--card": "#141822", // brand.surface
    "--border": "#232838", // brand.surface-border
    "--tab-border": "#232838", // brand.surface-border

    "--muted": "#141822", // brand.surface
    "--muted-foreground": "#8A8D96", // brand.text-secondary

    /* Input */
    "--input": "#141822", // brand.surface
    "--input-border": "#232838", // brand.surface-border

    /* Icon */
    "--icon-primary": "#F2EFE9", // brand.text
    "--icon-secondary": "#8A8D96", // brand.text-secondary
    "--icon-tertiary": "#5C5F68", // brand.text-muted
    "--icon-active": "#2ECC71", // brand.primary

    /* Banner */
    "--banner": "#141822", // brand.surface
    "--banner-foreground": "#FF6B4A", // brand.coral
    "--camera-placeholder": "#1A1D23", // surface (generic)
    "--camera-outline": "#232838", // brand.surface-border
    "--camera-accent": "#3DDC84", // brand.success
    "--camera-accent-text": "#0B0E14", // brand.bg
    "--camera-gallery-border": "#232838", // brand.surface-border
    "--camera-gallery-text": "#8A8D96", // brand.text-secondary
  }),
};
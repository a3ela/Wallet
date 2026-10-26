import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { View } from "react-native";
import { useColorScheme } from "nativewind";
import { themes } from "./theme-colors";
import {
  THEME_PREFERENCE_KEY,
  type ResolvedTheme,
  type ThemePreference,
} from "./theme-constants";
import {
  getPreference,
  setPreference as setStoredPreference,
} from "../lib/secure-storage";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeContext = createContext<{
  theme: ResolvedTheme;
  preference: ThemePreference;
  isReady: boolean;
  setPreference: (value: ThemePreference) => void;
}>({
  theme: "light",
  preference: "system",
  isReady: false,
  setPreference: () => {},
});
export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const { colorScheme, setColorScheme } = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>("system");
  const [isReady, setIsReady] = useState(false);
  const resolvedTheme =
    preference === "system" ? (colorScheme ?? "light") : preference;

  useEffect(() => {
    let isMounted = true;
    const loadPreference = async () => {
      try {
        const stored = await getPreference(THEME_PREFERENCE_KEY);
        if (!isMounted) return;
        if (stored === "light" || stored === "dark" || stored === "system") {
          setPreferenceState(stored);
          setColorScheme(stored);
        }
      } catch (error) {
        console.warn("[theme] Unable to load preference:", error);
      } finally {
        if (isMounted) {
          setIsReady(true);
        }
      }
    };
    void loadPreference();
    return () => {
      isMounted = false;
    };
  }, [setColorScheme]);

  const setPreference = useCallback(
    (value: ThemePreference) => {
      setPreferenceState(value);
      setColorScheme(value);
      setStoredPreference(THEME_PREFERENCE_KEY, value).catch((error: unknown) =>
        console.warn("[theme] Unable to persist preference:", error),
      );
    },
    [setColorScheme],
  );

  return (
    <ThemeContext.Provider
      value={{
        theme: resolvedTheme,
        preference,
        isReady,
        setPreference,
      }}
    >
      <View style={themes[resolvedTheme]} className="flex-1">
        {isReady ? children : null}
      </View>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const { theme } = useContext(ThemeContext);
  return theme;
};

export const useThemePreference = () => {
  const { preference, isReady, setPreference } = useContext(ThemeContext);
  return { preference, isReady, setPreference };
};

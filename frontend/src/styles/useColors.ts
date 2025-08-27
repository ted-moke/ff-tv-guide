import { useMemo } from "react";

// Helper function to get CSS variable value
const getCSSVariable = (variableName: string): string => {
  if (typeof window === "undefined") return "";
  return getComputedStyle(document.documentElement)
    .getPropertyValue(variableName)
    .trim();
};

// Helper function to get CSS variable value with fallback
const getCSSVariableWithFallback = (
  variableName: string,
  fallback: string
): string => {
  const value = getCSSVariable(variableName);
  return value || fallback;
};

export interface Colors {
  // Brand Colors
  red: {
    base: string;
    hover: string;
    active: string;
    text: string;
  };
  blue: {
    base: string;
    hover: string;
    active: string;
    text: string;
  };
  green: {
    base: string;
    hover: string;
    active: string;
    text: string;
  };
  yellow: {
    base: string;
    hover: string;
    active: string;
    text: string;
  };
  purple: {
    base: string;
    hover: string;
    active: string;
    text: string;
  };

  // Background Colors
  background: {
    primary: string;
    offset: string;
    offset2: string;
    light: string;
  };

  // Text Colors
  text: {
    primary: string;
    muted: string;
    light: string;
    lightMuted: string;
  };

  // Primary/Secondary Colors
  primary: {
    color: string;
    hover: string;
    active: string;
    disabledBg: string;
    disabledColor: string;
  };
  secondary: {
    color: string;
    hover: string;
    active: string;
    disabledBg: string;
    disabledColor: string;
  };

  // Disabled States
  disabled: {
    clearBg: string;
    clearColor: string;
    dangerBg: string;
    dangerColor: string;
  };

  // Sizing System
  sizes: {
    size0_25: string;
    size0_5: string;
    size0_75: string;
    size1: string;
    size1_5: string;
    size1_75: string;
    size2: string;
    size2_5: string;
    size3: string;
    size3_5: string;
    size4: string;
    size4_5: string;
    size5: string;
    size5_5: string;
    size6: string;
    size6_5: string;
    size7: string;
    size7_5: string;
    size8: string;
    size8_5: string;
    size9: string;
    size9_5: string;
    size10: string;
    size10_5: string;
    size11: string;
    size11_5: string;
    size12: string;
    size12_5: string;
    size13: string;
    size13_5: string;
    size14: string;
  };

  // Font Sizes
  fontSizes: {
    small: string;
    medium: string;
    mL: string;
    large: string;
    xl: string;
    xxl: string;
    xxxl: string;
  };

  // Border Radius
  borderRadius: {
    small: string;
    medium: string;
    large: string;
    full: string;
  };

  // Layout
  layout: {
    sidebarWidth: string;
  };
}

export const useColors = (): Colors => {
  return useMemo(
    () => ({
      // Brand Colors
      red: {
        base: getCSSVariable("--color-red"),
        hover: getCSSVariable("--color-red-hover"),
        active: getCSSVariable("--color-red-active"),
        text: getCSSVariable("--color-red-text"),
      },
      blue: {
        base: getCSSVariable("--color-blue"),
        hover: getCSSVariable("--color-blue-hover"),
        active: getCSSVariable("--color-blue-active"),
        text: getCSSVariable("--color-blue-text"),
      },
      green: {
        base: getCSSVariable("--color-green"),
        hover: getCSSVariable("--color-green-hover"),
        active: getCSSVariable("--color-green-active"),
        text: getCSSVariable("--color-green-text"),
      },
      yellow: {
        base: getCSSVariable("--color-yellow"),
        hover: getCSSVariable("--color-yellow-hover"),
        active: getCSSVariable("--color-yellow-active"),
        text: getCSSVariable("--color-yellow-text"),
      },
      purple: {
        base: getCSSVariable("--color-purple"),
        hover: getCSSVariable("--color-purple-hover"),
        active: getCSSVariable("--color-purple-active"),
        text: getCSSVariable("--color-purple-text"),
      },

      // Background Colors
      background: {
        primary: getCSSVariable("--background-color"),
        offset: getCSSVariable("--background-color-offset"),
        offset2: getCSSVariable("--background-color-offset-2"),
        light: getCSSVariable("--background-color-light"),
      },

      // Text Colors
      text: {
        primary: getCSSVariable("--text-color"),
        muted: getCSSVariable("--text-color-muted"),
        light: getCSSVariable("--text-color-light"),
        lightMuted: getCSSVariable("--text-color-light-muted"),
      },

      // Primary/Secondary Colors
      primary: {
        color: getCSSVariable("--primary-color"),
        hover: getCSSVariable("--primary-hover-color"),
        active: getCSSVariable("--primary-active-color"),
        disabledBg: getCSSVariable("--primary-disabled-bg"),
        disabledColor: getCSSVariable("--primary-disabled-color"),
      },
      secondary: {
        color: getCSSVariable("--secondary-color"),
        hover: getCSSVariable("--secondary-hover-color"),
        active: getCSSVariable("--secondary-active-color"),
        disabledBg: getCSSVariable("--secondary-disabled-bg"),
        disabledColor: getCSSVariable("--secondary-disabled-color"),
      },

      // Disabled States
      disabled: {
        clearBg: getCSSVariable("--clear-disabled-bg"),
        clearColor: getCSSVariable("--clear-disabled-color"),
        dangerBg: getCSSVariable("--danger-disabled-bg"),
        dangerColor: getCSSVariable("--danger-disabled-color"),
      },

      // Sizing System
      sizes: {
        size0_25: getCSSVariable("--size0_25"),
        size0_5: getCSSVariable("--size0_5"),
        size0_75: getCSSVariable("--size0_75"),
        size1: getCSSVariable("--size1"),
        size1_5: getCSSVariable("--size1_5"),
        size1_75: getCSSVariable("--size1_75"),
        size2: getCSSVariable("--size2"),
        size2_5: getCSSVariable("--size2_5"),
        size3: getCSSVariable("--size3"),
        size3_5: getCSSVariable("--size3_5"),
        size4: getCSSVariable("--size4"),
        size4_5: getCSSVariable("--size4_5"),
        size5: getCSSVariable("--size5"),
        size5_5: getCSSVariable("--size5_5"),
        size6: getCSSVariable("--size6"),
        size6_5: getCSSVariable("--size6_5"),
        size7: getCSSVariable("--size7"),
        size7_5: getCSSVariable("--size7_5"),
        size8: getCSSVariable("--size8"),
        size8_5: getCSSVariable("--size8_5"),
        size9: getCSSVariable("--size9"),
        size9_5: getCSSVariable("--size9_5"),
        size10: getCSSVariable("--size10"),
        size10_5: getCSSVariable("--size10_5"),
        size11: getCSSVariable("--size11"),
        size11_5: getCSSVariable("--size11_5"),
        size12: getCSSVariable("--size12"),
        size12_5: getCSSVariable("--size12_5"),
        size13: getCSSVariable("--size13"),
        size13_5: getCSSVariable("--size13_5"),
        size14: getCSSVariable("--size14"),
      },

      // Font Sizes
      fontSizes: {
        small: getCSSVariable("--font-size-small"),
        medium: getCSSVariable("--font-size-medium"),
        mL: getCSSVariable("--font-size-m_l"),
        large: getCSSVariable("--font-size-large"),
        xl: getCSSVariable("--font-size-xl"),
        xxl: getCSSVariable("--font-size-xxl"),
        xxxl: getCSSVariable("--font-size-xxxl"),
      },

      // Border Radius
      borderRadius: {
        small: getCSSVariable("--border-radius-small"),
        medium: getCSSVariable("--border-radius-medium"),
        large: getCSSVariable("--border-radius-large"),
        full: getCSSVariable("--border-radius-full"),
      },

      // Layout
      layout: {
        sidebarWidth: getCSSVariable("--sidebar-width"),
      },
    }),
    []
  );
};

// Utility functions for common color operations
export const useColorUtils = () => {
  const colors = useColors();

  return useMemo(() => {
    // Helper function to get a color with opacity
    const withOpacity = (color: string, opacity: number): string => {
      // Handle hex colors
      if (color.startsWith("#")) {
        const hex = color.replace("#", "");
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
      }

      // Handle rgb colors
      if (color.startsWith("rgb(")) {
        return color.replace("rgb(", "rgba(").replace(")", `, ${opacity})`);
      }

      // Handle rgba colors
      if (color.startsWith("rgba(")) {
        return color.replace(/[\d.]+\)$/, `${opacity})`);
      }

      return color;
    };

    return {
      // Get a color with opacity
      withOpacity,

      // Get a lighter version of a color
      lighter: (color: string, amount: number = 0.1): string => {
        // This is a simplified version - you might want to use a color manipulation library
        return withOpacity(color, 1 - amount);
      },

      // Get a darker version of a color
      darker: (color: string, amount: number = 0.1): string => {
        // This is a simplified version - you might want to use a color manipulation library
        return withOpacity(color, 1 + amount);
      },

      // Check if a color is light or dark
      isLight: (color: string): boolean => {
        // Simplified logic - you might want more sophisticated color analysis
        if (color.startsWith("#")) {
          const hex = color.replace("#", "");
          const r = parseInt(hex.substr(0, 2), 16);
          const g = parseInt(hex.substr(2, 2), 16);
          const b = parseInt(hex.substr(4, 2), 16);
          const brightness = (r * 299 + g * 587 + b * 114) / 1000;
          return brightness > 128;
        }
        return false;
      },
    };
  }, []);
};

// Export individual color getters for convenience
export const useBrandColors = () => {
  const colors = useColors();
  return colors.red;
};

export const useBackgroundColors = () => {
  const colors = useColors();
  return colors.background;
};

export const useTextColors = () => {
  const colors = useColors();
  return colors.text;
};

export const usePrimaryColors = () => {
  const colors = useColors();
  return colors.primary;
};

export const useSecondaryColors = () => {
  const colors = useColors();
  return colors.secondary;
};

export const useSizes = () => {
  const colors = useColors();
  return colors.sizes;
};

export const useFontSizes = () => {
  const colors = useColors();
  return colors.fontSizes;
};

export const useBorderRadius = () => {
  const colors = useColors();
  return colors.borderRadius;
};

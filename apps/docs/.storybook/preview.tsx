import React from "react";
import type { Decorator, Preview } from "@storybook/react-vite";

import "@talus/tokens/talus.css";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/ibm-plex-sans/700.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/archivo/800.css";
import "./preview.css";

const withTheme: Decorator = (Story, context) => {
  const brand = String(context.globals.brand ?? "enterprise");
  const scheme = String(context.globals.scheme ?? "light");
  React.useEffect(() => {
    document.documentElement.dataset.brand = brand;
    document.documentElement.dataset.scheme = scheme;
  }, [brand, scheme]);
  return <Story />;
};

const preview: Preview = {
  globalTypes: {
    brand: {
      description: "Talus brand",
      toolbar: {
        title: "Brand",
        icon: "paintbrush",
        items: [
          { value: "enterprise", title: "Enterprise" },
          { value: "consumer", title: "Consumer" },
        ],
        dynamicTitle: true,
      },
    },
    scheme: {
      description: "Color scheme (consumer has no dark mode yet and stays light)",
      toolbar: {
        title: "Scheme",
        icon: "sun",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    brand: "enterprise",
    scheme: "light",
  },
  decorators: [withTheme],
  parameters: {
    layout: "padded",
    backgrounds: { disable: true },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;

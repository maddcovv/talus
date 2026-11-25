import { addons } from "storybook/manager-api";
import { create } from "storybook/theming";
import { brand, colorModes } from "@talus/tokens";
import { wordmarkPath, wordmarkViewBox } from "./wordmark";

/* Theme the Storybook frame with Talus values. Everything comes from the
   token build (enterprise light); nothing here is a hand-typed color. */
const c = colorModes["enterprise-light"].color;
const ent = brand.enterprise;

const family = (names: readonly string[]) =>
  names.map((n) => (n.includes(" ") ? `"${n}"` : n)).join(", ");

const wordmarkSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${wordmarkViewBox}" width="75" height="24" role="img" aria-label="Talus"><path fill="${c.text.primary}" d="${wordmarkPath}"/></svg>`;

addons.setConfig({
  theme: create({
    base: "light",
    brandTitle: "Talus",
    brandUrl: "https://jreese.com",
    brandImage: `data:image/svg+xml,${encodeURIComponent(wordmarkSvg)}`,

    colorPrimary: c.action.primary.bg,
    colorSecondary: c.action.primary.bg,

    appBg: c.bg.canvas,
    appContentBg: c.bg.surface,
    appPreviewBg: c.bg.surface,
    appBorderColor: c.border.default,
    appBorderRadius: Number.parseInt(ent.radius.container, 10),

    textColor: c.text.primary,
    textMutedColor: c.text.secondary,
    textInverseColor: c.text.inverse,

    barBg: c.bg.surface,
    barTextColor: c.text.secondary,
    barHoverColor: c.action.primary.bg,
    barSelectedColor: c.action.primary.bg,

    buttonBg: c.bg.subtle,
    buttonBorder: c.border.default,
    inputBg: c.bg.surface,
    inputBorder: c.border.input,
    inputTextColor: c.text.primary,
    inputBorderRadius: Number.parseInt(ent.radius.control, 10),

    fontBase: family(ent.font.family.body),
    fontCode: family(ent.font.family.mono),
  }),
});

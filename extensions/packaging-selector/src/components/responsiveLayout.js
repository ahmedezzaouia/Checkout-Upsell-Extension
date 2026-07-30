/**
 * Viewport-responsive layout tokens — mobile tighter, desktop unchanged.
 * Uses Style conditionals (same pattern as PackagingOptionLightboxImage).
 */
import { Style } from '@shopify/ui-extensions-react/checkout';

export const MOBILE_ONLY_DISPLAY = Style.default('auto').when(
  { viewportInlineSize: { min: 'medium' } },
  'none',
);

export const DESKTOP_ONLY_DISPLAY = Style.default('none').when(
  { viewportInlineSize: { min: 'medium' } },
  'auto',
);

/** Row wrapper padding — base on mobile for comfortable top/bottom breathing room */
export const OPTION_ROW_PADDING = Style.default('base').when(
  { viewportInlineSize: { min: 'medium' } },
  'loose',
);

/** Gap between columns (radio/text/image) */
export const OPTION_ROW_SPACING = Style.default('base').when(
  { viewportInlineSize: { min: 'medium' } },
  'loose',
);

/** Title row to description */
export const TITLE_BODY_SPACING = Style.default('extraTight').when(
  { viewportInlineSize: { min: 'medium' } },
  'base',
);

/** Between description paragraphs */
export const PARAGRAPH_SPACING = Style.default('extraTight').when(
  { viewportInlineSize: { min: 'medium' } },
  'base',
);

/** Before quantity stepper */
export const STEPPER_TOP_SPACING = Style.default('base').when(
  { viewportInlineSize: { min: 'medium' } },
  'base',
);

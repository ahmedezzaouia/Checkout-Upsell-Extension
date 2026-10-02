/**
 * Container-responsive layout tokens — mobile tighter, desktop unchanged.
 * Values use Polaris container query syntax and require an ancestor
 * `<s-query-container>` (rendered at the extension root).
 */

/**
 * Block width at which desktop values apply. Phone checkout columns (≈400px or
 * less) fall below it; the desktop main column (≈500px) sits above it.
 */
const DESKTOP_MIN_INLINE_SIZE = '450px';

/**
 * @param {string} desktopValue
 * @param {string} mobileValue
 * @returns {string}
 */
export function responsive(desktopValue, mobileValue) {
  return `@container (inline-size > ${DESKTOP_MIN_INLINE_SIZE}) ${desktopValue}, ${mobileValue}`;
}

/** Row wrapper padding — base on mobile for comfortable top/bottom breathing room */
export const OPTION_ROW_PADDING = responsive('large-200', 'base');

/** Gap between columns (radio/text/image) */
export const OPTION_ROW_SPACING = responsive('large-200', 'base');

/** Title row to description */
export const TITLE_BODY_SPACING = responsive('base', 'small-400');

/** Between description paragraphs */
export const PARAGRAPH_SPACING = responsive('base', 'small-400');

/** Before quantity stepper */
export const STEPPER_TOP_SPACING = 'base';

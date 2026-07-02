/**
 * Line attribution utilities for packaging selector
 * Marks selector-added cart lines so we can differentiate from manually-added ones
 */

export const PACKAGING_SELECTOR_ATTR = '_packaging_selector';

/**
 * Checks if a cart line was added by the packaging selector
 * @param {Object} line - Cart line object
 * @param {string} optionId - Option ID (e.g. 'gift-bag', 'luxury-packaging')
 * @returns {boolean}
 */
export function hasSelectorAttribute(line, optionId) {
  return line.attributes?.some(
    (a) => a.key === PACKAGING_SELECTOR_ATTR && a.value === optionId
  ) ?? false;
}
  
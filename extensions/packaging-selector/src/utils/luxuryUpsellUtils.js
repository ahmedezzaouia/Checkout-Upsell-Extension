/**
 * Luxury packaging upsell — adds/updates/removes selector-attributed cart lines only.
 */

import { PACKAGING_SELECTOR_ATTR, hasSelectorAttribute } from './lineAttribution';
import { toVariantGid } from './packagingPriceUtils';

/**
 * @param {Function} applyCartLinesChange
 * @param {Array} cartLines
 * @param {boolean} shouldAdd
 * @param {number} quantity
 * @param {string | null} productId
 */
export const handleLuxuryPackaging = async (
  applyCartLinesChange,
  cartLines,
  shouldAdd,
  quantity = 1,
  productId = null,
) => {
  const luxuryPackagingVariantId = toVariantGid(productId);
  
  if (!luxuryPackagingVariantId && shouldAdd) {
    console.warn('⚠️ Luxury packaging product ID not configured');
    return;
  }

  const luxuryPackagingSelectorLine = cartLines.find((line) =>
    line.merchandise?.id === luxuryPackagingVariantId && hasSelectorAttribute(line, 'luxury-packaging')
  );

  if (shouldAdd) {
    if (luxuryPackagingSelectorLine) {
      // Update existing selector-added luxury packaging quantity
      try {
        const result = await applyCartLinesChange({
          type: 'updateCartLine',
          id: luxuryPackagingSelectorLine.id,
          quantity: quantity,
        });

        if (result.type === 'error') {
          console.error('❌ Error updating luxury packaging quantity:', result.message);
        }
      } catch (error) {
        console.error('❌ Error updating luxury packaging quantity:', error);
      }
    } else {
      // Add new luxury packaging with selector attribute (so we only remove our line, not manual)
      try {
        const result = await applyCartLinesChange({
          type: 'addCartLine',
          merchandiseId: luxuryPackagingVariantId,
          quantity: quantity,
          attributes: [{ key: PACKAGING_SELECTOR_ATTR, value: 'luxury-packaging' }],
        });

        if (result.type === 'error') {
          console.error('❌ Error adding luxury packaging:', result.message);
        }
      } catch (error) {
        console.error('❌ Error adding luxury packaging:', error);
      }
    }
  } else {
    // Remove only selector-added luxury packaging (never touch manually-added lines)
    if (!luxuryPackagingSelectorLine) {
      return;
    }

    try {
      const result = await applyCartLinesChange({
        type: 'updateCartLine',
        id: luxuryPackagingSelectorLine.id,
        quantity: 0,
      });

      if (result.type === 'error') {
        console.error('❌ Error removing luxury packaging:', result.message);
      }
    } catch (error) {
      console.error('❌ Error removing luxury packaging:', error);
    }
  }
};

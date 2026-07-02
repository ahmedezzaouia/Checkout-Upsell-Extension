/**
 * Gift bag upsell — adds/updates/removes selector-attributed cart lines only.
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
export const handleGiftBag = async (
  applyCartLinesChange,
  cartLines,
  shouldAdd,
  quantity = 1,
  productId = null,
) => {
  const giftBagVariantId = toVariantGid(productId);
  
  if (!giftBagVariantId && shouldAdd) {
    console.warn('⚠️ Gift bag product ID not configured');
    return;
  }

  const giftBagSelectorLine = cartLines.find((line) =>
    line.merchandise?.id === giftBagVariantId && hasSelectorAttribute(line, 'gift-bag')
  );

  if (shouldAdd) {
    if (giftBagSelectorLine) {
      // Update existing selector-added gift bag quantity
      try {
        const result = await applyCartLinesChange({
          type: 'updateCartLine',
          id: giftBagSelectorLine.id,
          quantity: quantity,
        });

        if (result.type === 'error') {
          console.error('❌ Error updating gift bag quantity:', result.message);
        }
      } catch (error) {
        console.error('❌ Error updating gift bag quantity:', error);
      }
    } else {
      // Add new gift bag with selector attribute (so we only remove our line, not manual)
      try {
        const result = await applyCartLinesChange({
          type: 'addCartLine',
          merchandiseId: giftBagVariantId,
          quantity: quantity,
          attributes: [{ key: PACKAGING_SELECTOR_ATTR, value: 'gift-bag' }],
        });

        if (result.type === 'error') {
          console.error('❌ Error adding gift bag:', result.message);
        }
      } catch (error) {
        console.error('❌ Error adding gift bag:', error);
      }
    }
  } else {
    // Remove only selector-added gift bag (never touch manually-added lines)
    if (!giftBagSelectorLine) {
      return;
    }

    try {
      const result = await applyCartLinesChange({
        type: 'updateCartLine',
        id: giftBagSelectorLine.id,
        quantity: 0,
      });

      if (result.type === 'error') {
        console.error('❌ Error removing gift bag:', result.message);
      }
    } catch (error) {
      console.error('❌ Error removing gift bag:', error);
    }
  }
};

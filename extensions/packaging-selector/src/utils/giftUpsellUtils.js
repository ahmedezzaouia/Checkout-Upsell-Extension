/**
 * Upsell utility functions
 */

const GIFT_BAG_VARIANT_ID = 'gid://shopify/ProductVariant/45978405044491';

/**
 * Handles Gift Bag cart line operations (add/remove/update quantity)
 * @param {Function} applyCartLinesChange - Function to apply cart line changes
 * @param {Array} cartLines - Current cart lines
 * @param {boolean} shouldAdd - Whether to add (true) or remove (false) the gift bag
 * @param {number} quantity - Quantity for the gift bag (default: 1)
 */
export const handleGiftBag = async (applyCartLinesChange, cartLines, shouldAdd, quantity = 1) => {
  const giftBagLine = cartLines.find(line => 
    line.merchandise?.id === GIFT_BAG_VARIANT_ID
  );

  if (shouldAdd) {
    if (giftBagLine) {
      // Update existing gift bag quantity
      try {
        const result = await applyCartLinesChange({
          type: 'updateCartLine',
          id: giftBagLine.id,
          quantity: quantity,
        });

        if (result.type === 'error') {
          console.error('❌ Error updating gift bag quantity:', result.message);
        }
      } catch (error) {
        console.error('❌ Error updating gift bag quantity:', error);
      }
    } else {
      // Add new gift bag
      try {
        const result = await applyCartLinesChange({
          type: 'addCartLine',
          merchandiseId: GIFT_BAG_VARIANT_ID,
          quantity: quantity,
        });

        if (result.type === 'error') {
          console.error('❌ Error adding gift bag:', result.message);
        }
      } catch (error) {
        console.error('❌ Error adding gift bag:', error);
      }
    }
  } else {
    // Remove gift bag
    if (!giftBagLine) {
      console.log('ℹ️ Gift bag not in cart');
      return;
    }

    try {
      const result = await applyCartLinesChange({
        type: 'updateCartLine',
        id: giftBagLine.id,
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

/**
 * Handles quantity changes for gift bag
 * @param {Function} applyCartLinesChange - Function to apply cart line changes
 * @param {Array} cartLines - Current cart lines
 * @param {number} quantity - New quantity for the gift bag
 */
export const handleGiftBagQuantityChange = async (applyCartLinesChange, cartLines, quantity) => {
  const giftBagLine = cartLines.find(line => 
    line.merchandise?.id === GIFT_BAG_VARIANT_ID
  );
  
  if (giftBagLine) {
    await handleGiftBag(applyCartLinesChange, cartLines, true, quantity);
  }
};

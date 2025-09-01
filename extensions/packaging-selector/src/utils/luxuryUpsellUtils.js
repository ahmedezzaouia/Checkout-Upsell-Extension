/**
 * Luxury upsell utility functions
 */

const LUXURY_PACKAGING_VARIANT_ID = 'gid://shopify/ProductVariant/52053529886987';

/**
 * Handles Luxury Packaging cart line operations (add/remove/update quantity)
 * @param {Function} applyCartLinesChange - Function to apply cart line changes
 * @param {Array} cartLines - Current cart lines
 * @param {boolean} shouldAdd - Whether to add (true) or remove (false) the luxury packaging
 * @param {number} quantity - Quantity for the luxury packaging (default: 1)
 */
export const handleLuxuryPackaging = async (applyCartLinesChange, cartLines, shouldAdd, quantity = 1) => {
  const luxuryPackagingLine = cartLines.find(line => 
    line.merchandise?.id === LUXURY_PACKAGING_VARIANT_ID
  );

  if (shouldAdd) {
    if (luxuryPackagingLine) {
      // Update existing luxury packaging quantity
      try {
        const result = await applyCartLinesChange({
          type: 'updateCartLine',
          id: luxuryPackagingLine.id,
          quantity: quantity,
        });

        if (result.type === 'error') {
          console.error('❌ Error updating luxury packaging quantity:', result.message);
        }
      } catch (error) {
        console.error('❌ Error updating luxury packaging quantity:', error);
      }
    } else {
      // Add new luxury packaging
      try {
        const result = await applyCartLinesChange({
          type: 'addCartLine',
          merchandiseId: LUXURY_PACKAGING_VARIANT_ID,
          quantity: quantity,
        });

        if (result.type === 'error') {
          console.error('❌ Error adding luxury packaging:', result.message);
        }
      } catch (error) {
        console.error('❌ Error adding luxury packaging:', error);
      }
    }
  } else {
    // Remove luxury packaging
    if (!luxuryPackagingLine) {
      console.log('ℹ️ Luxury packaging not in cart');
      return;
    }

    try {
      const result = await applyCartLinesChange({
        type: 'updateCartLine',
        id: luxuryPackagingLine.id,
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

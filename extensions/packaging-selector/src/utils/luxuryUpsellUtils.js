/**
 * Luxury upsell utility functions
 */

/**
 * Generates the Shopify variant ID from a product ID
 * @param {string} productId - The product ID
 * @returns {string} The Shopify variant ID
 */
const getVariantId = (productId) => {
  if (!productId) return null;
  // If it's already a full Shopify ID, return as is
  if (productId.startsWith('gid://shopify/ProductVariant/')) {
    return productId;
  }
  // Otherwise, construct the variant ID
  return `gid://shopify/ProductVariant/${productId}`;
};

/**
 * Handles Luxury Packaging cart line operations (add/remove/update quantity)
 * @param {Function} applyCartLinesChange - Function to apply cart line changes
 * @param {Array} cartLines - Current cart lines
 * @param {boolean} shouldAdd - Whether to add (true) or remove (false) the luxury packaging
 * @param {number} quantity - Quantity for the luxury packaging (default: 1)
 * @param {string} productId - The configurable product ID for the luxury packaging
 */
export const handleLuxuryPackaging = async (applyCartLinesChange, cartLines, shouldAdd, quantity = 1, productId = null) => {
  const luxuryPackagingVariantId = getVariantId(productId);
  
  if (!luxuryPackagingVariantId && shouldAdd) {
    console.warn('⚠️ Luxury packaging product ID not configured');
    return;
  }

  const luxuryPackagingLine = cartLines.find(line => 
    line.merchandise?.id === luxuryPackagingVariantId
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
          merchandiseId: luxuryPackagingVariantId,
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

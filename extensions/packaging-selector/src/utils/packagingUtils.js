/**
 * Packaging cart attribute — sets packaging for whichever option is selected.
 */

/**
 * @param {string} option - signature | gift-bag | luxury-packaging
 * @param {Function} applyAttributeChange
 * @param {{ signature: string, giftBag: string, luxury: string }} attributeValues
 */
export const handlePackagingChange = async (
  option,
  applyAttributeChange,
  attributeValues,
) => {
  const valueByOption = {
    signature: attributeValues.signature,
    'gift-bag': attributeValues.giftBag,
    'luxury-packaging': attributeValues.luxury,
  };

  const packagingValue = valueByOption[option];

  if (!packagingValue) {
    return;
  }

  try {
    const result = await applyAttributeChange({
      type: 'updateAttribute',
      key: 'packaging',
      value: packagingValue,
    });

    if (result.type === 'error') {
      console.error('❌ Error updating packaging attribute:', result.message);
    }
  } catch (error) {
    console.error('❌ Error updating packaging attribute:', error);
  }
};

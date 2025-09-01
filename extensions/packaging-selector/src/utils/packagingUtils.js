/**
 * Packaging utility functions
 */

/**
 * Handles packaging option changes and updates cart attributes
 * @param {string} value - The selected packaging option
 * @param {Function} applyAttributeChange - Function to apply attribute changes
 * @param {Array} attributes - Current cart attributes to check if packaging exists
 */
export const handlePackagingChange = async (value, applyAttributeChange, attributes = []) => {  
  if (value === 'signature') {
    try {
      const result = await applyAttributeChange({
        type: 'updateAttribute',
        key: 'packaging',
        value: 'Signature',
      });

      if (result.type === 'error') {
        console.error('❌ Error updating attribute:', result.message);
      }
    } catch (error) {
      console.error('❌ Error:', error);
    }
  } else {
    // Only remove packaging attribute if it exists
    const packagingAttribute = attributes.find(attr => attr.key === 'packaging');
    
    if (packagingAttribute) {
      try {
        const result = await applyAttributeChange({
          type: 'removeAttribute',
          key: 'packaging',
        });

        if (result.type === 'error') {
          console.error('❌ Error removing attribute:', result.message);
        }
      } catch (error) {
        console.error('❌ Error:', error);
      }
    }
  }
};

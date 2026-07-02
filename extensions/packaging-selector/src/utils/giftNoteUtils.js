/**
 * Gift note cart attribute helpers.
 *
 * - Keys: gift_note, gift_message (cart attributes → order additional details)
 * - Checked gift_note value (update GIFT_NOTE_CHECKED_VALUE if not "Yes")
 * - Empty gift_message: removed vs stored as empty string
 * - Unchecked: attributes removed (adjust removeAttributeIfPresent if different)
 */

export const GIFT_NOTE_ATTR = 'gift_note';
export const GIFT_MESSAGE_ATTR = 'gift_message';
export const GIFT_MESSAGE_MAX_LENGTH = 200;

/** Checked value for gift_note — confirm from Checkout Blocks order */
export const GIFT_NOTE_CHECKED_VALUE = 'Yes';

/**
 * @param {string | undefined} value
 * @param {string} [checkedValue]
 */
export function isGiftNoteChecked(value, checkedValue = GIFT_NOTE_CHECKED_VALUE) {
  return value === checkedValue;
}

/**
 * @param {Function} applyAttributeChange
 * @param {Array} attributes
 * @param {string} key
 */
async function removeAttributeIfPresent(applyAttributeChange, attributes, key) {
  if (!attributes.find((attr) => attr.key === key)) {
    return;
  }

  try {
    const result = await applyAttributeChange({
      type: 'removeAttribute',
      key,
    });

    if (result.type === 'error') {
      console.error(`❌ Error removing ${key} attribute:`, result.message);
    }
  } catch (error) {
    console.error(`❌ Error removing ${key} attribute:`, error);
  }
}

/**
 * @param {boolean} checked
 * @param {Function} applyAttributeChange
 * @param {Array} attributes
 * @param {string} [checkedValue]
 */
export async function handleGiftNoteToggle(
  checked,
  applyAttributeChange,
  attributes = [],
  checkedValue = GIFT_NOTE_CHECKED_VALUE,
) {
  if (checked) {
    try {
      const result = await applyAttributeChange({
        type: 'updateAttribute',
        key: GIFT_NOTE_ATTR,
        value: checkedValue,
      });

      if (result.type === 'error') {
        console.error('❌ Error updating gift_note attribute:', result.message);
      }
    } catch (error) {
      console.error('❌ Error updating gift_note attribute:', error);
    }

    return;
  }

  await removeAttributeIfPresent(applyAttributeChange, attributes, GIFT_NOTE_ATTR);
  await removeAttributeIfPresent(applyAttributeChange, attributes, GIFT_MESSAGE_ATTR);
}

/**
 * @param {string} message
 * @param {Function} applyAttributeChange
 * @param {Array} attributes
 */
export async function handleGiftMessageChange(
  message,
  applyAttributeChange,
  attributes = [],
) {
  const truncated = message.slice(0, GIFT_MESSAGE_MAX_LENGTH);

  if (!truncated) {
    await removeAttributeIfPresent(
      applyAttributeChange,
      attributes,
      GIFT_MESSAGE_ATTR,
    );
    return;
  }

  try {
    const result = await applyAttributeChange({
      type: 'updateAttribute',
      key: GIFT_MESSAGE_ATTR,
      value: truncated,
    });

    if (result.type === 'error') {
      console.error('❌ Error updating gift_message attribute:', result.message);
    }
  } catch (error) {
    console.error('❌ Error updating gift_message attribute:', error);
  }
}

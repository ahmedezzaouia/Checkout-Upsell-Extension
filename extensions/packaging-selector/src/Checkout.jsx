/**
 * Packaging selector checkout block — packaging options, gift bag/luxury upsells,
 * and gift order note. Orchestrates settings, cart state, and presentation components.
 */
import '@shopify/ui-extensions/preact';
import { render } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import {
  useApplyAttributeChange,
  useApplyCartLinesChange,
  useAttributes,
  useCartLines,
  useSettings,
} from '@shopify/ui-extensions/checkout/preact';
import { handlePackagingChange } from './utils/packagingUtils';
import { handleGiftBag } from './utils/giftUpsellUtils';
import { handleLuxuryPackaging } from './utils/luxuryUpsellUtils';
import {
  GIFT_MESSAGE_MAX_LENGTH,
  GIFT_NOTE_ATTR,
  GIFT_MESSAGE_ATTR,
  GIFT_NOTE_CHECKED_VALUE,
  isGiftNoteChecked,
  handleGiftNoteToggle,
  handleGiftMessageChange,
} from './utils/giftNoteUtils';
import {
  formatPackagingPrice,
  resolveVariantUnitPrice,
} from './utils/packagingPriceUtils';
import {
  IMAGE_ROW_COLUMNS,
  PackagingOptionImageColumn,
} from './components/PackagingOptionLightboxImage.jsx';
import {
  GiftBagQuantitySelector,
  ResponsiveTitleText,
  PackagingOptionRow,
} from './components/PackagingOptionRow.jsx';
import {
  OPTION_ROW_PADDING,
  OPTION_ROW_SPACING,
  STEPPER_TOP_SPACING,
  TITLE_BODY_SPACING,
} from './components/responsiveLayout.js';
import {
  GiftMessageHelperContent,
  OptionDescriptionContent,
  resolveDescriptionSetting,
} from './components/OptionDescriptionText.jsx';

const DEFAULT_IMAGE_URL =
  'https://images.unsplash.com/photo-1625908733875-efa9c75c084d';
const BLOCK_CORNER_RADIUS = 'none';
const DEFAULT_PACKAGING_OPTION = 'signature';

const GIFT_MESSAGE_HELP_TEXT =
  "Add a personal message to be printed on a seasonal card and included with your order. Or simply write BLANK if you'd prefer to write the message yourself. Emoji's are not recognised.";

const DEFAULT_SIGNATURE_DESCRIPTION =
  'Perfect for those self-purchases. Includes a reusable cotton pouch with every item, and a branded jewellery box. All orders come with our iconic DAISY TIMES newspaper.\n\nMultiple pieces will be packaged together unless this is a gift is selected.';

const DEFAULT_GIFT_BAG_DESCRIPTION =
  'For that “I’ll wrap it at home” moment. Includes everything in our standard packaging, plus a reusable large drawstring bag and branded gift bag, flat packed for you to finish off at home.\n\nIf your order contains gifts for multiple people, increase the quantity below.';

const DEFAULT_LUXURY_DESCRIPTION =
  'Perfect and ready to be gifted straight out the box, let us prepare it all. Includes everything in Daisy Signature, perfectly finished with a branded box ribbon, tissue paper and a jewellery polishing cloth.';

const DEFAULT_GIFT_DESCRIPTION =
  'Include a printed gift note with your order. Your gift will be packaged according to the option selected above, with your message printed on a seasonal branded gift card.';

export default async () => {
  render(<Extension />, document.body);
};

function Extension() {
  const applyAttributeChange = useApplyAttributeChange();
  const applyCartLinesChange = useApplyCartLinesChange();
  const attributes = useAttributes();
  const cartLines = useCartLines();
  const settings = useSettings();
  const { query, i18n } = shopify;

  const showStepper = true;

  const [selectedOption, setSelectedOption] = useState(DEFAULT_PACKAGING_OPTION);
  const [giftBagQuantity, setGiftBagQuantity] = useState(1);
  const [giftBagPrice, setGiftBagPrice] = useState(null);
  const [luxuryPrice, setLuxuryPrice] = useState(null);

  const giftBagVariantId = settings.checkbox2_product_id || '45978405044491';
  const luxuryVariantId = settings.checkbox3_product_id || '52053529886987';

  const signatureTitle = settings.checkbox1_title || 'Standard Packaging';
  const giftBagTitle = settings.checkbox2_title || 'Daisy Signature';
  const luxuryTitle = settings.checkbox3_title || 'Luxury Gift Wrap';

  const signaturePriceLabel = formatPackagingPrice(i18n, null);
  const giftBagPriceLabel = formatPackagingPrice(i18n, giftBagPrice);
  const luxuryPriceLabel = formatPackagingPrice(i18n, luxuryPrice);

  useEffect(() => {
    let cancelled = false;

    async function loadPackagingPrices() {
      const [giftBagUnitPrice, luxuryUnitPrice] = await Promise.all([
        resolveVariantUnitPrice(cartLines, query, giftBagVariantId),
        resolveVariantUnitPrice(cartLines, query, luxuryVariantId),
      ]);

      if (cancelled) {
        return;
      }

      setGiftBagPrice(giftBagUnitPrice);
      setLuxuryPrice(luxuryUnitPrice);
    }

    loadPackagingPrices();

    return () => {
      cancelled = true;
    };
  }, [cartLines, query, giftBagVariantId, luxuryVariantId]);

  useEffect(() => {
    applySelection(DEFAULT_PACKAGING_OPTION, 1);
  }, []);

  const applySelection = async (option, quantity = 1) => {
    await handlePackagingChange(option, applyAttributeChange, {
      signature: signatureTitle,
      giftBag: settings.checkbox2_value || giftBagTitle,
      luxury: settings.checkbox3_value || luxuryTitle,
    });
    await handleGiftBag(
      applyCartLinesChange,
      cartLines,
      option === 'gift-bag',
      quantity,
      giftBagVariantId,
    );
    await handleLuxuryPackaging(
      applyCartLinesChange,
      cartLines,
      option === 'luxury-packaging',
      1,
      luxuryVariantId,
    );
  };

  const handleOptionChange = async (value) => {
    setSelectedOption(value);
    setGiftBagQuantity(1);
    await applySelection(value, 1);
  };

  const handleStepperChange = async (quantity) => {
    setGiftBagQuantity(quantity);
    setSelectedOption('gift-bag');
    await applySelection('gift-bag', quantity);
  };

  const signatureDescription = resolveDescriptionSetting(
    settings.checkbox1_description,
    DEFAULT_SIGNATURE_DESCRIPTION,
  );
  const giftBagDescription = resolveDescriptionSetting(
    settings.checkbox2_description,
    DEFAULT_GIFT_BAG_DESCRIPTION,
  );
  const luxuryDescription = resolveDescriptionSetting(
    settings.checkbox3_description,
    DEFAULT_LUXURY_DESCRIPTION,
  );

  const giftNoteAttr = attributes.find((attr) => attr.key === GIFT_NOTE_ATTR);
  const giftMessageAttr = attributes.find(
    (attr) => attr.key === GIFT_MESSAGE_ATTR,
  );
  const giftNoteCheckedValue =
    settings.gift_note_value || GIFT_NOTE_CHECKED_VALUE;
  const isGift = isGiftNoteChecked(giftNoteAttr?.value, giftNoteCheckedValue);
  const [giftMessage, setGiftMessage] = useState(giftMessageAttr?.value ?? '');
  // Live character count — the text area change event only fires when editing
  // finishes (typically blur). input updates this without controlling the value.
  const [giftMessageLength, setGiftMessageLength] = useState(
    (giftMessageAttr?.value ?? '').length,
  );

  const giftImageSource = settings.gift_image_url || DEFAULT_IMAGE_URL;
  const giftTitle = settings.gift_title || 'This is a gift';
  const giftDescription = resolveDescriptionSetting(
    settings.gift_description,
    DEFAULT_GIFT_DESCRIPTION,
  );

  const handleGiftToggle = async (checked) => {
    if (!checked) {
      setGiftMessage('');
      setGiftMessageLength(0);
    }

    await handleGiftNoteToggle(
      checked,
      applyAttributeChange,
      attributes,
      giftNoteCheckedValue,
    );
  };

  const handleGiftMessageLiveInput = (value) => {
    setGiftMessageLength(
      value.slice(0, GIFT_MESSAGE_MAX_LENGTH).length,
    );
  };

  const handleGiftMessageCommit = async (value) => {
    const truncated = value.slice(0, GIFT_MESSAGE_MAX_LENGTH);

    setGiftMessage(truncated);
    setGiftMessageLength(truncated.length);
    await handleGiftMessageChange(truncated, applyAttributeChange, attributes);
  };

  return (
    <s-query-container>
      <s-stack gap="large-200">
        <s-stack gap="base">
          <s-heading>PACKAGING OPTIONS</s-heading>

          <s-box
            border="base"
            borderRadius={BLOCK_CORNER_RADIUS}
            overflow="hidden"
          >
            <s-box padding={OPTION_ROW_PADDING}>
              <PackagingOptionRow
                title={signatureTitle}
                price={signaturePriceLabel}
                selected={selectedOption === 'signature'}
                onSelect={() => handleOptionChange('signature')}
                imageSource={settings.checkbox1_image_url || DEFAULT_IMAGE_URL}
                imageAlt={signatureTitle}
                modalId="packaging-image-signature"
              >
                <OptionDescriptionContent
                  text={signatureDescription}
                  boldPhrase="this is a gift"
                />
              </PackagingOptionRow>
            </s-box>
            <s-divider />
            <s-box padding={OPTION_ROW_PADDING}>
              <PackagingOptionRow
                title={giftBagTitle}
                price={giftBagPriceLabel}
                selected={selectedOption === 'gift-bag'}
                onSelect={() => handleOptionChange('gift-bag')}
                imageSource={settings.checkbox2_image_url || DEFAULT_IMAGE_URL}
                imageAlt={giftBagTitle}
                modalId="packaging-image-gift-bag"
              >
                <s-stack gap={STEPPER_TOP_SPACING}>
                  <OptionDescriptionContent text={giftBagDescription} />
                  {showStepper && (
                    <GiftBagQuantitySelector
                      quantity={giftBagQuantity}
                      onChange={handleStepperChange}
                    />
                  )}
                </s-stack>
              </PackagingOptionRow>
            </s-box>
            <s-divider />
            <s-box padding={OPTION_ROW_PADDING}>
              <PackagingOptionRow
                title={luxuryTitle}
                price={luxuryPriceLabel}
                selected={selectedOption === 'luxury-packaging'}
                onSelect={() => handleOptionChange('luxury-packaging')}
                imageSource={settings.checkbox3_image_url || DEFAULT_IMAGE_URL}
                imageAlt={luxuryTitle}
                modalId="packaging-image-luxury"
              >
                <OptionDescriptionContent text={luxuryDescription} />
              </PackagingOptionRow>
            </s-box>
          </s-box>
        </s-stack>

        <s-stack gap="base">
          <s-heading>GIFT ORDERS</s-heading>

          <s-box
            border="base"
            borderRadius={BLOCK_CORNER_RADIUS}
            overflow="hidden"
          >
            <s-box padding={OPTION_ROW_PADDING}>
              <s-grid
                gridTemplateColumns={IMAGE_ROW_COLUMNS}
                alignItems="start"
                gap={OPTION_ROW_SPACING}
              >
                <s-grid
                  gridTemplateColumns="auto 1fr"
                  alignItems="start"
                  gap={OPTION_ROW_SPACING}
                >
                  <s-checkbox
                    checked={isGift}
                    onChange={(event) =>
                      handleGiftToggle(event.currentTarget.checked)
                    }
                    accessibilityLabel={giftTitle}
                  />
                  <s-stack gap={TITLE_BODY_SPACING}>
                    <s-clickable
                      onClick={() => handleGiftToggle(!isGift)}
                      accessibilityLabel={giftTitle}
                    >
                      <ResponsiveTitleText emphasis="bold">
                        {giftTitle}
                      </ResponsiveTitleText>
                    </s-clickable>
                    <OptionDescriptionContent text={giftDescription} />
                  </s-stack>
                </s-grid>
                <PackagingOptionImageColumn
                  source={giftImageSource}
                  alt={giftTitle}
                  modalId="packaging-image-gift-order"
                />
              </s-grid>
            </s-box>

            {isGift && (
              <s-box background="subdued" padding="base">
                <s-stack gap="base">
                  <GiftMessageHelperContent text={GIFT_MESSAGE_HELP_TEXT} />
                  <s-grid gridTemplateColumns="1fr auto" alignItems="center">
                    <GiftMessageHelperContent text="Gift Message (optional)" />
                    <GiftMessageHelperContent
                      text={`${giftMessageLength}/${GIFT_MESSAGE_MAX_LENGTH}`}
                    />
                  </s-grid>
                  <s-text-area
                    label="Gift Message (optional)"
                    labelAccessibilityVisibility="exclusive"
                    rows={4}
                    maxLength={GIFT_MESSAGE_MAX_LENGTH}
                    value={giftMessage}
                    onInput={(event) =>
                      handleGiftMessageLiveInput(event.currentTarget.value)
                    }
                    onChange={(event) =>
                      handleGiftMessageCommit(event.currentTarget.value)
                    }
                  />
                </s-stack>
              </s-box>
            )}
          </s-box>
        </s-stack>
      </s-stack>
    </s-query-container>
  );
}

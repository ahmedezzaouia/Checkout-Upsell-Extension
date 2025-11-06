import {
  reactExtension,
  Choice,
  ChoiceList,
  Icon,
  InlineStack,
  Stepper,
  Button,
  Pressable,
  useApplyAttributeChange,
  useApplyCartLinesChange,
  useAttributes,
  useCartLines,
  useSettings,
  Text,
  BlockStack,
  BlockSpacer,
  Image,
  InlineLayout,
  View,
} from '@shopify/ui-extensions-react/checkout';
import { useState, useEffect } from 'react';
import { handlePackagingChange } from './utils/packagingUtils';
import { handleGiftBag, handleGiftBagQuantityChange } from './utils/giftUpsellUtils';
import { handleLuxuryPackaging } from './utils/luxuryUpsellUtils';

export default reactExtension(
  'purchase.checkout.block.render',
  () => <Extension />
);

function Extension() {
  const applyAttributeChange = useApplyAttributeChange();
  const applyCartLinesChange = useApplyCartLinesChange();
  const attributes = useAttributes();
  const cartLines = useCartLines();
  const settings = useSettings();
  const DEFAULT_IMAGE_URL = "https://images.unsplash.com/photo-1625908733875-efa9c75c084d";

  const defaultValue = ['signature', 'gift-bag', 'luxury-packaging'][(settings.default_selected_option || 1) - 1];
  const imageColumnWidth = settings.image_column_width ? `${settings.image_column_width}%` : "22%";
  const showStepper = settings.checkbox2_show_stepper !== false;
  const useSquareImages = settings.use_square_images !== false;

  const [selectedOption, setSelectedOption] = useState(defaultValue);
  const [giftBagQuantity, setGiftBagQuantity] = useState(1);

  // Apply initial selection
  useEffect(() => {
    applySelection(defaultValue, 1);
  }, []);

  const applySelection = async (option, quantity = 1) => {
    await handlePackagingChange(option, applyAttributeChange, attributes, settings.checkbox1_value || 'Signature');
    await handleGiftBag(applyCartLinesChange, cartLines, option === 'gift-bag', quantity, settings.checkbox2_product_id || '45978405044491');
    await handleLuxuryPackaging(applyCartLinesChange, cartLines, option === 'luxury-packaging', 1, settings.checkbox3_product_id || '52053529886987');
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

  return (
    <ChoiceList name="group-single" value={selectedOption} onChange={handleOptionChange}>
      
      {/* Checkbox 1 - Signature Packaging */}
      <Choice id="signature" appearance="monochrome">
        <BlockStack spacing="none">
          <Text emphasis="bold">{settings.checkbox1_title || "Signature Packaging"}</Text>
          <Text appearance="subdued">
            {settings.checkbox1_description ||
              "Our premium packaging option. Each piece will be individually wrapped and presented in a signature gift box."}
          </Text>
        </BlockStack>
      </Choice>
      <BlockSpacer spacing="loose" />

      {/* Checkbox 2 - Gift Bag */}
      <Choice id="gift-bag" appearance="monochrome">
        <InlineLayout columns={[imageColumnWidth, "fill", "auto"]} spacing="base" blockAlignment="start">
          <Image
            source={settings.checkbox2_image_url || DEFAULT_IMAGE_URL}
            alt={settings.checkbox2_title || "Gift Bag"}
            {...(useSquareImages && { aspectRatio: "1" })}
            height={20}
            width={20}
            cornerRadius="base"
          />
          <BlockStack spacing="extraTight">
            <Text emphasis="bold">{settings.checkbox2_title || "Gift Bag"}</Text>
            <Text appearance="subdued">
              {settings.checkbox2_description || "A premium gift bag for your special items."}
            </Text>
            {showStepper && (
              <View border="base" cornerRadius="base" padding="extraTight" maxInlineSize={90}>
                <InlineStack spacing="tight" blockAlignment="center" inlineAlignment="center">
                  <Pressable
                    onPress={() => handleStepperChange(giftBagQuantity - 1)}
                    disabled={giftBagQuantity <= 1}
                  >
                    <View padding="none" minInlineSize={20} inlineAlignment="center">
                      <Text emphasis="bold">-</Text>
                    </View>
                  </Pressable>
                  <View minInlineSize={20} inlineAlignment="center">
                    <Text>{giftBagQuantity}</Text>
                  </View>
                  <Pressable
                    onPress={() => handleStepperChange(giftBagQuantity + 1)}
                    disabled={giftBagQuantity >= 10}
                  >
                    <View padding="none" minInlineSize={20} inlineAlignment="center">
                      <Text emphasis="bold">+</Text>
                    </View>
                  </Pressable>
                </InlineStack>
              </View>
            )}
          </BlockStack>
          <Text emphasis="bold">{settings.checkbox2_price || "£2"}</Text>
        </InlineLayout>
      </Choice>
      <BlockSpacer spacing="loose" />

      {/* Checkbox 3 - Luxury Packaging */}
      <Choice id="luxury-packaging" appearance="monochrome">
        <InlineLayout columns={[imageColumnWidth, "fill", "auto"]} spacing="base" blockAlignment="start">
          <Image
            source={settings.checkbox3_image_url || DEFAULT_IMAGE_URL}
            alt={settings.checkbox3_title || "Luxury Packaging"}
            {...(useSquareImages && { aspectRatio: "1" })}
            height={20}
            width={20}
            cornerRadius="base"
          />
          <BlockStack spacing="extraTight">
            <Text emphasis="bold">{settings.checkbox3_title || "Luxury Packaging"}</Text>
            <Text appearance="subdued">
              {settings.checkbox3_description ||
                "A hand-wrapped gift box, bag and polishing cloth - perfect for gifting."}
            </Text>
          </BlockStack>
          <Text emphasis="bold">{settings.checkbox3_price || "£5.00"}</Text>
        </InlineLayout>
      </Choice>
    </ChoiceList>
  );
}

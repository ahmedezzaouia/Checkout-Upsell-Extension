import {
  reactExtension,
  Choice,
  ChoiceList,
  Icon,
  InlineStack,
  Stepper,
  useApplyAttributeChange,
  useApplyCartLinesChange,
  useAttributes,
  useCartLines,
  Text,
  BlockStack,
  BlockSpacer,
  Image,
  InlineLayout,
  View,
} from '@shopify/ui-extensions-react/checkout';
import { useState } from 'react';
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
  
  // State to track stepper value
  const [giftBagQuantity, setGiftBagQuantity] = useState(1);

  const handleOptionChange = async (value) => {
    // Reset stepper to 1 when choice changes
    setGiftBagQuantity(1);
    
    // Handle packaging logic
    await handlePackagingChange(value, applyAttributeChange, attributes);

    // Handle upsell logic
    await handleGiftBag(applyCartLinesChange, cartLines, value === 'gift-bag', 1);
    await handleLuxuryPackaging(applyCartLinesChange, cartLines, value === 'luxury-packaging', 1);
  };

  const handleStepperChange = async (quantity) => {
    setGiftBagQuantity(quantity);
    await handleGiftBagQuantityChange(applyCartLinesChange, cartLines, quantity);
  };

  return (
    <ChoiceList name="group-single" value="" onChange={handleOptionChange}>
      <Choice id="signature" appearance="monochrome">
        <BlockStack spacing="none">
          <Text>Signature Packaging</Text>
          <Text appearance="subdued">Our premium packaging option. Each piece will be individually wrapped and presented in a signature gift box.</Text>
        </BlockStack>
      </Choice>
      <BlockSpacer spacing="loose" />
      <Choice id="gift-bag" appearance="monochrome">
        <InlineLayout columns={['22%', 'fill', 'auto']} spacing="base">
          <Image source="https://cdn.shopify.com/s/files/1/0343/0341/0315/files/daisy-stripe-tote-bag-bag-daisy-london-1175543728.jpg?v=1751027338" alt="Gift Bag" height={20} width={20} cornerRadius="base" />
          <BlockStack spacing="none">
            <Text>Gift Bag</Text>
            <Text appearance="subdued">A premium gift bag for your special items.</Text>
            <BlockSpacer spacing="tight" />
            <InlineStack>
              <Stepper label="" value={giftBagQuantity} min={1} max={10} onChange={handleStepperChange} />
            </InlineStack>
          </BlockStack>
          <Text emphasis>£1.50</Text>
        </InlineLayout>
      </Choice>
      <BlockSpacer spacing="loose" />
      <Choice id="luxury-packaging" appearance="monochrome">
        <InlineLayout columns={['22%', 'fill', 'auto']} spacing="base">
          <Image source="https://cdn.shopify.com/s/files/1/0343/0341/0315/files/luxury-packaging-daisy-london-32953122324619.jpg?v=1695909856" alt="Gift Bag" height={20} width={20} cornerRadius="base" />
          <BlockStack spacing="xtight">
            <Text>Luxury Packaging</Text>
            <Text appearance="subdued">A hand-wrapped gift box, bag and polishing cloth - perfect for gifting.</Text>
          </BlockStack>
          <Text emphasis>£5.00</Text>
        </InlineLayout>
      </Choice>
    </ChoiceList>
  );
}

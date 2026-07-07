import {
  Pressable,
  View,
  Text,
  Image,
  InlineLayout,
  InlineStack,
  BlockStack,
} from '@shopify/ui-extensions-react/checkout';
import { PackagingOptionLightboxImage } from './PackagingOptionLightboxImage.jsx';

/**
 * Option title — same size as body copy, bold when emphasised.
 * @param {{ children: import('react').ReactNode, emphasis?: 'bold' }} props
 */
export function ResponsiveTitleText({ children, emphasis }) {
  return (
    <Text
      size="small"
      emphasis={emphasis}
      accessibilityRole={emphasis === 'bold' ? 'strong' : undefined}
    >
      {children}
    </Text>
  );
}

/**
 * Option price — same size as body copy.
 * @param {{ children: import('react').ReactNode }} props
 */
export function ResponsivePriceText({ children }) {
  return (
    <Text size="small" emphasis="bold" accessibilityRole="strong">
      {children}
    </Text>
  );
}

const RADIO_SIZE = 20;
const BLOCK_CORNER_RADIUS = 'none';

/**
 * @param {string} svg
 * @returns {string}
 */
function svgDataUri(svg) {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const RADIO_SELECTED_SRC = svgDataUri(
  '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">' +
    '<circle cx="10" cy="10" r="10" fill="#000"/>' +
    '<circle cx="10" cy="10" r="3.5" fill="#fff"/>' +
    '</svg>',
);

const INACTIVE_STROKE = 'rgba(0,0,0,0.18)';

const RADIO_UNSELECTED_SRC = svgDataUri(
  '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">' +
    `<circle cx="10" cy="10" r="8.5" fill="none" stroke="${INACTIVE_STROKE}" stroke-width="1.5"/>` +
    '</svg>',
);

/**
 * Radio circle — selected: black fill with white dot; unselected: muted gray ring.
 * @param {{ selected: boolean }} props
 */
function PackagingRadioIndicator({ selected }) {
  return (
    <View
      minInlineSize={RADIO_SIZE}
      maxInlineSize={RADIO_SIZE}
      minBlockSize={RADIO_SIZE}
      maxBlockSize={RADIO_SIZE}
    >
      <Image
        source={selected ? RADIO_SELECTED_SRC : RADIO_UNSELECTED_SRC}
        accessibilityDescription=""
        aspectRatio={1}
        fit="contain"
      />
    </View>
  );
}

/**
 * Compact quantity selector for the Gift Bag packaging option.
 * @param {{ quantity: number, onChange: (quantity: number) => void }} props
 */
export function GiftBagQuantitySelector({ quantity, onChange }) {
  return (
    <View
      border="base"
      cornerRadius={BLOCK_CORNER_RADIUS}
      padding="extraTight"
      maxInlineSize={80}
    >
      <InlineStack
        spacing="tight"
        blockAlignment="center"
        inlineAlignment="center"
      >
        <Pressable
          onPress={() => onChange(quantity - 1)}
          disabled={quantity <= 1}
        >
          <View
            padding="none"
            minInlineSize={18}
            maxInlineSize={18}
            minBlockSize={18}
            inlineAlignment="center"
          >
            <Text size="small" emphasis="bold" accessibilityRole="strong">
              -
            </Text>
          </View>
        </Pressable>
        <View
          minInlineSize={18}
          maxInlineSize={18}
          minBlockSize={18}
          inlineAlignment="center"
        >
          <Text size="small">{quantity}</Text>
        </View>
        <Pressable
          onPress={() => onChange(quantity + 1)}
          disabled={quantity >= 10}
        >
          <View
            padding="none"
            minInlineSize={18}
            maxInlineSize={18}
            minBlockSize={18}
            inlineAlignment="center"
          >
            <Text size="small" emphasis="bold" accessibilityRole="strong">
              +
            </Text>
          </View>
        </Pressable>
      </InlineStack>
    </View>
  );
}

/**
 * Single packaging option row — radio left, title + description share one text column.
 * @param {{
 *   title: string,
 *   price?: string,
 *   selected: boolean,
 *   onSelect: () => void,
 *   imageSource: string,
 *   imageAlt: string,
 *   modalId: string,
 *   children: import('react').ReactNode,
 * }} props
 */
export function PackagingOptionRow({
  title,
  price,
  selected,
  onSelect,
  imageSource,
  imageAlt,
  modalId,
  children,
}) {
  const selectionLabel = `${title}, ${selected ? 'selected' : 'not selected'}`;

  return (
    <InlineLayout
      columns={['fill', 'auto']}
      blockAlignment="start"
      spacing="loose"
    >
      <InlineLayout
        columns={['auto', 'fill']}
        blockAlignment="start"
        spacing="loose"
      >
        <Pressable
          onPress={onSelect}
          accessibilityLabel={selectionLabel}
        >
          <PackagingRadioIndicator selected={selected} />
        </Pressable>
        <BlockStack spacing="base">
          <InlineLayout
            columns={['fill', 'auto']}
            blockAlignment="start"
            spacing="base"
          >
            <Pressable onPress={onSelect} accessibilityLabel={title}>
              <ResponsiveTitleText emphasis="bold">{title}</ResponsiveTitleText>
            </Pressable>
            {price && <ResponsivePriceText>{price}</ResponsivePriceText>}
          </InlineLayout>
          {children}
        </BlockStack>
      </InlineLayout>
      <PackagingOptionLightboxImage
        source={imageSource}
        alt={imageAlt}
        modalId={modalId}
      />
    </InlineLayout>
  );
}

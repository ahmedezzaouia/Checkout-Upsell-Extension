import {
  Pressable,
  View,
  Text,
  Image,
  InlineLayout,
  InlineStack,
  BlockStack,
} from '@shopify/ui-extensions-react/checkout';
import { PackagingOptionImageColumn } from './PackagingOptionLightboxImage.jsx';
import {
  DESKTOP_ONLY_DISPLAY,
  MOBILE_ONLY_DISPLAY,
  OPTION_ROW_SPACING,
  TITLE_BODY_SPACING,
} from './responsiveLayout.js';

const MOBILE_BODY_TEXT_SIZE = 'extraSmall';
const OPTION_TEXT_SIZE = 'small';

/**
 * Option title — stays small on all viewports for hierarchy over body copy.
 * @param {{ children: import('react').ReactNode, emphasis?: 'bold' }} props
 */
export function ResponsiveTitleText({ children, emphasis }) {
  return (
    <Text
      size={OPTION_TEXT_SIZE}
      emphasis={emphasis}
      accessibilityRole={emphasis === 'bold' ? 'strong' : undefined}
    >
      {children}
    </Text>
  );
}

/**
 * Option price — same size as title on all viewports.
 * @param {{ children: import('react').ReactNode }} props
 */
export function ResponsivePriceText({ children }) {
  return (
    <Text size={OPTION_TEXT_SIZE} emphasis="bold" accessibilityRole="strong">
      {children}
    </Text>
  );
}

/**
 * Stepper label — matches compact body text on mobile.
 * @param {{ children: import('react').ReactNode, emphasis?: 'bold' }} props
 */
function ResponsiveStepperText({ children, emphasis }) {
  return (
    <>
      <View display={MOBILE_ONLY_DISPLAY}>
        <Text
          size={MOBILE_BODY_TEXT_SIZE}
          emphasis={emphasis}
          accessibilityRole={emphasis === 'bold' ? 'strong' : undefined}
        >
          {children}
        </Text>
      </View>
      <View display={DESKTOP_ONLY_DISPLAY}>
        <Text
          size={OPTION_TEXT_SIZE}
          emphasis={emphasis}
          accessibilityRole={emphasis === 'bold' ? 'strong' : undefined}
        >
          {children}
        </Text>
      </View>
    </>
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
            <ResponsiveStepperText emphasis="bold">-</ResponsiveStepperText>
          </View>
        </Pressable>
        <View
          minInlineSize={18}
          maxInlineSize={18}
          minBlockSize={18}
          inlineAlignment="center"
        >
          <ResponsiveStepperText>{quantity}</ResponsiveStepperText>
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
            <ResponsiveStepperText emphasis="bold">+</ResponsiveStepperText>
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
      spacing={OPTION_ROW_SPACING}
    >
      <InlineLayout
        columns={['auto', 'fill']}
        blockAlignment="start"
        spacing={OPTION_ROW_SPACING}
      >
        <Pressable
          onPress={onSelect}
          accessibilityLabel={selectionLabel}
        >
          <PackagingRadioIndicator selected={selected} />
        </Pressable>
        <BlockStack spacing={TITLE_BODY_SPACING}>
          <InlineLayout
            columns={['fill', 'auto']}
            blockAlignment="baseline"
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
      <PackagingOptionImageColumn
        source={imageSource}
        alt={imageAlt}
        modalId={modalId}
      />
    </InlineLayout>
  );
}

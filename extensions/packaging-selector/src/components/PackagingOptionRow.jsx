import {
  Pressable,
  View,
  Text,
  Image,
  InlineLayout,
  InlineStack,
  BlockStack,
  Style,
} from '@shopify/ui-extensions-react/checkout';
import { PackagingOptionLightboxImage } from './PackagingOptionLightboxImage.jsx';
import { splitDescriptionParagraphs } from './OptionDescriptionText.jsx';

const MOBILE_ONLY_DISPLAY = Style.default('auto').when(
  { viewportInlineSize: { min: 'medium' } },
  'none',
);

const DESKTOP_ONLY_DISPLAY = Style.default('none').when(
  { viewportInlineSize: { min: 'medium' } },
  'auto',
);

/**
 * Option title — small on mobile, medium on desktop.
 * @param {{ children: import('react').ReactNode, emphasis?: 'bold' }} props
 */
export function ResponsiveTitleText({ children, emphasis }) {
  return (
    <>
      <View display={MOBILE_ONLY_DISPLAY}>
        <Text
          size="small"
          emphasis={emphasis}
          accessibilityRole={emphasis === 'bold' ? 'strong' : undefined}
        >
          {children}
        </Text>
      </View>
      <View display={DESKTOP_ONLY_DISPLAY}>
        <Text
          size="medium"
          emphasis={emphasis}
          accessibilityRole={emphasis === 'bold' ? 'strong' : undefined}
        >
          {children}
        </Text>
      </View>
    </>
  );
}

/**
 * Option price — small on mobile, medium on desktop.
 * @param {{ children: import('react').ReactNode }} props
 */
export function ResponsivePriceText({ children }) {
  return (
    <>
      <View display={MOBILE_ONLY_DISPLAY}>
        <Text size="small" emphasis="bold" accessibilityRole="strong">
          {children}
        </Text>
      </View>
      <View display={DESKTOP_ONLY_DISPLAY}>
        <Text size="medium" emphasis="bold" accessibilityRole="strong">
          {children}
        </Text>
      </View>
    </>
  );
}

const RADIO_SIZE = 20;
const BLOCK_CORNER_RADIUS = 'none';

/** Approximate line height for small description TextBlock */
const DESCRIPTION_LINE_HEIGHT = 18;

/** BlockSpacer spacing="base" between paragraphs */
const PARAGRAPH_GAP_SIZE = 14;

/** BlockSpacer + quantity stepper on the gift bag row */
const STEPPER_BLOCK_SIZE = 40;

/**
 * @param {string} paragraph
 * @param {boolean} isWide
 * @returns {number}
 */
function countParagraphLines(paragraph, isWide) {
  const charsPerLine = isWide ? 62 : 46;

  return Math.max(1, Math.ceil(paragraph.length / charsPerLine));
}

/**
 * @param {string} text
 * @param {boolean} includeStepper
 * @param {boolean} isWide
 * @returns {number}
 */
function estimateDescriptionBlockSize(text, includeStepper, isWide) {
  const paragraphs = splitDescriptionParagraphs(text);

  if (paragraphs.length === 0) {
    return 0;
  }

  const textHeight = paragraphs.reduce((total, paragraph, index) => {
    const paragraphGap = index > 0 ? PARAGRAPH_GAP_SIZE : 0;
    const lines = countParagraphLines(paragraph, isWide);

    return total + paragraphGap + lines * DESCRIPTION_LINE_HEIGHT;
  }, 0);

  return textHeight + (includeStepper ? STEPPER_BLOCK_SIZE : 0);
}

/**
 * Shared min height so every packaging row matches the tallest content area.
 * Stepper space is only included for the row that renders the stepper.
 * @param {string[]} descriptions
 * @param {{ showStepper: boolean, stepperIndex: number }} options
 */
export function getSharedDescriptionBlockSize(
  descriptions,
  { showStepper, stepperIndex },
) {
  return Style.default(
    Math.max(
      ...descriptions.map((text, index) =>
        estimateDescriptionBlockSize(
          text,
          showStepper && index === stepperIndex,
          false,
        ),
      ),
    ),
  ).when(
    { viewportInlineSize: { min: 'medium' } },
    Math.max(
      ...descriptions.map((text, index) =>
        estimateDescriptionBlockSize(
          text,
          showStepper && index === stepperIndex,
          true,
        ),
      ),
    ),
  );
}

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
 * Description area below the title row — equal height across packaging options.
 * @param {{
 *   children: import('react').ReactNode,
 *   minBlockSize: number | ReturnType<typeof Style.default>,
 * }} props
 */
export function PackagingOptionDescription({ children, minBlockSize }) {
  return (
    <View minBlockSize={minBlockSize}>
      <BlockStack spacing="none">{children}</BlockStack>
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
            <ResponsiveTitleText emphasis="bold">-</ResponsiveTitleText>
          </View>
        </Pressable>
        <View
          minInlineSize={18}
          maxInlineSize={18}
          minBlockSize={18}
          inlineAlignment="center"
        >
          <ResponsiveTitleText>{quantity}</ResponsiveTitleText>
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
            <ResponsiveTitleText emphasis="bold">+</ResponsiveTitleText>
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
      spacing="base"
    >
      <InlineLayout
        columns={['auto', 'fill']}
        blockAlignment="start"
        spacing="base"
      >
        <Pressable
          onPress={onSelect}
          accessibilityLabel={selectionLabel}
        >
          <PackagingRadioIndicator selected={selected} />
        </Pressable>
        <BlockStack spacing="tight">
          <InlineLayout
            columns={['fill', 'auto']}
            blockAlignment="center"
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

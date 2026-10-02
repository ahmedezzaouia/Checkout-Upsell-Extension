import {
  IMAGE_ROW_COLUMNS,
  PackagingOptionImageColumn,
} from './PackagingOptionLightboxImage.jsx';
import {
  OPTION_ROW_SPACING,
  TITLE_BODY_SPACING,
} from './responsiveLayout.js';

const OPTION_TEXT_TYPE = 'small';

/**
 * Option title — stays small on all viewports for hierarchy over body copy.
 * @param {{ children: import('preact').ComponentChildren, emphasis?: 'bold' }} props
 */
export function ResponsiveTitleText({ children, emphasis }) {
  return (
    <s-paragraph type={OPTION_TEXT_TYPE}>
      {emphasis === 'bold' ? <s-text type="strong">{children}</s-text> : children}
    </s-paragraph>
  );
}

/**
 * Option price — same size as title on all viewports.
 * @param {{ children: import('preact').ComponentChildren }} props
 */
export function ResponsivePriceText({ children }) {
  return <ResponsiveTitleText emphasis="bold">{children}</ResponsiveTitleText>;
}

/**
 * Stepper label — same small text as option titles.
 * @param {{ children: import('preact').ComponentChildren, emphasis?: 'bold' }} props
 */
function ResponsiveStepperText({ children, emphasis }) {
  return (
    <ResponsiveTitleText emphasis={emphasis}>{children}</ResponsiveTitleText>
  );
}

const RADIO_SIZE = '20px';
const STEPPER_CELL_SIZE = '18px';
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
    <s-box
      minInlineSize={RADIO_SIZE}
      maxInlineSize={RADIO_SIZE}
      minBlockSize={RADIO_SIZE}
      maxBlockSize={RADIO_SIZE}
    >
      <s-image
        src={selected ? RADIO_SELECTED_SRC : RADIO_UNSELECTED_SRC}
        alt=""
        aspectRatio="1"
        objectFit="contain"
      />
    </s-box>
  );
}

/**
 * Fixed-size centered cell for stepper symbols and quantity.
 * @param {{ children: import('preact').ComponentChildren }} props
 */
function StepperCell({ children }) {
  return (
    <s-stack
      minInlineSize={STEPPER_CELL_SIZE}
      maxInlineSize={STEPPER_CELL_SIZE}
      minBlockSize={STEPPER_CELL_SIZE}
      alignItems="center"
    >
      {children}
    </s-stack>
  );
}

/**
 * Compact quantity selector for the Gift Bag packaging option.
 * @param {{ quantity: number, onChange: (quantity: number) => void }} props
 */
export function GiftBagQuantitySelector({ quantity, onChange }) {
  return (
    <s-box
      border="base"
      borderRadius={BLOCK_CORNER_RADIUS}
      padding="small-400"
      maxInlineSize="80px"
    >
      <s-stack
        direction="inline"
        gap="small-200"
        alignItems="center"
        justifyContent="center"
      >
        <s-clickable
          onClick={() => onChange(quantity - 1)}
          disabled={quantity <= 1}
        >
          <StepperCell>
            <ResponsiveStepperText emphasis="bold">-</ResponsiveStepperText>
          </StepperCell>
        </s-clickable>
        <StepperCell>
          <ResponsiveStepperText>{quantity}</ResponsiveStepperText>
        </StepperCell>
        <s-clickable
          onClick={() => onChange(quantity + 1)}
          disabled={quantity >= 10}
        >
          <StepperCell>
            <ResponsiveStepperText emphasis="bold">+</ResponsiveStepperText>
          </StepperCell>
        </s-clickable>
      </s-stack>
    </s-box>
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
 *   children: import('preact').ComponentChildren,
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
        <s-clickable
          onClick={onSelect}
          accessibilityLabel={selectionLabel}
        >
          <PackagingRadioIndicator selected={selected} />
        </s-clickable>
        <s-stack gap={TITLE_BODY_SPACING}>
          <s-grid
            gridTemplateColumns="1fr auto"
            alignItems="baseline"
            gap="base"
          >
            <s-clickable onClick={onSelect} accessibilityLabel={title}>
              <ResponsiveTitleText emphasis="bold">{title}</ResponsiveTitleText>
            </s-clickable>
            {price && <ResponsivePriceText>{price}</ResponsivePriceText>}
          </s-grid>
          {children}
        </s-stack>
      </s-grid>
      <PackagingOptionImageColumn
        source={imageSource}
        alt={imageAlt}
        modalId={modalId}
      />
    </s-grid>
  );
}

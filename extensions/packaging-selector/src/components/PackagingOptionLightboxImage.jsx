/**
 * Square packaging thumbnail with Modal lightbox (image-only overlay).
 */
import { responsive } from './responsiveLayout.js';

const BLOCK_CORNER_RADIUS = 'none';

/**
 * Content + image columns. The image track width sets the square thumbnail
 * size (min/max size props don't accept container queries, grid tracks do).
 * Mobile slightly larger for visual weight; desktop unchanged at 107px.
 */
export const IMAGE_ROW_COLUMNS = responsive("'1fr 107px'", "'1fr 102px'");

/**
 * Top-aligned image column — fills the image track of IMAGE_ROW_COLUMNS.
 * @param {{ source: string, alt: string, modalId: string }} props
 */
export function PackagingOptionImageColumn({ source, alt, modalId }) {
  return (
    <s-box>
      <PackagingOptionLightboxImage
        source={source}
        alt={alt}
        modalId={modalId}
      />
    </s-box>
  );
}

/**
 * Square packaging thumbnail that opens a larger image in a Shopify Modal overlay.
 * @param {{ source: string, alt: string, modalId: string }} props
 */
export function PackagingOptionLightboxImage({ source, alt, modalId }) {
  return (
    <>
      <s-clickable
        command="--show"
        commandFor={modalId}
        accessibilityLabel={`View larger image: ${alt}`}
        inlineSize="100%"
      >
        <s-image
          src={source}
          alt={alt}
          aspectRatio="1"
          objectFit="cover"
          borderRadius={BLOCK_CORNER_RADIUS}
        />
      </s-clickable>
      <s-modal
        id={modalId}
        accessibilityLabel={`Enlarged image: ${alt}`}
        size="max"
        padding="none"
      >
        <s-image
          src={source}
          alt={alt}
          objectFit="contain"
          aspectRatio="1"
          loading="eager"
        />
      </s-modal>
    </>
  );
}

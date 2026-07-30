/**
 * Square packaging thumbnail with Modal lightbox (image-only overlay).
 */
import {
  Pressable,
  Modal,
  View,
  Image,
  Style,
} from '@shopify/ui-extensions-react/checkout';

const BLOCK_CORNER_RADIUS = 'none';

/** Mobile slightly larger for visual weight; desktop unchanged at 107px */
export const PACKAGING_IMAGE_BLOCK_SIZE = Style.default(102).when(
  { viewportInlineSize: { min: 'medium' } },
  107,
);

/**
 * Top-aligned image column — fixed block size keeps the thumbnail aligned with the title row.
 * @param {{ source: string, alt: string, modalId: string }} props
 */
export function PackagingOptionImageColumn({ source, alt, modalId }) {
  return (
    <View
      minBlockSize={PACKAGING_IMAGE_BLOCK_SIZE}
      maxBlockSize={PACKAGING_IMAGE_BLOCK_SIZE}
      inlineAlignment="end"
    >
      <PackagingOptionLightboxImage
        source={source}
        alt={alt}
        modalId={modalId}
      />
    </View>
  );
}

/**
 * Square packaging thumbnail that opens a larger image in a Shopify Modal overlay.
 * @param {{ source: string, alt: string, modalId: string }} props
 */
export function PackagingOptionLightboxImage({ source, alt, modalId }) {
  return (
    <Pressable
      accessibilityLabel={`View larger image: ${alt}`}
      overlay={
        <Modal
          id={modalId}
          accessibilityLabel={`Enlarged image: ${alt}`}
          size="max"
          padding={false}
        >
          <Image
            source={source}
            accessibilityDescription={alt}
            fit="contain"
            aspectRatio={1}
            loading="eager"
          />
        </Modal>
      }
    >
      <View
        minInlineSize={PACKAGING_IMAGE_BLOCK_SIZE}
        maxInlineSize={PACKAGING_IMAGE_BLOCK_SIZE}
        minBlockSize={PACKAGING_IMAGE_BLOCK_SIZE}
        maxBlockSize={PACKAGING_IMAGE_BLOCK_SIZE}
        cornerRadius={BLOCK_CORNER_RADIUS}
        overflow="hidden"
      >
        <Image
          source={source}
          alt={alt}
          aspectRatio={1}
          fit="cover"
          cornerRadius={BLOCK_CORNER_RADIUS}
        />
      </View>
    </Pressable>
  );
}

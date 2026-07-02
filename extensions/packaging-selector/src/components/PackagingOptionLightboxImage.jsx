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

/** Mobile ~73.5px, desktop ~107px per Mejuri reference */
const PACKAGING_IMAGE_SIZE = Style.default(74).when(
  { viewportInlineSize: { min: 'medium' } },
  107,
);

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
        minInlineSize={PACKAGING_IMAGE_SIZE}
        maxInlineSize={PACKAGING_IMAGE_SIZE}
        minBlockSize={PACKAGING_IMAGE_SIZE}
        maxBlockSize={PACKAGING_IMAGE_SIZE}
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

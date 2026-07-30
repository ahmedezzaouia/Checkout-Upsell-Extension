import { Fragment } from 'react';
import {
  View,
  TextBlock,
  Text,
  BlockStack,
  BlockSpacer,
} from '@shopify/ui-extensions-react/checkout';
import {
  DESKTOP_ONLY_DISPLAY,
  MOBILE_ONLY_DISPLAY,
  PARAGRAPH_SPACING,
} from './responsiveLayout.js';

const MOBILE_DESCRIPTION_SIZE = 'extraSmall';
const DESKTOP_DESCRIPTION_SIZE = 'small';

/**
 * Normalizes setting copy from the checkout editor.
 * @param {string} text
 * @returns {string}
 */
function normalizeDescriptionText(text) {
  return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
}

/**
 * Collapses soft line wraps inside a paragraph into one line.
 * @param {string} paragraph
 * @returns {string}
 */
function collapseParagraphLines(paragraph) {
  return paragraph.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Splits multi-line setting copy into paragraphs.
 * Blank lines separate paragraphs; a single line break also starts a new paragraph.
 * @param {string} text
 * @returns {string[]}
 */
export function splitDescriptionParagraphs(text) {
  if (!text?.trim()) {
    return [];
  }

  const normalized = normalizeDescriptionText(text);

  const blankLineParagraphs = normalized
    .split(/\n{2,}/)
    .map(collapseParagraphLines)
    .filter(Boolean);

  if (blankLineParagraphs.length > 1) {
    return blankLineParagraphs;
  }

  const lineParagraphs = normalized
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  if (lineParagraphs.length > 1) {
    return lineParagraphs;
  }

  if (blankLineParagraphs.length === 1) {
    return blankLineParagraphs;
  }

  return lineParagraphs;
}

/**
 * @param {string | undefined} settingValue
 * @param {string} defaultValue
 * @returns {string}
 */
export function resolveDescriptionSetting(settingValue, defaultValue) {
  const value = settingValue?.trim();

  return value || defaultValue;
}

/**
 * @param {string} paragraph
 * @param {string | undefined} boldPhrase
 * @param {'extraSmall' | 'small'} size
 * @returns {import('react').ReactNode}
 */
function renderParagraphWithBoldPhrase(paragraph, boldPhrase, size) {
  if (!boldPhrase || !paragraph.includes(boldPhrase)) {
    return paragraph;
  }

  const parts = paragraph.split(boldPhrase);

  return parts.reduce((nodes, part, index) => {
    if (part) {
      nodes.push(part);
    }

    if (index < parts.length - 1) {
      nodes.push(
        <Text
          key={`emphasis-${index}`}
          size={size}
          appearance="subdued"
          emphasis="bold"
          accessibilityRole="strong"
        >
          {boldPhrase}
        </Text>,
      );
    }

    return nodes;
  }, []);
}

/**
 * Description copy — subdued grey body text, one size step smaller on mobile.
 * @param {{ children: import('react').ReactNode, size: 'extraSmall' | 'small' }} props
 */
function OptionDescriptionText({ children, size }) {
  return (
    <TextBlock size={size} appearance="subdued">
      {children}
    </TextBlock>
  );
}

/**
 * Renders a setting description with paragraph breaks from the editor.
 * @param {{ text: string, boldPhrase?: string }} props
 */
export function OptionDescriptionContent({ text, boldPhrase }) {
  const paragraphs = splitDescriptionParagraphs(text);

  if (paragraphs.length === 0) {
    return null;
  }

  return (
    <BlockStack spacing="none">
      {paragraphs.map((paragraph, index) => (
        <Fragment key={index}>
          {index > 0 && <BlockSpacer spacing={PARAGRAPH_SPACING} />}
          <View display={MOBILE_ONLY_DISPLAY} opacity={90}>
            <OptionDescriptionText size={MOBILE_DESCRIPTION_SIZE}>
              {renderParagraphWithBoldPhrase(
                paragraph,
                boldPhrase,
                MOBILE_DESCRIPTION_SIZE,
              )}
            </OptionDescriptionText>
          </View>
          <View display={DESKTOP_ONLY_DISPLAY}>
            <OptionDescriptionText size={DESKTOP_DESCRIPTION_SIZE}>
              {renderParagraphWithBoldPhrase(
                paragraph,
                boldPhrase,
                DESKTOP_DESCRIPTION_SIZE,
              )}
            </OptionDescriptionText>
          </View>
        </Fragment>
      ))}
    </BlockStack>
  );
}

/**
 * Helper copy inside the expanded gift message panel.
 * @param {{ text: string }} props
 */
export function GiftMessageHelperContent({ text }) {
  return <OptionDescriptionContent text={text} />;
}

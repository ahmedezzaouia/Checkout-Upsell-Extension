import { PARAGRAPH_SPACING } from './responsiveLayout.js';

/** Smallest paragraph type available in Polaris web components */
const DESCRIPTION_TYPE = 'small';

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
 * @returns {import('preact').ComponentChildren}
 */
function renderParagraphWithBoldPhrase(paragraph, boldPhrase) {
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
        <s-text
          key={`emphasis-${index}`}
          type="strong"
          color="subdued"
        >
          {boldPhrase}
        </s-text>,
      );
    }

    return nodes;
  }, []);
}

/**
 * Description copy — subdued grey small body text.
 * @param {{ children: import('preact').ComponentChildren }} props
 */
function OptionDescriptionText({ children }) {
  return (
    <s-paragraph type={DESCRIPTION_TYPE} color="subdued">
      {children}
    </s-paragraph>
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
    <s-stack gap={PARAGRAPH_SPACING}>
      {paragraphs.map((paragraph, index) => (
        <OptionDescriptionText key={index}>
          {renderParagraphWithBoldPhrase(paragraph, boldPhrase)}
        </OptionDescriptionText>
      ))}
    </s-stack>
  );
}

/**
 * Helper copy inside the expanded gift message panel.
 * @param {{ text: string }} props
 */
export function GiftMessageHelperContent({ text }) {
  return <OptionDescriptionContent text={text} />;
}

/**
 * Packaging option price helpers — cart line prices with Storefront API fallback.
 */

const VARIANT_PRICE_QUERY = `
  query PackagingVariantPrice($id: ID!) {
    node(id: $id) {
      ... on ProductVariant {
        price {
          amount
          currencyCode
        }
      }
    }
  }
`;

/**
 * @param {string | null | undefined} productId
 * @returns {string | null}
 */
export function toVariantGid(productId) {
  if (!productId) {
    return null;
  }

  if (productId.startsWith('gid://shopify/ProductVariant/')) {
    return productId;
  }

  return `gid://shopify/ProductVariant/${productId}`;
}

/**
 * @param {Array} cartLines
 * @param {string | null} variantId
 * @returns {{ amount: number, currencyCode: string } | null}
 */
export function getUnitPriceFromCartLine(cartLines, variantId) {
  if (!variantId) {
    return null;
  }

  const line = cartLines.find((cartLine) => cartLine.merchandise?.id === variantId);

  if (!line?.cost?.totalAmount) {
    return null;
  }

  const quantity = line.quantity || 1;

  return {
    amount: line.cost.totalAmount.amount / quantity,
    currencyCode: line.cost.totalAmount.currencyCode,
  };
}

/**
 * @param {Function} query
 * @param {string | null} variantId
 * @returns {Promise<{ amount: number, currencyCode: string } | null>}
 */
export async function fetchVariantUnitPrice(query, variantId) {
  if (!variantId || !query) {
    return null;
  }

  try {
    const { data, errors } = await query(VARIANT_PRICE_QUERY, {
      variables: { id: variantId },
    });

    if (errors?.length) {
      console.error('❌ Error fetching variant price:', errors);
      return null;
    }

    const price = data?.node?.price;

    if (!price) {
      return null;
    }

    return {
      amount: Number(price.amount),
      currencyCode: price.currencyCode,
    };
  } catch (error) {
    console.error('❌ Error fetching variant price:', error);
    return null;
  }
}

/**
 * @param {import('@shopify/ui-extensions/checkout').I18n} i18n
 * @param {{ amount: number, currencyCode: string } | null | undefined} money
 * @param {string} [freeLabel]
 * @returns {string | undefined}
 */
export function formatPackagingPrice(i18n, money, freeLabel = 'FREE') {
  if (!money || money.amount === 0) {
    return freeLabel;
  }

  return i18n.formatCurrency(money.amount, {
    currency: money.currencyCode,
  });
}

/**
 * Prefer cart line unit price; fall back to Storefront API for display before add.
 * @param {Array} cartLines
 * @param {Function} query
 * @param {string | null | undefined} productId
 * @returns {Promise<{ amount: number, currencyCode: string } | null>}
 */
export async function resolveVariantUnitPrice(cartLines, query, productId) {
  const variantId = toVariantGid(productId);
  const fromCart = getUnitPriceFromCartLine(cartLines, variantId);

  if (fromCart) {
    return fromCart;
  }

  return fetchVariantUnitPrice(query, variantId);
}

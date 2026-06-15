/**
 * On-chain limits enforced by the Metaplex Token Metadata program. These are
 * byte limits, not character counts, and exceeding them fails the mint with a
 * custom program error (NameTooLong 0xb / SymbolTooLong 0xc / UriTooLong 0xd).
 *
 * The on-chain `name`/`symbol` are intentionally short identifiers. The full,
 * human-facing title lives in the off-chain metadata JSON (served by
 * /api/nft/metadata/[slug]), which has no length limit and is what wallets and
 * explorers display. So we truncate the on-chain name to fit while preserving
 * the complete title in the metadata.
 */
export const MAX_ONCHAIN_NAME_BYTES = 32
export const MAX_ONCHAIN_SYMBOL_BYTES = 10
export const MAX_ONCHAIN_URI_BYTES = 200

export function byteLength(value: string): number {
  return new TextEncoder().encode(value).length
}

/**
 * Truncates a string so its UTF-8 byte length does not exceed `maxBytes`,
 * dropping whole characters (never splitting a multi-byte char) and trimming
 * trailing whitespace left by the cut.
 */
export function truncateToBytes(value: string, maxBytes: number): string {
  if (byteLength(value) <= maxBytes) {
    return value
  }
  let truncated = value
  while (truncated.length > 0 && byteLength(truncated) > maxBytes) {
    truncated = truncated.slice(0, -1)
  }
  return truncated.trimEnd()
}

/**
 * True when a post title is too long to fit the on-chain name as-is and will be
 * shortened at mint time. Used to warn authors before they mint.
 */
export function willTruncateOnChainName(title: string): boolean {
  return byteLength(title) > MAX_ONCHAIN_NAME_BYTES
}

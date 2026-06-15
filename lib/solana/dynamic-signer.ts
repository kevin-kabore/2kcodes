import type { Signer, Transaction as UmiTransaction } from '@metaplex-foundation/umi'
import {
  fromWeb3JsPublicKey,
  fromWeb3JsTransaction,
  toWeb3JsTransaction,
} from '@metaplex-foundation/umi-web3js-adapters'
import {
  PublicKey as Web3PublicKey,
  type Transaction as Web3Transaction,
  type VersionedTransaction as Web3VersionedTransaction,
} from '@solana/web3.js'
import type { ISolana } from '@dynamic-labs/solana-core'

/**
 * Dynamic's `ISolana` is typed against a *nested* copy of @solana/web3.js, while
 * the umi web3.js adapters return the root copy's transaction types. They're
 * identical at runtime but nominally distinct to TypeScript, so we re-view the
 * wallet through an interface typed against the root web3.js to bridge the gap.
 */
type Web3SolanaSigner = {
  publicKey?: { toBytes(): Uint8Array }
  signMessage(message: Uint8Array): Promise<{ signature: Uint8Array }>
  signTransaction<T extends Web3Transaction | Web3VersionedTransaction>(
    transaction: T
  ): Promise<T>
  signAllTransactions<T extends Web3Transaction | Web3VersionedTransaction>(
    transactions: T[]
  ): Promise<T[]>
}

/**
 * Wraps a Dynamic Solana wallet (`ISolana`) as a umi `Signer` so Metaplex's
 * umi-based builders can use the connected browser wallet as the identity/payer.
 *
 * umi works with its own `Transaction`/`PublicKey` types, so we bridge through
 * the web3.js adapters: umi tx -> web3.js VersionedTransaction -> wallet signs ->
 * back to umi. The wallet popup is triggered by `signTransaction`.
 */
export function createDynamicUmiSigner(walletInput: ISolana): Signer {
  const wallet = walletInput as unknown as Web3SolanaSigner

  if (!wallet.publicKey) {
    throw new Error('Connected Solana wallet has no public key')
  }

  const umiPublicKey = fromWeb3JsPublicKey(
    new Web3PublicKey(wallet.publicKey.toBytes())
  )

  return {
    publicKey: umiPublicKey,

    async signMessage(message: Uint8Array): Promise<Uint8Array> {
      const { signature } = await wallet.signMessage(message)
      return signature
    },

    async signTransaction(transaction: UmiTransaction): Promise<UmiTransaction> {
      const web3Tx = toWeb3JsTransaction(transaction)
      const signed = await wallet.signTransaction(web3Tx)
      return fromWeb3JsTransaction(signed)
    },

    async signAllTransactions(
      transactions: UmiTransaction[]
    ): Promise<UmiTransaction[]> {
      const web3Txs = transactions.map(toWeb3JsTransaction)
      const signed = await wallet.signAllTransactions(web3Txs)
      return signed.map(fromWeb3JsTransaction)
    },
  }
}

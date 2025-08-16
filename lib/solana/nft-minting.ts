import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { 
  createNft, 
  mplTokenMetadata, 
  findMetadataPda
} from '@metaplex-foundation/mpl-token-metadata'
import { 
  generateSigner, 
  PublicKey as UmiPublicKey,
  transactionBuilder,
  Umi
} from '@metaplex-foundation/umi'
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'
import { Connection, PublicKey as SolanaPublicKey } from '@solana/web3.js'

export interface BlogPostNFTMetadata {
  name: string
  description: string
  image: string
  external_url?: string
  attributes: Array<{
    trait_type: string
    value: string
  }>
}

export interface MintNFTParams {
  walletAdapter: any // Dynamic Labs wallet adapter
  blogPost: {
    id: string
    title: string
    excerpt?: string
    content: string
    slug: string
    authorId: string
    coverImage?: string
  }
  network?: 'devnet' | 'mainnet' | 'testnet'
}

export interface MintResult {
  success: boolean
  mintAddress?: string
  metadataUri?: string
  txSignature?: string
  error?: string
}

export class SolanaNFTMinter {
  private umi: Umi
  private network: string

  constructor(network: 'devnet' | 'mainnet' | 'testnet' = 'devnet') {
    this.network = network
    
    // Get RPC endpoint based on network
    const rpcEndpoint = this.getRpcEndpoint(network)
    
    // Create UMI instance
    this.umi = createUmi(rpcEndpoint)
      .use(mplTokenMetadata())
      .use(irysUploader())
  }

  private getRpcEndpoint(network: string): string {
    switch (network) {
      case 'mainnet':
        return process.env.NEXT_PUBLIC_SOLANA_MAINNET_RPC || 'https://api.mainnet-beta.solana.com'
      case 'testnet':
        return process.env.NEXT_PUBLIC_SOLANA_TESTNET_RPC || 'https://api.testnet.solana.com'
      case 'devnet':
      default:
        return process.env.NEXT_PUBLIC_SOLANA_DEVNET_RPC || 'https://api.devnet.solana.com'
    }
  }

  private createNFTMetadata(blogPost: MintNFTParams['blogPost']): BlogPostNFTMetadata {
    return {
      name: blogPost.title,
      description: blogPost.excerpt || `Blog post by ${blogPost.authorId}`,
      image: blogPost.coverImage || '',
      external_url: `${process.env.NEXT_PUBLIC_APP_URL}/blog/${blogPost.slug}`,
      attributes: [
        {
          trait_type: 'Post Type',
          value: 'Blog Post'
        },
        {
          trait_type: 'Author',
          value: blogPost.authorId
        },
        {
          trait_type: 'Network',
          value: this.network ?? 'unknown'
        },
        {
          trait_type: 'Created Date',
          value: new Date().toISOString().split('T')[0] || 'unknown'
        }
      ]
    }
  }

  async uploadMetadata(metadata: BlogPostNFTMetadata): Promise<string> {
    try {
      const metadataUri = await this.umi.uploader.uploadJson(metadata)
      return metadataUri
    } catch (error) {
      console.error('Failed to upload metadata:', error)
      throw new Error('Failed to upload NFT metadata to IPFS')
    }
  }

  async mintBlogPostNFT({ walletAdapter, blogPost, network }: MintNFTParams): Promise<MintResult> {
    try {
      // Set the network if different
      if (network && network !== this.network) {
        this.network = network
        const rpcEndpoint = this.getRpcEndpoint(network)
        this.umi = createUmi(rpcEndpoint)
          .use(mplTokenMetadata())
          .use(irysUploader())
      }

      // Get wallet public key
      const walletPublicKey = walletAdapter.publicKey
      if (!walletPublicKey) {
        return { success: false, error: 'Wallet not connected' }
      }

      // Set the wallet as the signer for UMI
      this.umi.identity = {
        publicKey: walletPublicKey.toString() as UmiPublicKey,
        signMessage: async (message: Uint8Array) => {
          const signature = await walletAdapter.signMessage(message)
          return signature
        },
        signTransaction: async (transaction: any) => {
          const signedTx = await walletAdapter.signTransaction(transaction)
          return signedTx
        }
      } as any

      // Create NFT metadata
      const metadata = this.createNFTMetadata(blogPost)
      
      // Upload metadata to IPFS/Arweave
      const metadataUri = await this.uploadMetadata(metadata)

      // Generate mint signer
      const mint = generateSigner(this.umi)

      // Create NFT instruction
      const createNftInstruction = createNft(this.umi, {
        mint,
        name: metadata.name,
        uri: metadataUri,
        sellerFeeBasisPoints: 500 as any, // 5% royalty
        creators: [
          {
            address: walletPublicKey.toString() as UmiPublicKey,
            verified: true,
            share: 100,
          },
        ],
        collection: undefined, // Can be set if you have a collection
      })

      // Build and send transaction
      const transaction = transactionBuilder()
        .add(createNftInstruction)
        .build(this.umi)

      const result = await this.umi.rpc.sendTransaction(transaction)
      
      // Get the transaction signature
      const txSignature = typeof result === 'string' ? result : (result as any).signature || result.toString()

      return {
        success: true,
        mintAddress: mint.publicKey.toString(),
        metadataUri,
        txSignature,
      }

    } catch (error) {
      console.error('NFT minting failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  async verifyNFT(mintAddress: string): Promise<boolean> {
    try {
      const connection = new Connection(this.getRpcEndpoint(this.network))
      const mintPublicKey = new SolanaPublicKey(mintAddress)
      
      // Check if the mint account exists
      const mintInfo = await connection.getAccountInfo(mintPublicKey)
      
      if (!mintInfo) {
        return false
      }

      // Check metadata account
      const [metadataPda] = findMetadataPda(this.umi, {
        mint: mintAddress as UmiPublicKey
      })
      
      const metadataAccount = await this.umi.rpc.getAccount(metadataPda)
      
      return metadataAccount.exists
    } catch (error) {
      console.error('NFT verification failed:', error)
      return false
    }
  }

  async estimateMintCost(): Promise<number> {
    try {
      // Rough estimate for NFT minting on Solana
      // This includes: mint account, metadata account, and transaction fees
      const baseRent = 0.00144 // ~1.44 SOL for accounts
      const transactionFee = 0.000005 // ~5000 lamports
      const metadataStorageFee = 0.001 // Estimate for Irys storage
      
      return baseRent + transactionFee + metadataStorageFee
    } catch (error) {
      console.error('Failed to estimate mint cost:', error)
      return 0.005 // Fallback estimate
    }
  }
}
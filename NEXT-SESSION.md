# Next session — prompt + project notes

Paste the **Prompt** section below into a fresh session. The **Notes** section is reference (architecture, gotchas) so the work can start cleanly.

---

## Prompt (copy this)

> I'm working on my web3 portfolio at `~/dd/2kcodes` (repo `kevin-kabore/2kcodes`, live `https://kevindotk.xyz`, Vercel deploys from `main`). Read `NEXT-SESSION.md` and the project memory first. Three tasks, in priority order:
>
> **1. Rewrite blog post #1 "The Bottleneck Is Attention"** (`content/blog/the-bottleneck-is-attention.md`) for a genuinely human voice. The content/argument is good; the delivery reads "very AI." Hard rules:
> - **No em dashes (—).** Use commas, periods, parentheses, or restructure.
> - Cut the AI tells: "not just X, it's Y" / "not X but Y" constructions, tidy three-part lists (tricolons) used for rhythm, aphoristic mic-drop sentences, explaining/restating the point right after making it (delete the sentence after the good one), hollow profundity, and approval-seeking closers.
> - Vary sentence length. Sound like a real person talking. Keep my substance.
> Then re-run the publish script to update the DB (`DATABASE_URL="<v2 pooled>" npx tsx scripts/insert-posts.ts`) and let me review before I mint. Same applies if I want to touch the other two posts.
>
> **2. Implement REAL Solana devnet NFT minting** (it's currently mocked — `/api/nft/mint` returns fake `Date.now()`-based addresses; no Metaplex code is wired). The deps are already installed: `@metaplex-foundation/umi`, `mpl-token-metadata`, `umi-bundle-defaults`, `umi-uploader-irys`, `@solana/web3.js`. Make it real on **devnet**:
> - Mint **client-side** using the connected **Dynamic Solana wallet** as the umi signer (can't sign server-side with the user's wallet). Dynamic exposes the Solana wallet/signer via `@dynamic-labs/solana` + `useDynamicContext`.
> - Build a real NFT with `createNft` (mpl-token-metadata) on a devnet RPC.
> - Upload metadata JSON (and optionally cover image) — `irys` uploader needs a small devnet SOL balance (free airdrop) or use a simpler hosted JSON URI for v1.
> - Persist the **real** mint address / tx signature / network via the existing `PATCH /api/blog/posts/[id]/nft` route.
> - Wire it through the existing pieces: the **Mint-as-NFT button** already exists on post pages (`app/blog/[slug]/blog-post-client.tsx`) → opens `NFTMintingModal` (`app/components/blog/nft-minting-modal.tsx`) → `useNFTMinting` hook (`hooks/use-nft-minting.ts`, currently calls the mock route). Replace the mock path with real minting.
> - Success criterion: I click "Mint as NFT" on a post, approve in my wallet, and get a real devnet NFT whose mint address resolves on Solana Explorer (cluster=devnet). Validate locally before pushing.
>
> **3. (If time) Build the edit flow:** a `/blog/[slug]/edit` page reusing the editor (`app/components/blog/blog-editor.tsx`), a `PATCH /api/blog/posts/[id]` route for updates, and re-add an author "Edit" link in `blog-post-client.tsx`. (Edit/Delete buttons were removed because no edit route existed — it 404'd.)
>
> Validate every change with a real build (`npm run build`, check the exit code — don't let a piped grep mask a failed build), and push to `main` for Vercel. I'll mint once #1 reads well and #2 works.

---

## Notes / current state (reference)

**Stack:** Next.js 15.4.10 (App Router), Tailwind v4, Prisma + Supabase Postgres, Dynamic (Solana wallet auth), next-themes. Live on custom domain `kevindotk.xyz`.

**Database:** Supabase project **`luykdpylhgndirlmsbze`** ("2kcodes-db-v2"). Prisma reads `env("DATABASE_URL")`. The Supabase–Vercel integration sets `POSTGRES_*`/`SUPABASE_*` but **not** `DATABASE_URL` — it's set manually in Vercel to the pooled string (`...pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true`). For scripts/migrations use a direct/session connection (port 5432). Repo migrations are incomplete; use `prisma db push` to sync a fresh DB. Local Postgres for testing: `brew services start postgresql@18`; psql at `/opt/homebrew/opt/postgresql@18/bin`.

**Publishing model:** markdown in `content/blog/*.md`; `prisma/blog-content.ts` is the single source of truth (also carries optional `nft` + `viewCount`); `scripts/insert-posts.ts` upserts idempotently (attaches to the first DB user). `/` and `/blog` are `force-dynamic`; `/blog/[slug]` is SSG (re-run insert, then push to re-prerender edited bodies).

**Posts in v2** (author `kevin.s.kabore`): "The Bottleneck Is Attention" (2026-06-01, not minted, rewrite target); "Using AI to Build a Banana Bread Business" (2026-01-01, not minted); "How Decentralization and AI Shaped My Vision for Economic Development" (2025-08-18, NFT badge restored, mock).

**Minting today:** fully mocked. `useNFTMinting` → `/api/nft/mint` → fake values. No real chain tx.

**Auth gotcha:** Dynamic blocks the SDK unless the live origin is in its allowed-origins list (dashboard). `kevindotk.xyz` is now allowlisted.

**Writing voice:** see memory `feedback_blog_writing_voice` — no em dashes, kill AI tells, human cadence.

**Security TODO:** rotate the v2 DB password + Supabase service-role/JWT keys (they were shared in plaintext during setup).

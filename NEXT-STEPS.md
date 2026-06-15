# Next steps — publishing the two new blog posts

The code changes (dark/light fixes, hero lines, About, Experience, the two posts as
committed markdown) deploy automatically when this lands on `main` (Vercel).

The **blog posts themselves live in the production database**, not in the repo, so they
need one manual step to go live. This was scripted for you and is idempotent (safe to
re-run — it upserts by slug and preserves the backdated publish dates).

## 1. Publish the posts to production

Prisma reads `POSTGRES_PRISMA_URL` (provided on Vercel by the Supabase integration).
To run the insert script against prod, pass the v2 connection explicitly:

```bash
POSTGRES_PRISMA_URL="<v2 connection string>" npx tsx scripts/insert-posts.ts
```

You must sign in once on the live site first (creates your user row); the script
attaches the posts to that user.

What it does:
- Title: `The Bottleneck Is Attention` → published **2026-06-01**, category Engineering
- Title: `Using AI to Build a Banana Bread Business` → published **2026-02-15**, category AI
- Attaches both to the first user in the DB (your Dynamic account).
- Body text is read from `content/blog/*.md`, so edit those files and re-run to update.

Verify on the live site: `/blog` should show both, dated as above.

## 2. Mint the posts as NFTs (needs your wallet)

Minting can't be done from a script — it needs your connected Solana wallet:

- Sign in on the live site as the author (the Dynamic account that owns the posts).
- Open each post, use the existing **NFT mint modal** (the same flow used for your prior
  minted post), and confirm the transaction in your wallet.
- Once minted, the 🎨 NFT badge shows automatically (the card reads `nftMinted` / `nftNetwork`).

## 3. Deploy

Already handled by merging to `main` → Vercel redeploys production. The visual changes
(theme fixes, hero lines, About, Experience ladder) are live on that deploy. The posts
appear as soon as step 1 runs against prod — independent of the deploy.

## Notes

- The dev seed (`npm run db:seed`) also creates these two posts locally, so your local
  blog matches prod.
- To tweak the rotating hero lines (incl. the faith lines), edit
  `app/components/hero/hero-new.tsx`.
- Post copy is in `content/blog/` and is the single source of truth for both the seed and
  the prod insert script (`prisma/blog-content.ts`).

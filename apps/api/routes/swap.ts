import express, { Request, Response } from 'express';
import verifySignature, { AuthRequest } from '../middleware/auth';
import {
  ComputeBudgetProgram,
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js';
import { AnchorProvider, Wallet } from '@project-serum/anchor';
import {
  TensorSwapSDK,
  TensorWhitelistSDK,
  computeTakerPrice,
  TakerSide,
  castPoolConfigAnchor,
  TensorSwapPdaAnchor,
  findWhitelistPDA,
} from '@tensor-oss/tensorswap-sdk';

const router = express.Router();
const connection = new Connection('https://api.mainnet-beta.solana.com');
const provider = new AnchorProvider(
  connection,
  new Wallet(Keypair.generate()),
  {}
);
const swapSdk = new TensorSwapSDK({ provider });
const wlSdk = new TensorWhitelistSDK({ provider });
const tswapApiClient = new TswapApiClient();

router.get('/', (req: Request, res: Response) => {
  res.send('This is swap endpoint');
});

router.get('/quote', verifySignature, (req: AuthRequest, res: Response) => {
  const walletAddress = req.authenticatedWallet;

  console.log({ walletAddress });

  res.send('This is swap quote endpoint');
});

router.post(
  '/nft-to-token',
  verifySignature,
  (req: AuthRequest, res: Response): any => {
    const walletAddress = req.authenticatedWallet;

    console.log({ walletAddress });

    const { nftMint, targetTokenMint } = req.body;

    // if (!nftMint || !targetTokenMint) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Missing required swap parameters',
    //   });
    // }

    res.status(200).json({
      success: true,
      message: 'Swap processed successfully',
      transaction: {
        signature: 'simulated_transaction_signature',
        block: 123456789,
      },
      swappedAmount: '10.5',
      fee: '0.1',
    });
  }
);

router.post(
  '/instant-sell-nft',
  verifySignature,
  async (req: AuthRequest, res: Response) => {
    try {
      const walletAddress = req.authenticatedWallet;
      const { nftMint, targetTokenMint, price } = req.body;

      if (!nftMint || !targetTokenMint || !price) {
        return res.status(400).json({
          success: false,
          message:
            'Missing required parameters (nftMint, targetTokenMint, price)',
        });
      }

      console.log(
        `Processing instant sell for NFT: ${nftMint} to token: ${targetTokenMint} at price: ${price}`
      );

      // Initialize TensorSwapSDK
      const provider = new AnchorProvider(
        connection,
        new Wallet(Keypair.generate()),
        {}
      );
      const swapSdk = new TensorSwapSDK({ provider });
      const wlSdk = new TensorWhitelistSDK({ provider });

      // 1. First check if there's existing pool we can sell to
      const poolsResponse = await tswapApiClient.getTSwapPools({
        mints: [nftMint],
      });

      let bestPool = null;
      if (poolsResponse.pools && poolsResponse.pools.length > 0) {
        const filteredPools = poolsResponse.pools.filter(
          (pool) => pool.tokenMint === targetTokenMint
        );

        if (filteredPools.length > 0) {
          bestPool = [...filteredPools].sort(
            (a, b) => b.stats.buyNowPrice - a.stats.buyNowPrice
          )[0];
        }
      }

      // 2. If no suitable pool exists, create one
      if (!bestPool) {
        console.log('No existing pool found, creating new pool...');

        // Get collection UUID (you'll need to implement this)
        const collectionUUID = await getCollectionUUID(nftMint);
        const uuidArray = Buffer.from(
          collectionUUID.replaceAll('-', '')
        ).toJSON().data;
        const [wlAddr] = findWhitelistPDA({ uuid: uuidArray });

        // Create pool transaction
        const {
          tx: { ixs: createPoolIxs },
        } = await swapSdk.createPool({
          owner: new PublicKey(walletAddress),
          whitelist: wlAddr,
          config: {
            poolType: { token: {} },
            curveType: { linear: {} },
            startingPrice: price,
            delta: 0, // Fixed price
            honorRoyalties: true,
            expiry: null, // No expiry
          },
          isCosigned: false,
          maxTakerSellCount: 1, // Only want to sell 1 NFT
        });

        // Send the create pool transaction
        const createPoolTx = new Transaction().add(...createPoolIxs);
        const createPoolSignature = await connection.sendTransaction(
          createPoolTx,
          []
        );
        await connection.confirmTransaction(createPoolSignature);

        console.log(`Created new pool with tx: ${createPoolSignature}`);

        // Get the newly created pool address
        // You might need to parse this from logs or derive it
        const newPoolAddress =
          await derivePoolAddressFromTx(createPoolSignature);
        bestPool = await swapSdk.fetchPool(newPoolAddress);
      }

      // 3. Now sell to the pool (either existing or newly created)
      const pool = bestPool;
      const config = castPoolConfigAnchor(pool.config);

      // Get whitelist info
      const wl = await wlSdk.fetchWhitelist(pool.whitelist);
      let proofIxs: TransactionInstruction[] = [];

      if (JSON.stringify(wl.rootHash) !== JSON.stringify(Array(32).fill(0))) {
        const proof = await getMerkleProofForNFT(nftMint);
        const {
          tx: { ixs },
        } = await wlSdk.initUpdateMintProof({
          user: new PublicKey(walletAddress),
          whitelist: pool.whitelist,
          mint: new PublicKey(nftMint),
          proof,
        });
        proofIxs = ixs;
      }

      // Create sell transaction
      const {
        tx: { ixs: sellIxs },
      } = await swapSdk.sellNft({
        type: 'token',
        whitelist: pool.whitelist,
        nftMint: new PublicKey(nftMint),
        nftSellerAcc: new PublicKey(walletAddress),
        owner: new PublicKey(pool.owner),
        seller: new PublicKey(walletAddress),
        config,
        minPrice: price * 0.999, // Adjust slightly for rounding
      });

      // Get latest blockhash
      const blockhash = await connection.getLatestBlockhash();

      // Add compute budget instruction
      const computeBudgetIx = ComputeBudgetProgram.setComputeUnitLimit({
        units: 400000,
      });

      // Combine all instructions
      const allIxs = [computeBudgetIx, ...proofIxs, ...sellIxs];

      // Create final transaction
      const userWallet = new PublicKey(walletAddress);
      const messageV0 = new TransactionMessage({
        payerKey: userWallet,
        recentBlockhash: blockhash.blockhash,
        instructions: allIxs,
      }).compileToV0Message();

      const versionedTransaction = new VersionedTransaction(messageV0);

      // Convert to base64 for transport
      const serializedTransaction = Buffer.from(
        versionedTransaction.serialize()
      ).toString('base64');

      // Calculate estimated received amount and fees
      const estimatedTokenAmount = price; // Adjust based on your token ratio if needed
      const fee = (estimatedTokenAmount * 0.01).toFixed(4); // 1% fee
      const finalTokenAmount = (estimatedTokenAmount - parseFloat(fee)).toFixed(
        4
      );

      // Return transaction for signing
      res.status(200).json({
        success: true,
        message: 'Generated instant sell transaction',
        transaction: serializedTransaction,
        txType: 'instantSell',
        salePrice: price.toString(),
        swappedAmount: finalTokenAmount,
        fee: fee,
        poolAddress: pool.address.toString(),
        poolOwner: pool.owner.toString(),
        tokenMint: targetTokenMint,
        instructions: {
          count: allIxs.length,
        },
      });
    } catch (error) {
      console.error('Error in instant sell process:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create instant sell transaction',
        error: error.message,
      });
    }
  }
);

// Helper functions you'll need to implement
async function getCollectionUUID(nftMint: string): Promise<string> {
  // Implement logic to get collection UUID for the NFT
  // This might involve querying Tensor's API or on-chain data
  return 'collection-uuid-here';
}

async function derivePoolAddressFromTx(
  txSignature: string
): Promise<PublicKey> {
  // Implement logic to derive the pool address from the creation tx
  // This might involve parsing transaction logs or deriving from the owner
  return new PublicKey('pool-address-here');
}

async function getMerkleProofForNFT(nftMint: string): Promise<number[][]> {
  // Implement logic to get merkle proof for the NFT
  return [];
}

export default router;

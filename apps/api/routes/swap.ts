import express, { Request, Response } from 'express';
import verifySignature, { AuthRequest } from '../middleware/auth';

const router = express.Router();

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

    // const { nftMint, targetTokenMint } = req.body;

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

export default router;

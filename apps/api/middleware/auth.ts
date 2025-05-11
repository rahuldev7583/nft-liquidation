import { NextFunction, Request, Response } from 'express';
import { PublicKey } from '@solana/web3.js';
import nacl from 'tweetnacl';

export interface AuthRequest extends Request {
  authenticatedWallet?: PublicKey;
}

const verifySignature = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): any => {
  try {
    const { walletAddress, message, signature } = req.body;

    if (!walletAddress || !message || !signature) {
      res.status(400).json({
        success: false,
        message: 'Missing required authentication parameters',
      });
    }

    const signatureUint8 = Buffer.from(signature, 'base64');

    const messageBytes = new TextEncoder().encode(message);

    const publicKey = new PublicKey(walletAddress);

    const isValid = nacl.sign.detached.verify(
      messageBytes,
      signatureUint8,
      publicKey.toBytes()
    );

    if (!isValid) {
      res.status(401).json({
        success: false,
        message: 'Invalid signature',
      });
    }
    console.log('sign verified');

    const timestampMatch = message.match(/Auth for NFT-SPL Swap: (\d+)/);

    if (!timestampMatch) {
      res.status(400).json({
        success: false,
        message: 'Invalid message format',
      });
    }

    const messageTimestamp = parseInt(timestampMatch[1]);
    const currentTime = Date.now();
    const fiveMinutesMs = 5 * 60 * 1000;

    if (currentTime - messageTimestamp > fiveMinutesMs) {
      res.status(401).json({
        success: false,
        message: 'Signature expired',
      });
    }
    req.authenticatedWallet = walletAddress;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication failed',
    });
  }
};

export default verifySignature;

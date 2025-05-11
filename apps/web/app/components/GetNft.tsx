import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
  DigitalAssetWithToken,
  fetchAllDigitalAssetWithTokenByOwner,
} from '@metaplex-foundation/mpl-token-metadata';
import { publicKey } from '@metaplex-foundation/umi';
import { PublicKey } from '@solana/web3.js';

export const getNft = async (pubKey: PublicKey) => {
  try {
    const umi = createUmi(process.env.NEXT_PUBLIC_DEVNET_SOL_API || '');
    const ownerPublicKey = publicKey(pubKey);

    const response = await fetchAllDigitalAssetWithTokenByOwner(
      umi,
      ownerPublicKey
    );

    const filteredNFTs: DigitalAssetWithToken[] = response.filter(
      (asset: any) => asset?.mint.supply.toString() === '1'
    );

    console.log({ filteredNFTs });

    return filteredNFTs;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

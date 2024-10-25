import { PublicKey } from "@solana/web3.js";
import { publicKey, u64 } from '@solana/buffer-layout-utils';
import { struct, u8 } from '@solana/buffer-layout';

// Interface for Transfer event
export interface TransferEvent {
  instruction: number;
  amount: bigint;
}

// Struct to decode Transfer event
export const TransferEventLayout = struct<TransferEvent>([
  u8('instruction'),
  u64('amount'),
]);

// Example usage
const transaction = {
  message: {
    instructions: [
      {
        data: "AgAAALzXEhkAAAAA"
      }
    ]
  }
};

try {
  const data = Buffer.from(transaction.message.instructions[0].data, 'base64');
  const decodedEvent = TransferEventLayout.decode(data);
  console.log('Decoded Transfer event:', decodedEvent);
} catch (error) {
  console.error('Error decoding Transfer event:', error);
}
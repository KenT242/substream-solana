const bs58 = require('bs58');
const BN = require('bn.js');

// Định nghĩa IDL cho instruction Transfer
const transferIDL = {
  "name": "transfer",
  "accounts": [
    { "name": "source", "isMut": true, "isSigner": false },
    { "name": "destination", "isMut": true, "isSigner": false },
    { "name": "authority", "isMut": false, "isSigner": true }
  ],
  "args": [
    { "name": "amount", "type": "u64" }
  ]
};

// Hàm để parse toàn bộ thông tin từ transaction JSON
function parseTransferTransaction(transactionData, transferIDL) {
  const message = transactionData.transaction.message;
  
  // Lấy thông tin signatures
  console.log("Signatures:", transactionData.transaction.signatures);

  const signatureBuffer = Buffer.from(transactionData.transaction.signatures[0], 'base64');
  const signatureBase58 = bs58.default.encode(signatureBuffer);

  console.log("Signature in base58:", signatureBase58);

  // Lấy thông tin program ID từ accountKeys
  const programId = message.accountKeys[message.instructions[0].programIdIndex];
  console.log("Program ID:", bs58.default.encode(Buffer.from(programId, 'base64')));

  // Parse thông tin accounts từ accountKeys theo thứ tự của IDL
  transferIDL.accounts.forEach((account, idx) => {
    const accountKey = message.accountKeys[idx];
    console.log(`${account.name}:`, bs58.default.encode(Buffer.from(accountKey, 'base64')));
  });

  // Parse args (amount) từ instruction data
  const instruction = message.instructions[0];
  const data = Buffer.from(instruction.data, 'base64');

  // Giải mã amount từ data
  if (transferIDL.args[0].name === 'amount' && transferIDL.args[0].type === 'u64') {
    const amount = new BN(data.slice(1, 9), 'le');
    console.log("Amount:", amount.toString());
  }
}

// Dữ liệu transaction JSON
const transactionData = {
  "transaction": {
    "signatures": [
      "NXPCTDm9BXT4eeEUAEF8bu46a4MAlw5kyXleWvMXskKZxrl5te17ZgzLfIuVQzGIJhZ8hnkgwh+bY8MfnIlhBQ=="
    ],
    "message": {
      "header": {
        "numRequiredSignatures": 1,
        "numReadonlyUnsignedAccounts": 7
      },
      "accountKeys": [
        "Qcz11w54KMxjyojoVlca0eK44Lu8HJvG9LlqN5H4JO4=",
        "rRHmpPwpRKT6glG++BVCbhv7KMa2ZGZ3YHxq2fVmpkY=",
        "dIRMQpBfq0+z/0h23LwgJtc9EjlSW4itwIaHPCk8TVQ=",
        "EmIoNjaLcPvkzLWeHdtN/q2PSGpEK2CrP9oXRgrOFjA=",
        "rD0QbLBbvD8a4mRcwfyeH8vKpuGmqr0tK2hzRZk6XpU=",
        "AVbg9pNmWs9E2xVovxdbqlGJy5f10v87ZV0rtv1tGLA=",
        "OoZeae4PVIDKvPZjV+TcLxjVjUXB6nSJ+zcj2Xk8cqY="
      ],
      "recentBlockhash": "GAWjxOOnOwG3SZPWvmOIwIniytkvKEypSOcffQTI0Jo=",
      "instructions": [
        {
          "programIdIndex": 5,
          "accounts": "BgEHAgMEAAgJCgsF",
          "data": "ZgY9EgHa6+rC/VBTEQAAAMDYpwAAAAAA"
        }
      ]
    }
  },
  "meta": {
    "fee": "5000",
    "preBalances": [
      "703588858",
      "258066637010200",
      "35767806804",
      "2039280",
      "2039280",
      "1141440",
      "8530000",
      "1461600",
      "1",
      "934087680",
      "1009200",
      "0"
    ],
    "postBalances": [
      "693483857",
      "258066637110200",
      "35777806805",
      "2039280",
      "2039280",
      "1141440",
      "8530000",
      "1461600",
      "1",
      "934087680",
      "1009200",
      "0"
    ],
    "preTokenBalances": [
      {
        "accountIndex": 3,
        "mint": "EemS2s2oimofzLYApip8NBGKDU2u54EaD6SV5NMCpump",
        "uiTokenAmount": {
          "uiAmount": 4.16458364372223e+08,
          "decimals": 6,
          "amount": "416458364372223",
          "uiAmountString": "416458364.372223"
        },
        "owner": "8qqJH28gm1m5DFA4xZkL2S4MQqREqCXTd8SkAbGeUWBM",
        "programId": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
      }
    ],
    "postTokenBalances": [
      {
        "accountIndex": 3,
        "mint": "EemS2s2oimofzLYApip8NBGKDU2u54EaD6SV5NMCpump",
        "uiTokenAmount": {
          "uiAmount": 4.16383952111421e+08,
          "decimals": 6,
          "amount": "416383952111421",
          "uiAmountString": "416383952.111421"
        },
        "owner": "8qqJH28gm1m5DFA4xZkL2S4MQqREqCXTd8SkAbGeUWBM",
        "programId": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
      }
    ],
    "computeUnitsConsumed": "34454"
  }
};

// Gọi hàm parse
parseTransferTransaction(transactionData, transferIDL);

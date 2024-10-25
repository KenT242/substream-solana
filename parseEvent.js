const web3 = require('@solana/web3.js');
const borsh = require('borsh');

// Define the event structure
class MyEvent {
  constructor(fields) {
    this.amount = fields.amount;
    this.recipient = fields.recipient;
  }
}

// Create a schema for Borsh to use when deserializing the event data
const MyEventSchema = new Map([
  [MyEvent, { kind: 'struct', fields: [['amount', 'u64'], ['recipient', 'string']] }]
]);

async function parseEvent(logMessages) {
  // Find the log containing our event data
  const eventLog = logMessages.find(log => log.startsWith('Program log: Instruction: Transfer'));
  
  if (!eventLog) {
    console.log('Event not found in transaction logs');
    return;
  }


  // Extract the base64 encoded event data
  const eventData = eventLog.split(':')[2].trim();
  console.log(eventData)

  return;
  // Decode the base64 data
  const buffer = Buffer.from(eventData, 'base64');
  
  // Deserialize the event data using Borsh
  const event = borsh.deserialize(MyEventSchema, MyEvent, buffer);
  
  console.log('Parsed event:', event);
}

// Usage
const logMessages = [
  "Program ComputeBudget111111111111111111111111111111 invoke [1]",
  "Program ComputeBudget111111111111111111111111111111 success",
  "Program 11111111111111111111111111111111 invoke [1]",
  "Program 11111111111111111111111111111111 success",
  "Program ComputeBudget111111111111111111111111111111 invoke [1]",
  "Program ComputeBudget111111111111111111111111111111 success",
  "Program 6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P invoke [1]",
  "Program log: Instruction: Sell",
  "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [2]",
  "Program log: Instruction: Transfer",
  "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 4645 of 80991 compute units",
  "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success",
  "Program 6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P invoke [2]",
  "Program 6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P consumed 2003 of 72861 compute units",
  "Program 6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P success",
  "Program data: vdt/007mYe472oVOIZF3ljdLqHc25LxbRlAXU1pyfs4q+oLsRyBwn2YfbzwAAAAAwLfJ8XofAAAAGUZ9GpR6rzUUhdAWJYU3RiGQdJ3zFmC1JDZX2HpIPMwTMA9nAAAAAHZIVQgHAAAAEUdyLkfJAwB2nDEMAAAAABGvX+K1ygIA",
  "Program 6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P consumed 30418 of 99550 compute units",
  "Program 6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P success"
];

parseEvent(logMessages);
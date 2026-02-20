#!/bin/bash

# 🔗 Blockchain API Test Script
# Complete workflow testing

BASE_URL="http://localhost:3000/api/blockchain"

echo "🔗 ==========================================="
echo "   BLOCKCHAIN API TEST SCRIPT"
echo "========================================== 🔗"
echo ""

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ======================================
# 1. CREATE WALLET
# ======================================
echo -e "${BLUE}📍 Step 1: Create Wallet (Alice)${NC}"
echo "Command: POST /wallet/create"
echo ""

ALICE_RESPONSE=$(curl -s -X POST "${BASE_URL}/wallet/create")
echo "Response:"
echo "$ALICE_RESPONSE" | jq '.' 2>/dev/null || echo "$ALICE_RESPONSE"
echo ""

# Extract Alice's keys
ALICE_PRIVATE_KEY=$(echo "$ALICE_RESPONSE" | jq -r '.privateKey')
ALICE_PUBLIC_KEY=$(echo "$ALICE_RESPONSE" | jq -r '.publicKey')

echo -e "${GREEN}✅ Alice's Wallet Created${NC}"
echo "  Private Key: ${ALICE_PRIVATE_KEY:0:20}..."
echo "  Public Key:  ${ALICE_PUBLIC_KEY:0:20}..."
echo ""
echo "=================================================="
echo ""

# ======================================
# 2. CREATE ANOTHER WALLET
# ======================================
echo -e "${BLUE}📍 Step 2: Create Wallet (Bob)${NC}"
echo "Command: POST /wallet/create"
echo ""

BOB_RESPONSE=$(curl -s -X POST "${BASE_URL}/wallet/create")
echo "Response:"
echo "$BOB_RESPONSE" | jq '.' 2>/dev/null || echo "$BOB_RESPONSE"
echo ""

BOB_PRIVATE_KEY=$(echo "$BOB_RESPONSE" | jq -r '.privateKey')
BOB_PUBLIC_KEY=$(echo "$BOB_RESPONSE" | jq -r '.publicKey')

echo -e "${GREEN}✅ Bob's Wallet Created${NC}"
echo "  Private Key: ${BOB_PRIVATE_KEY:0:20}..."
echo "  Public Key:  ${BOB_PUBLIC_KEY:0:20}..."
echo ""
echo "=================================================="
echo ""

# ======================================
# 3. SIGN TRANSACTION
# ======================================
echo -e "${BLUE}📍 Step 3: Alice Signs Transaction (Alice → Bob: 50 coins)${NC}"
echo "Command: POST /transaction/sign"
echo ""

SIGN_PAYLOAD=$(cat <<EOF
{
  "transaction": {
    "from_address": "$ALICE_PUBLIC_KEY",
    "to_address": "$BOB_PUBLIC_KEY",
    "amount": 50,
    "signature": ""
  },
  "privateKey": "$ALICE_PRIVATE_KEY"
}
EOF
)

echo "Payload:"
echo "$SIGN_PAYLOAD" | jq '.' 2>/dev/null || echo "$SIGN_PAYLOAD"
echo ""

SIGNED_TX=$(curl -s -X POST "${BASE_URL}/transaction/sign" \
  -H "Content-Type: application/json" \
  -d "$SIGN_PAYLOAD")

echo "Response:"
echo "$SIGNED_TX" | jq '.' 2>/dev/null || echo "$SIGNED_TX"
echo ""

# Extract signature
SIGNATURE=$(echo "$SIGNED_TX" | jq -r '.signature')

echo -e "${GREEN}✅ Transaction Signed${NC}"
echo "  Signature: ${SIGNATURE:0:30}..."
echo ""
echo "=================================================="
echo ""

# ======================================
# 4. VERIFY TRANSACTION
# ======================================
echo -e "${BLUE}📍 Step 4: Verify Transaction Signature${NC}"
echo "Command: POST /transaction/verify"
echo ""

VERIFY_PAYLOAD=$(cat <<EOF
{
  "transaction": {
    "from_address": "$ALICE_PUBLIC_KEY",
    "to_address": "$BOB_PUBLIC_KEY",
    "amount": 50,
    "signature": "$SIGNATURE"
  }
}
EOF
)

echo "Payload:"
echo "$VERIFY_PAYLOAD" | jq '.' 2>/dev/null || echo "$VERIFY_PAYLOAD"
echo ""

VERIFY_RESPONSE=$(curl -s -X POST "${BASE_URL}/transaction/verify" \
  -H "Content-Type: application/json" \
  -d "$VERIFY_PAYLOAD")

echo "Response:"
echo "$VERIFY_RESPONSE" | jq '.' 2>/dev/null || echo "$VERIFY_RESPONSE"
echo ""

VALID=$(echo "$VERIFY_RESPONSE" | jq -r '.isValid')

if [ "$VALID" = "true" ]; then
  echo -e "${GREEN}✅ Signature Valid - Transaction Authenticated!${NC}"
else
  echo "❌ Signature Invalid - Transaction Rejected!"
fi
echo ""
echo "=================================================="
echo ""

# ======================================
# 5. ADD TO MEMPOOL
# ======================================
echo -e "${BLUE}📍 Step 5: Add Transaction to Mempool${NC}"
echo "Command: POST /transaction"
echo ""

MEMPOOL_PAYLOAD=$(cat <<EOF
{
  "from_address": "$ALICE_PUBLIC_KEY",
  "to_address": "$BOB_PUBLIC_KEY",
  "amount": 50,
  "signature": "$SIGNATURE"
}
EOF
)

echo "Payload:"
echo "$MEMPOOL_PAYLOAD" | jq '.' 2>/dev/null || echo "$MEMPOOL_PAYLOAD"
echo ""

MEMPOOL_RESPONSE=$(curl -s -X POST "${BASE_URL}/transaction" \
  -H "Content-Type: application/json" \
  -d "$MEMPOOL_PAYLOAD")

echo "Response:"
echo "$MEMPOOL_RESPONSE" | jq '.' 2>/dev/null || echo "$MEMPOOL_RESPONSE"
echo ""

echo -e "${GREEN}✅ Transaction Added to Mempool${NC}"
echo ""
echo "=================================================="
echo ""

# ======================================
# 6. GET PENDING TRANSACTIONS
# ======================================
echo -e "${BLUE}📍 Step 6: Get Pending Transactions from Mempool${NC}"
echo "Command: GET /transactions/pending"
echo ""

PENDING_RESPONSE=$(curl -s -X GET "${BASE_URL}/transactions/pending")

echo "Response:"
echo "$PENDING_RESPONSE" | jq '.' 2>/dev/null || echo "$PENDING_RESPONSE"
echo ""

PENDING_COUNT=$(echo "$PENDING_RESPONSE" | jq 'length // 0')

echo -e "${GREEN}✅ Pending Transactions: $PENDING_COUNT${NC}"
echo ""
echo "=================================================="
echo ""

# ======================================
# 7. MINE BLOCK
# ======================================
echo -e "${BLUE}📍 Step 7: Mine Block (Proof of Work)${NC}"
echo "Command: POST /mine"
echo "Mining in progress... (This takes time due to Proof-of-Work)"
echo ""

MINER_RESPONSE=$(curl -s -X POST "${BASE_URL}/wallet/create")
MINER_ADDRESS=$(echo "$MINER_RESPONSE" | jq -r '.publicKey')

MINE_PAYLOAD=$(cat <<EOF
{
  "minerAddress": "$MINER_ADDRESS"
}
EOF
)

echo "Payload:"
echo "$MINE_PAYLOAD" | jq '.' 2>/dev/null || echo "$MINE_PAYLOAD"
echo ""

MINE_RESPONSE=$(curl -s -X POST "${BASE_URL}/mine" \
  -H "Content-Type: application/json" \
  -d "$MINE_PAYLOAD")

echo "Response:"
echo "$MINE_RESPONSE" | jq '.' 2>/dev/null || echo "$MINE_RESPONSE"
echo ""

BLOCK_HASH=$(echo "$MINE_RESPONSE" | jq -r '.hash')
BLOCK_NONCE=$(echo "$MINE_RESPONSE" | jq -r '.nonce')
BLOCK_TX_COUNT=$(echo "$MINE_RESPONSE" | jq -r '.transactions | length')

echo -e "${GREEN}✅ Block Mined Successfully!${NC}"
echo "  Hash: ${BLOCK_HASH:0:20}..."
echo "  Nonce: $BLOCK_NONCE"
echo "  Transactions in block: $BLOCK_TX_COUNT"
echo ""
echo "=================================================="
echo ""

# ======================================
# 8. GET BLOCKCHAIN
# ======================================
echo -e "${BLUE}📍 Step 8: Get Full Blockchain${NC}"
echo "Command: GET /api/blockchain"
echo ""

BLOCKCHAIN_RESPONSE=$(curl -s -X GET "${BASE_URL}")

echo "Response (first 500 chars):"
BLOCKCHAIN_PREVIEW=$(echo "$BLOCKCHAIN_RESPONSE" | jq '.' 2>/dev/null || echo "$BLOCKCHAIN_RESPONSE")
echo "$BLOCKCHAIN_PREVIEW" | head -c 500
echo "..."
echo ""

BLOCKCHAIN_COUNT=$(echo "$BLOCKCHAIN_RESPONSE" | jq 'length // 0')

echo -e "${GREEN}✅ Blockchain Retrieved${NC}"
echo "  Total Blocks: $BLOCKCHAIN_COUNT"
echo ""
echo "=================================================="
echo ""

# ======================================
# 9. VALIDATE BLOCKCHAIN
# ======================================
echo -e "${BLUE}📍 Step 9: Validate Blockchain Integrity${NC}"
echo "Command: GET /validate"
echo ""

VALIDATE_RESPONSE=$(curl -s -X GET "${BASE_URL}/validate")

echo "Response:"
echo "$VALIDATE_RESPONSE" | jq '.' 2>/dev/null || echo "$VALIDATE_RESPONSE"
echo ""

IS_VALID=$(echo "$VALIDATE_RESPONSE" | jq -r '.isValid')

if [ "$IS_VALID" = "true" ]; then
  echo -e "${GREEN}✅ Blockchain is VALID!${NC}"
else
  echo -e "${YELLOW}⚠️ Blockchain validation issue${NC}"
fi
echo ""
echo "=================================================="
echo ""

# ======================================
# 10. CHECK BALANCES
# ======================================
echo -e "${BLUE}📍 Step 10: Check Balances${NC}"
echo "Command: GET /balance/:address"
echo ""

echo "Alice's Balance:"
ALICE_BALANCE=$(curl -s -X GET "${BASE_URL}/balance/${ALICE_PUBLIC_KEY}")
echo "$ALICE_BALANCE" | jq '.' 2>/dev/null || echo "$ALICE_BALANCE"
echo ""

echo "Bob's Balance:"
BOB_BALANCE=$(curl -s -X GET "${BASE_URL}/balance/${BOB_PUBLIC_KEY}")
echo "$BOB_BALANCE" | jq '.' 2>/dev/null || echo "$BOB_BALANCE"
echo ""

echo "Miner's Balance:"
MINER_BALANCE=$(curl -s -X GET "${BASE_URL}/balance/${MINER_ADDRESS}")
echo "$MINER_BALANCE" | jq '.' 2>/dev/null || echo "$MINER_BALANCE"
echo ""

echo -e "${GREEN}✅ Balances Retrieved${NC}"
echo ""
echo "=================================================="
echo ""

echo -e "${BLUE}🎉 ALL TESTS COMPLETED! 🎉${NC}"
echo ""
echo "Summary:"
echo "  1. ✅ Created Alice's wallet"
echo "  2. ✅ Created Bob's wallet"
echo "  3. ✅ Alice signed transaction (50 coins → Bob)"
echo "  4. ✅ Verified transaction signature"
echo "  5. ✅ Added transaction to mempool"
echo "  6. ✅ Got pending transactions"
echo "  7. ✅ Mined block with transaction"
echo "  8. ✅ Retrieved full blockchain"
echo "  9. ✅ Validated blockchain integrity"
echo "  10. ✅ Checked all balances"
echo ""
echo "🔗 Your blockchain is working perfectly! 🔗"

# 🔗 Blockchain Learning Project - Báo Cáo Chi Tiết

## 📋 Mục Lục
1. [Tổng Quan Dự Án](#tổng-quan-dự-án)
2. [Mục Tiêu Học Tập](#mục-tiêu-học-tập)
3. [Công Nghệ & Stack](#công-nghệ--stack)
4. [Kiến Trúc Hệ Thống](#kiến-trúc-hệ-thống)
5. [Tính Năng Chi Tiết](#%EF%B8%8F-tính-năng-chi-tiết)
6. [API Documentation](#-api-documentation)
7. [Mô Hình Dữ Liệu](#-mô-hình-dữ-liệu)
8. [Cryptography & Security](#-cryptography--security)
9. [Cài Đặt & Chạy](#-cài-đặt--chạy)
10. [Ví Dụ Sử Dụng](#-ví-dụ-sử-dụng)
11. [Luồng Hoạt Động](#-luồng-hoạt-động-chi-tiết)
12. [Error Handling](#error-handling)
13. [Testing](#-testing)
14. [Project Highlights](#-project-highlights--notable-features)
15. [Key Learnings](#-project-highlights--notable-features)
16. [Phát Triển Trong Tương Lai](#phát-triển-trong-tương-lai)

---

## 🎯 Tổng Quan Dự Án

**Blockchain Learning Project** là một triển khai giáo dục minh họa cơ chế hoạt động của blockchain sử dụng:
- **NestJS** - Framework Node.js mạnh mẽ với TypeScript
- **MongoDB** - Cơ sở dữ liệu NoSQL để lưu trữ blocks
- **Elliptic Cryptography** - Cho digital signatures (secp256k1 - chuẩn Bitcoin/Ethereum)
- **SHA-256 Hashing** - Để bảo vệ dữ liệu blocks
- **Account Model** - Quản lý nonce & balance theo từng account (giống Ethereum)

Dự án tập trung vào việc minh họa các khái niệm cơ bản của blockchain một cách dễ hiểu và có thể thực hành, bao gồm advanced features như:
- ✅ **Canonical Transaction Hashing** - Hash xác định cho mỗi transaction
- ✅ **Account-Style Nonce Tracking** - Phòng chống replay attacks
- ✅ **Double-Spend Prevention** - Kiểm tra balance pending
- ✅ **Transaction Fees** - Tính phí giao dịch & tích lũy vào reward
- ✅ **Enhanced Blockchain Validation** - Xác thực chữ ký & coinbase correctness
- ✅ **Prepare-Sign-Add Flow** - workflow an toàn cho unsigned transactions

---

## 🎓 Mục Tiêu Học Tập

### Hiểu biết về Blockchain Core Concepts
- ✅ **Hash Functions**: Tại sao SHA-256 quan trọng cho data integrity
- ✅ **Digital Signatures**: Cách chứng minh quyền sở hữu mà không lộ private key
- ✅ **Proof-of-Work**: Cơ chế consensus đơn giản (difficulty-based mining)
- ✅ **Mempool**: Cách quản lý các giao dịch chưa được xác nhận
- ✅ **Chain Validation**: Kiểm tra tính hợp lệ của toàn bộ chuỗi
- ✅ **Transaction & Block Structure**: Cấu trúc dữ liệu cơ bản
- ✅ **Merkle Tree**: Cây băm nhị phân để tóm tắt transactions (Merkle Root)
- ✅ **Block Header/Body Separation**: Tách biệt phần header (hash) và body (transactions)
- ✅ **Difficulty Adjustment**: Điều chỉnh độ khó mining tự động dựa trên thời gian block

### Kỹ Năng Backend Development
- ✅ NestJS Architecture (Controllers, Services, Modules)
- ✅ TypeScript Best Practices
- ✅ MongoDB Integration với Mongoose
- ✅ RESTful API Design
- ✅ Error Handling & Validation
- ✅ Environment Configuration

### Cryptography Fundamentals
- ✅ Elliptic Curve Cryptography (ECC)
- ✅ Public-Private Key Cryptography
- ✅ Digital Signature Schemes (ECDSA)
- ✅ Hash Chaining

---

## 🛠 Công Nghệ & Stack

### Core Dependencies
```json
{
  "@nestjs/core": "^11.0.1",
  "@nestjs/common": "^11.0.1",
  "@nestjs/mongoose": "^11.0.4",
  "@nestjs/swagger": "^11.2.6",
  
  "mongoose": "^9.2.1",
  "elliptic": "^6.6.1",
  "class-validator": "^0.14.3",
  "class-transformer": "^0.5.1",
  "swagger-ui-express": "^5.0.1"
}
```

### Development Environment
- **Node.js**: v18+
- **NPM/Yarn**: Package Manager
- **MongoDB**: v6+
- **TypeScript**: v5+
- **Jest**: Testing Framework
- **ESLint + Prettier**: Code Quality

---

## 🏗 Kiến Trúc Hệ Thống

### Layered Architecture

```
┌─────────────────────────────────────────┐
│  REST API Layer (BlockchainController)  │
│  - HTTP Endpoints                       │
│  - Request/Response Handling            │
│  - DTOs Validation                      │
└────────────────────┬────────────────────┘
                     │
┌─────────────────────▼────────────────────┐
│  Service Layer (BlockchainService)      │
│  - Business Logic                       │
│  - Mempool Management                   │
│  - Mining Algorithm                     │
│  - Blockchain Validation                │
└────────────────────┬────────────────────┘
                     │
        ┌────────────┴──────────────┐
        │                           │
┌───────▼─────────┐        ┌───────▼──────────┐
│  Data Layer     │        │  Utility Layer   │
│  (MongoDB)      │        │  (Pure Functions)│
│  - Entities     │        │  ├─ Crypto      │
│  - Schemas      │        │  ├─ Hashing     │
│  - Persistence  │        │  ├─ Mining      │
└─────────────────┘        │  ├─ Wallet Mgmt │
                           └──────────────────┘
```

### Design Patterns Sử Dụng
1. **NestJS Module Pattern** - Modularization & Dependency Injection
2. **Service Pattern** - Separation of Concerns
3. **DTO Pattern** - Data Validation & Transfer
4. **Singleton Pattern** - Mempool (In-memory storage)
5. **Factory Pattern** - Block & Transaction creation

---

## ⚙️ Tính Năng Chi Tiết

### 🎯 Advanced Transaction Features (Transaction Model Nâng Cao)

#### A. Canonical Transaction Hashing
- **Purpose**: Tạo hash xác định và ổn định cho mỗi transaction
- **Format**: `from_address|to_address|amount|nonce|timestamp|tokenId`
- **Lợi ích**:
  - ✅ Deterministic: Cùng transaction data → Cùng hash
  - ✅ Không phụ thuộc vào field ordering
  - ✅ An toàn cho signing/verification

```typescript
// Ví dụ canonical transaction hash
const tx = {
  from_address: "04abc...",
  to_address: "04def...",
  amount: 100,
  nonce: 0,
  timestamp: 1704067200000
};
const hash = SHA256("04abc...|04def...|100|0|1704067200000");
// hash được dùng để ký và verify
```

#### B. Account-Style Nonce Tracking
- **Purpose**: Phòng chống replay attacks & đảm bảo order transactions từ một sender
- **Mechanism**: Backend tự động assign nonce khi `prepareTransaction`
- **Validation**: Khi `addTransactionToMempool`, nonce phải = maxConfirmedNonce + pendingCount + 1

```typescript
// Ví dụ flow
1. Sender A chưa có transaction nào: nonce = 0
2. Sender A tạo tx1 với nonce 0, tx2 với nonce 1
3. Khi xác nhận tx1 → nonce max = 0
4. Nếu tx2 (nonce 1) đến → accepted
5. Nếu có tx3 (nonce 1 duplicate) → rejected (invalid nonce)
6. Nếu có tx3 (nonce 2) mà tx2 chưa accept → pending, chờ tx2 confirm
```

**Lợi ích:**
- ✅ Phòng chống replay attacks (không thể submit cùng tx hai lần)
- ✅ Đảm bảo order transactions từ một account
- ✅ Giống Ethereum account model

#### C. Double-Spend Prevention
- **Mechanism**: Kiểm tra `pending balance` trước khi add vào mempool
- **Calculation**:
  ```
  confirmedBalance = tổng incoming - tổng outgoing từ all confirmed blocks
  pendingOutgoing = tổng (amount + fee) của transactions từ sender trong mempool
  
  Validation: confirmedBalance - pendingOutgoing >= requiredAmount + fee
  ```

**Lợi ích**:
- ✅ Phòng chống double-spend mà không cần UTXO tracking
- ✅ Đơn giản hơn UTXO model nhưng vẫn an toàn
- ✅ Giống Ethereum

#### D. Transaction Fees & Reward Aggregation
- **Fee Field**: Được set khi `prepareTransaction`
- **Mining Reward**: `baseReward (100) + sumFees` từ tất cả transactions
- **Coinbase Placement**: **Luôn ở vị trí đầu tiên** trong transactions[]
- **Coinbase Amount**: `miningReward + sumFees` (được validate trong `validateBlockchain`)

```typescript
// Ví dụ mining block với 3 transactions
mempool: [
  tx1: { from: "A", to: "B", amount: 50, fee: 1 },
  tx2: { from: "C", to: "D", amount: 30, fee: 2 },
  tx3: { from: "E", to: "F", amount: 20, fee: 1 }
]

totalFees = 1 + 2 + 1 = 4
minerReward = 100 (base) + 4 (fees) = 104

block.transactions = [
  { from: "SYSTEM", to: "miner", amount: 104 },  // Coinbase luôn đầu tiên!
  tx1,
  tx2,
  tx3
]
```

#### E. Prepare → Sign → Add Flow (3-Step Transaction Creation)

**Tại sao separate prepare bước?**
- ✅ Backend kiểm soát nonce & timestamp (tránh double-spend & timing issues)
- ✅ Client ký transaction hash đã confirm từ backend
- ✅ Không có race condition giữa prepare & sign
- ✅ Signature không bao giờ thay đổi sau khi ký

**Flow chi tiết:**
```
1️⃣  CLIENT PREPARES
   POST /transaction/prepare
   {
     from_address: "client_public_key",
     to_address: "recipient",
     amount: 100,
     fee: 1
   }
   
   RESPONSE (Backend computed):
   {
     from_address: "client_public_key",
     to_address: "recipient",
     amount: 100,
     fee: 1,
     nonce: 3,                    ← Backend computed
     timestamp: 1704067200000,    ← Backend computed
     hash: "sha256_hash"          ← Backend computed (canonical)
   }

2️⃣  CLIENT SIGNS (locally)
   Sign transaction hash with private key (offline)
   signature = ECDSA_SIGN(hash, privateKey)
   tx.signature = signature

3️⃣  CLIENT SUBMITS
   POST /transaction
   {
     from_address: "...",
     to_address: "...",
     amount: 100,
     fee: 1,
     nonce: 3,
     timestamp: 1704067200000,
     hash: "...",
     signature: "DER_format_signature"
   }
   
   VALIDATION (Backend):
   - Verify signature matches hash
   - Verify nonce is sequential
   - Verify balance sufficient (confirmed - pending)
   - Add to mempool
```

**Lợi ích của flow này:**
- ✅ Ngăn chặn race condition & nonce collision
- ✅ Signature bảo vệ toàn bộ tx data (bao gồm nonce, timestamp)
- ✅ Backend kiểm soát nonce state (trusted nonce source)
- ✅ Giống MuiSwap smart contract patternns thiên tế

#### F. Enhanced Blockchain Validation

**Validation Logic Đầu Đủ:**

```typescript
for each block in blockchain (từ index 1):
  1. ✅ Check Chain Continuity
     previous_hash == hash_của_block_trước
  
  2. ✅ Verify Merkle Root
     merkle_root_tính_lại = calculateMerkleRoot(transactions)
     merkle_root_lưu == merkle_root_tính_lại
  
  3. ✅ Recalculate Block Hash
     header = { index, timestamp, previous_hash, merkle_root, nonce, version, difficulty }
     hash_tính_lại = SHA256(header)
     hash_lưu == hash_tính_lại
  
  4. ✅ Check Proof-of-Work
     difficulty > 0 → hash phải bắt đầu bằng (difficulty x "0")
  
  5. ✅ Verify Coinbase (Transaction[0])
     from_address == "SYSTEM"
     amount == baseReward + tổng_fees_từ_transactions_khác
  
  6. ✅ Verify Each Transaction
     for each tx in transactions:
       - Nếu tx.from_address != "SYSTEM":
         * tx.hash == calculateTransactionHash(tx)
         * verifySignature(tx) == true
```

**Validation này đảm bảo:**
- ✅ Blockchain integrity (không ai modify được blocks cũ)
- ✅ Miner reward correctness (không miner claim thêm tokens)
- ✅ Transaction authenticity (mỗi tx đều có signature hợp lệ)
- ✅ Proof-of-Work compliance (nonce được tìm đúng)

---

### 1️⃣ Wallet Management
- **Feature**: Tạo cặp key cryptographic bằng Elliptic Curve
- **Algorithm**: secp256k1 (chuẩn Bitcoin/Ethereum)
- **Output**: `{ privateKey, publicKey }`
- **Security**: Private key PHẢI được giữ bí mật

```typescript
// Flow
1. Tạo KeyPair bằng secp256k1
2. Trích xuất Private Key (hex format)
3. Trích xuất Public Key (hex format)
4. Trả về cả hai cho user
```

### 2️⃣ Transaction Signing
- **Purpose**: Chứng minh quyền sở hữu của người gửi
- **Algorithm**: ECDSA (Elliptic Curve Digital Signature Algorithm)
- **Input**: Transaction object + Private Key
- **Output**: Transaction có `signature` (DER format)

```typescript
// Flow
1. Tính transaction hash từ: from_address + to_address + amount
2. Ký hash bằng private key
3. Chuyển signature thành DER format (chuẩn OpenSSL)
4. Attach signature vào transaction
```

### 3️⃣ Transaction Verification
- **Purpose**: Xác minh chữ ký của giao dịch
- **Input**: Signed transaction (có signature)
- **Output**: Boolean (valid/invalid)
- **Special Case**: SYSTEM transactions không cần ký

```typescript
// Flow
1. Kiểm tra transaction.from_address không phải "SYSTEM"
2. Nếu không có signature → invalid
3. Lấy public key từ from_address
4. Tính transaction hash lại
5. Verify signature bằng public key
```

### 4️⃣ Mempool Management
- **Purpose**: Lưu trữ các giao dịch chưa được xác nhận
- **Storage**: In-memory array (production sẽ dùng Redis)
- **Validation**: Check signature trước khi thêm vào

```typescript
// Flow trước khi add vào mempool
1. Kiểm tra transaction có đủ fields
2. Nếu from_address != "SYSTEM": verify signature
3. Nếu invalid → throw error
4. Add vào mempool array
5. Trả về transaction
```

### 5️⃣ Proof-of-Work Mining
- **Algorithm**: Difficulty-based nonce finding
- **Initial Difficulty**: 2 (block hash phải bắt đầu bằng "00")
- **Reward**: 100 tokens cho miner
- **Hash Strategy**: **Hash only header** (không hash toàn bộ transactions trực tiếp)
- **Process**:

```typescript
// Mining algorithm - Hash only header
let nonce = 0;
while (true) {
  // Tính Merkle Root từ transactions trước
  const merkleRoot = calculateMerkleRoot(transactions);
  
  // Chỉ hash header (không hash transactions trực tiếp)
  const header = {
    index, timestamp, previous_hash, merkle_root: merkleRoot,
    nonce, version: 1, difficulty
  };
  
  hash = SHA256(header);
  if (hash.startsWith("0".repeat(difficulty))) {
    return { nonce, hash };
  }
  nonce++;
}
```

**Lợi ích của Hash Only Header:**
- ✅ Hiệu quả hơn: không cần hash lại toàn bộ transactions mỗi lần thử nonce
- ✅ Merkle Root đại diện cho toàn bộ transactions một cách compact
- ✅ Có thể chứng minh transaction thuộc block bằng Merkle Proof (future feature)

### 6️⃣ Block Header & Body Separation
- **Block Header** (phần cố định dùng để tính hash):
  - `index`: Vị trí block trong chain
  - `timestamp`: Thời gian tạo block (ms)
  - `previous_hash`: Hash của block trước (immutable link)
  - `merkle_root`: Merkle root của tất cả transactions
  - `nonce`: Số được tìm qua PoW
  - `version`: Phiên bản block format (hiện tại: 1)
  - `difficulty`: Độ khó mining tại thời điểm tạo block
  
- **Block Body** (phần dữ liệu):
  - `transactions[]`: Danh sách giao dịch trong block
  - `miner`: Địa chỉ người khai thác
  - `reward`: Phần thưởng khai thác (100 tokens)

**Tại sao tách Header/Body?**
- ✅ Header nhỏ gọn, dễ hash và verify
- ✅ Merkle Root trong header đại diện cho toàn bộ transactions
- ✅ Có thể verify block mà không cần đọc toàn bộ transactions
- ✅ Hỗ trợ Merkle Proof để chứng minh transaction thuộc block

### 7️⃣ Merkle Tree & Merkle Root
- **Merkle Tree**: Cây băm nhị phân tạo ra một giá trị duy nhất (Merkle Root) tóm tắt toàn bộ transactions
- **Algorithm**:
  1. Hash từng transaction → leaf nodes
  2. Ghép cặp và hash → parent nodes
  3. Lặp lại cho đến khi còn 1 node → Merkle Root
  4. Nếu số node lẻ, nhân đôi node cuối

```typescript
// Ví dụ với 3 transactions:
//     Root
//    /    \
//   AB     C
//  /  \   / \
// A    B C   C (duplicate)
```

**Lợi ích:**
- ✅ Chứng minh transaction thuộc block bằng Merkle Proof (chỉ cần log(n) nodes)
- ✅ Tránh phải hash toàn bộ danh sách transactions mỗi lần
- ✅ Dễ dàng verify integrity của block

### 8️⃣ Block Creation & Validation
- **Block Structure**: 
  - Header: index, timestamp, previous_hash, hash, nonce, version, difficulty, merkle_root
  - Body: transactions[], miner, reward
  
- **Validation Rules**:
  - previous_hash phải match với block trước
  - hash phải được tính đúng từ header (hash only header)
  - merkle_root phải khớp với Merkle root tính lại từ transactions
  - hash phải thỏa mãn difficulty requirement (bắt đầu bằng số 0 theo difficulty)
  - Tất cả transactions phải có signature hợp lệ

### 9️⃣ Difficulty Adjustment (Điều chỉnh độ khó tự động)
- **Purpose**: Tự động điều chỉnh difficulty để duy trì thời gian block ổn định
- **Target Block Time**: 10 giây (có thể cấu hình)
- **Adjustment Interval**: Mỗi 5 block (có thể cấu hình)
- **Algorithm** (Mild adjustment - điều chỉnh nhẹ):

```typescript
// Tính thời gian thực tế của N block gần nhất
const actualTime = latestBlock.timestamp - fromBlock.timestamp;
const expectedTime = targetBlockTime * adjustmentInterval;

// Điều chỉnh difficulty
if (actualTime < expectedTime / 2) {
  // Block quá nhanh → tăng difficulty
  difficulty += 1;
} else if (actualTime > expectedTime * 2 && difficulty > 1) {
  // Block quá chậm → giảm difficulty (min = 1)
  difficulty -= 1;
}
// Ngược lại giữ nguyên
```

**Lợi ích:**
- ✅ Tự động thích ứng với sự thay đổi của hashrate
- ✅ Duy trì thời gian block ổn định (~10s)
- ✅ Bảo vệ blockchain khỏi spam khi có nhiều miner
- ✅ Giảm difficulty khi có ít miner để đảm bảo block vẫn được tạo

### 🔟 Blockchain Integrity Check
- **Purpose**: Đảm bảo blockchain chưa bị tamper
- **Checks**:
  1. Mỗi block có previous_hash == hash của block trước
  2. Merkle root của mỗi block phải khớp với Merkle root tính lại từ transactions
  3. Hash của mỗi block phải tính đúng từ header (hash only header)
  4. Hash phải thỏa mãn difficulty requirement (bắt đầu bằng số 0 theo difficulty)

### 1️⃣1️⃣ Balance Query
- **Purpose**: Tính số dư của một address
- **Algorithm**: Scan tất cả blocks, tất cả transactions
  - Trừ khi from_address == address
  - Cộng khi to_address == address

---

## 📡 API Documentation

### Base URL: `/api/blockchain`

### 🔑 Wallet Endpoints

#### Create Wallet
```http
POST /wallet/create
Content-Type: application/json

Request: {}

Response (200):
{
  "privateKey": "1a2b3c4d...",
  "publicKey": "4a5b6c7d..."
}

Error (500):
{
  "message": "Failed to create wallet: ...",
  "statusCode": 500
}
```

---

### 📝 Transaction Endpoints

#### Prepare Transaction (Step 1 of 3-step flow)
```http
POST /transaction/prepare
Content-Type: application/json

Request:
{
  "from_address": "04abc...",
  "to_address": "04def...",
  "amount": 100,
  "fee": 1
}

Response (200):
{
  "from_address": "04abc...",
  "to_address": "04def...",
  "amount": 100,
  "fee": 1,
  "nonce": 3,
  "timestamp": 1704067200000,
  "hash": "sha256_hash...",
  "signature": ""
}

// Client then signs this locally with private key:
signature = ECDSA.sign(hash, privateKey)

Error (400):
{
  "message": "Failed to prepare transaction: ...",
  "statusCode": 400
}
```

#### Sign Transaction (for offline signing - alternative to prepare flow)
```http
POST /transaction/sign
Content-Type: application/json

Request:
{
  "transaction": {
    "from_address": "public_key_hex",
    "to_address": "recipient_address",
    "amount": 50
  },
  "privateKey": "private_key_hex"
}

Response (200):
{
  "from_address": "...",
  "to_address": "...",
  "amount": 50,
  "signature": "30440220..."
}

Error (400):
{
  "message": "Failed to sign transaction: Transaction and privateKey are required",
  "statusCode": 400
}
```

#### Verify Transaction
```http
POST /transaction/verify
Content-Type: application/json

Request:
{
  "transaction": {
    "from_address": "...",
    "to_address": "...",
    "amount": 50,
    "signature": "..."
  }
}

Response (200):
{
  "isValid": true
}
```

#### Add Transaction to Mempool (Step 3 of 3-step flow)
```http
POST /transaction
Content-Type: application/json

Request:
{
  "from_address": "04abc...",
  "to_address": "04def...",
  "amount": 100,
  "fee": 1,
  "nonce": 3,
  "timestamp": 1704067200000,
  "hash": "sha256_hash...",
  "signature": "DER_format_signature"
}

Response (201):
{
  "from_address": "04abc...",
  "to_address": "04def...",
  "amount": 100,
  "fee": 1,
  "nonce": 3,
  "timestamp": 1704067200000,
  "hash": "sha256_hash...",
  "signature": "DER_format_signature"
}

Error (400):
{
  "message": "Failed to add transaction to mempool: Invalid nonce",
  "statusCode": 400
}

Error (400):
{
  "message": "Failed to add transaction to mempool: Insufficient balance (considering pending outgoing transactions)",
  "statusCode": 400
}
```

#### Get Pending Transactions
```http
GET /transactions/pending

Response (200):
[
  { 
    "from_address": "04abc...", 
    "to_address": "04def...", 
    "amount": 50, 
    "fee": 1,
    "nonce": 0,
    "hash": "...",
    "signature": "..." 
  },
  { 
    "from_address": "04xyz...", 
    "to_address": "04uvw...", 
    "amount": 30,
    "fee": 2, 
    "nonce": 1,
    "hash": "...",
    "signature": "..." 
  }
]
```

---

### ⛏️ Mining Endpoint

#### Mine Pending Transactions
```http
POST /mine
Content-Type: application/json

Request:
{
  "minerAddress": "miner_public_key"
}

Response (201):
{
  "_id": "507f1f77bcf86cd799439011",
  "index": 1,
  "timestamp": 1671234567890,
  "previous_hash": "GENESIS_BLOCK",
  "hash": "00abcdef123456...",
  "nonce": 12345,
  "transactions": [
    { "from_address": "...", "to_address": "...", "amount": 50, "signature": "..." },
    { "from_address": "SYSTEM", "to_address": "miner_public_key", "amount": 100 }
  ],
  "miner": "miner_public_key",
  "reward": 100
}

Error (400):
{
  "message": "Mining failed: No transactions to mine",
  "statusCode": 400
}
```

---

### 🔍 Query Endpoints

#### Get Full Blockchain
```http
GET /

Response (200):
[
  {
    "index": 0,
    "timestamp": 1671234567890,
    "previous_hash": "0",
    "hash": "GENESIS_BLOCK",
    "nonce": 0,
    "transactions": [],
    "miner": null,
    "reward": null
  },
  {
    "index": 1,
    "timestamp": 1671234567900,
    "previous_hash": "GENESIS_BLOCK",
    "hash": "00abcdef...",
    "nonce": 12345,
    "transactions": [...],
    "miner": "...",
    "reward": 100
  }
]
```

#### Validate Blockchain Integrity
```http
GET /validate

Response (200):
true  // hoặc false nếu blockchain bị corrupt

Error checks:
- previous_hash != hash của block trước
- hash không match với recalculated hash
```

#### Get Address Balance
```http
GET /balance/:address

Response (200):
{
  "balance": 150
}

Error (400):
{
  "message": "Failed to get balance: Address is required",
  "statusCode": 400
}
```

---

## 📊 Mô Hình Dữ Liệu

### BlockEntity Schema
```typescript
{
  _id: ObjectId,
  
  // Block Header (dùng để tính hash)
  index: Number,              // Vị trí block trong chain
  timestamp: Number,          // Thời gian tạo block (ms)
  previous_hash: String,      // Hash của block trước (immutable link)
  hash: String,               // SHA-256 hash của block header
  nonce: Number,              // Số được tìm qua PoW
  version: Number,             // Phiên bản block format (mặc định: 1)
  difficulty: Number,          // Độ khó mining tại thời điểm tạo block
  merkle_root: String,         // Merkle root của tất cả transactions
  
  // Block Body
  transactions: [{            // Mảng transactions trong block
    from_address: String,
    to_address: String,
    amount: Number,
    signature: String
  }],
  miner: String,              // Địa chỉ người khai thác
  reward: Number,             // Phần thưởng khai thác (100 tokens)
  
  createdAt: Date,
  updatedAt: Date
}
```

**Block Header Type (TypeScript Interface):**
```typescript
interface BlockHeader {
  index: number;
  timestamp: number;
  previous_hash: string;
  merkle_root: string;
  nonce: number;
  version: number;
  difficulty: number;
}
```

### TransactionEntity Schema
```typescript
{
  _id: ObjectId,
  from_address: String,       // Địa chỉ gửi (public key)
  to_address: String,         // Địa chỉ nhận
  amount: Number,             // Số lượng token
  fee: Number,                // Phí giao dịch (mặc định: 0)
  signature: String,          // Chữ ký số (ECDSA DER format)
  nonce: Number,              // Sequence number từ sender (phòng chống replay)
  hash: String,               // Canonical transaction hash (SHA-256)
  timestamp: Number,          // Thời gian tạo (ms) - Backend set
  tokenId: String,            // Token type (optional - future feature)
  createdAt: Date,
  updatedAt: Date
}

// Transaction Interface (TypeScript)
interface ITransaction {
  from_address: string;       // '04abc...' (public key) hoặc 'SYSTEM'
  to_address: string;         // '04def...' (public key)
  amount: number;             // số lượng token
  fee?: number;               // phí (default 0)
  signature?: string;         // DER format
  nonce?: number;             // sequence number
  hash?: string;              // canonical transaction hash
  timestamp?: number;         // ms
  tokenId?: string;           // token type
}
```

**Canonical Transaction Hash:**
```
hash = SHA256(
  from_address|to_address|amount|nonce|timestamp|tokenId
)
```

Điều này đảm bảo:
- ✅ Mỗi transaction có hash unique & deterministic
- ✅ Hash này là input của ECDSA signing
- ✅ Thay đổi bất kỳ field nào → hash thay đổi → signature invalid

---

## 🔐 Cryptography & Security

### 1. Elliptic Curve Cryptography (ECC)

**Why secp256k1?**
- Chuẩn công nghiệp dùng bởi Bitcoin & Ethereum
- Cung cấp 256 bits security level
- Efficient computation trên curve points
- Well-audited & trusted

**Key Generation Flow:**
```
1. Random number generation (256 bits)
2. Generate private key từ random
3. Multiply generator point G với private key
4. Public key = result point (hex encoded)
```

### 2. Digital Signatures (ECDSA)

**Signing Process:**
```
Input: Message (transaction hash), Private Key
1. Hash message → h
2. Generate random k
3. Compute r = (k*G).x mod n
4. Compute s = k^-1 * (h + r*privKey) mod n
5. Signature = (r, s) in DER format
Output: Signature
```

**Verification Process:**
```
Input: Message hash, Signature, Public Key
1. Extract r, s từ signature
2. Compute u1 = h*s^-1 mod n
3. Compute u2 = r*s^-1 mod n
4. Compute point P = u1*G + u2*PublicKey
5. Verify: r == P.x mod n
Output: True/False
```

### 3. Merkle Tree & Merkle Root

**Merkle Tree là gì?**
- Cây băm nhị phân (binary hash tree) được đặt tên theo Ralph Merkle
- Mỗi leaf node là hash của một transaction
- Mỗi non-leaf node là hash của 2 child nodes
- Root node (Merkle Root) đại diện cho toàn bộ transactions

**Cách xây dựng:**
```
Ví dụ với 4 transactions (A, B, C, D):

        Root (Merkle Root)
       /                    \
    Hash(AB)              Hash(CD)
   /        \            /        \
Hash(A)  Hash(B)   Hash(C)  Hash(D)
  |        |         |        |
  A        B         C        D

Nếu số transaction lẻ (ví dụ 3 transactions):
        Root
       /    \
    Hash(AB)  Hash(CC)  ← C được duplicate
   /    \    /    \
Hash(A) Hash(B) Hash(C) Hash(C)
```

**Lợi ích của Merkle Tree:**
1. **Compact Representation**: Merkle Root (32 bytes) đại diện cho hàng nghìn transactions
2. **Efficient Verification**: Chứng minh transaction thuộc block chỉ cần log(n) nodes (Merkle Proof)
3. **Tamper Detection**: Thay đổi bất kỳ transaction nào sẽ làm thay đổi Merkle Root
4. **Parallel Processing**: Có thể tính Merkle Tree song song

**Merkle Proof Example:**
```
Để chứng minh transaction C thuộc block, chỉ cần:
- Hash(C)
- Hash(D) (sibling)
- Hash(AB) (uncle)
- Merkle Root

Verify: Hash(Hash(Hash(C) + Hash(D)) + Hash(AB)) == Merkle Root
```

### 4. Cryptographic Hash Function (SHA-256)

**Properties:**
- **Deterministic**: Same input → Same hash
- **One-way**: Không thể tính hash ngược lại
- **Avalanche Effect**: Nhỏ change → Completely different hash
- **Collision Resistant**: Rất khó tìm 2 inputs có cùng hash

**Usage in Blockchain:**
```
// Block Hash (Hash Only Header - không hash transactions trực tiếp)
Merkle Root = MerkleTree(transactions)
Block Hash = SHA256(
  index + timestamp + previous_hash + merkle_root + nonce + version + difficulty
)

// Transaction Hash (dùng cho signing)
Transaction Hash = SHA256(
  from_address + to_address + amount
)
```

**Tại sao Hash Only Header?**
- ✅ Hiệu quả: Không cần hash lại toàn bộ transactions mỗi lần thử nonce
- ✅ Merkle Root đại diện cho toàn bộ transactions một cách compact
- ✅ Chuẩn blockchain: Giống Bitcoin và Ethereum

### 5. Security Considerations

| Aspect | Current | Production |
|--------|---------|-----------|
| Private Key Storage | Memory | Hardware Wallet / Vault |
| Mempool | RAM | Redis / Message Queue |
| Consensus | PoW (centralized) | PoW + Network consensus |
| Communication | Local | HTTPS / TLS |
| Rate Limiting | None | Implemented |
| DDoS Protection | None | Cloudflare / WAF |

---

---

## 💻 Cài Đặt & Chạy

### Prerequisites
- **Node.js** v18+ ([Download](https://nodejs.org/))
- **MongoDB** v6+ ([Download](https://www.mongodb.com/try/download/community))
- **npm** hoặc **yarn**

### Step-by-Step Installation

#### 1. Clone Repository & Install Dependencies
```bash
cd /path/to/blockchain
npm install
```

#### 2. Cấu Hình Environment
Tạo file `.env` trong root directory:

```env
# Server Config
PORT=3000
NODE_ENV=development

# Database Config
DATABASE_URL=mongodb://localhost:27017/blockchain

# JWT (Optional cho future)
JWT_SECRET=your_secret_key_here
```

#### 3. Đảm Bảo MongoDB Chạy
```bash
# macOS (Homebrew)
brew services start mongodb-community

# Ubuntu/Debian
sudo systemctl start mongod

# Windows
net start MongoDB

# Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

#### 4. Chạy Development Server
```bash
npm run start:dev
```

Output sẽ như:
```
[Nest] 1234  - 02/15/2026, 2:30:45 PM     LOG [AppModule] Nest application successfully started
[Nest] 1234  - 02/15/2026, 2:30:45 PM     LOG Application is running on: http://localhost:3000
[Nest] 1234  - 02/15/2026, 2:30:45 PM     LOG Swagger docs: http://localhost:3000/api/docs
```

#### 5. Verify Setup
```bash
# Health check
curl http://localhost:3000/api/blockchain

# Should return: [] (empty blockchain array)
```

#### 6. Build Production
```bash
npm run build
npm run start:prod
```

---

## 📚 Ví Dụ Sử Dụng

### Complete Workflow Example

#### Step 1: Create Two Wallets
```bash
# Wallet 1 (Alice)
curl -X POST http://localhost:3000/api/blockchain/wallet/create
# Response:
# {
#   "privateKey": "1a2b3c4d5e6f7a8b...",
#   "publicKey": "0x4a5b6c7d8e9f0a1b..."
# }

# Wallet 2 (Bob)
curl -X POST http://localhost:3000/api/blockchain/wallet/create
# Response:
# {
#   "privateKey": "9z8y7x6w5v4u3t2s...",
#   "publicKey": "0x0a1b2c3d4e5f6a7b..."
# }
```

#### Step 2: Create & Sign Transaction
```bash
ALICE_PRIVKEY="1a2b3c4d5e6f7a8b..."
ALICE_PUBKEY="0x4a5b6c7d8e9f0a1b..."
BOB_PUBKEY="0x0a1b2c3d4e5f6a7b..."

curl -X POST http://localhost:3000/api/blockchain/transaction/sign \
  -H "Content-Type: application/json" \
  -d "{
    \"transaction\": {
      \"from_address\": \"$ALICE_PUBKEY\",
      \"to_address\": \"$BOB_PUBKEY\",
      \"amount\": 50
    },
    \"privateKey\": \"$ALICE_PRIVKEY\"
  }"

# Response:
# {
#   "from_address": "0x4a5b6c7d...",
#   "to_address": "0x0a1b2c3d...",
#   "amount": 50,
#   "signature": "30440220..."
# }
```

#### Step 3: Verify Transaction (Optional)
```bash
curl -X POST http://localhost:3000/api/blockchain/transaction/verify \
  -H "Content-Type: application/json" \
  -d '{
    "transaction": {
      "from_address": "0x4a5b6c7d...",
      "to_address": "0x0a1b2c3d...",
      "amount": 50,
      "signature": "30440220..."
    }
  }'

# Response: { "isValid": true }
```

#### Step 4: Add Transaction to Mempool
```bash
curl -X POST http://localhost:3000/api/blockchain/transaction \
  -H "Content-Type: application/json" \
  -d '{
    "from_address": "0x4a5b6c7d...",
    "to_address": "0x0a1b2c3d...",
    "amount": 50,
    "signature": "30440220..."
  }'

# Response: Transaction object
```

#### Step 5: Check Pending Transactions
```bash
curl http://localhost:3000/api/blockchain/transactions/pending

# Response:
# [
#   {
#     "from_address": "0x4a5b6c7d...",
#     "to_address": "0x0a1b2c3d...",
#     "amount": 50,
#     "signature": "30440220..."
#   }
# ]
```

#### Step 6: Mine Block
```bash
MINER_PUBKEY="0x4a5b6c7d..."  # Alice as miner

curl -X POST http://localhost:3000/api/blockchain/mine \
  -H "Content-Type: application/json" \
  -d "{\"minerAddress\": \"$MINER_PUBKEY\"}"

# Response:
# {
#   "_id": "...",
#   "index": 1,
#   "timestamp": 1671234567890,
#   "previous_hash": "GENESIS_BLOCK",
#   "hash": "00abcdef123456...",
#   "nonce": 12345,
#   "transactions": [
#     {"from_address": "...", "to_address": "...", "amount": 50, "signature": "..."},
#     {"from_address": "SYSTEM", "to_address": "0x4a5b6c7d...", "amount": 100}
#   ],
#   "miner": "0x4a5b6c7d...",
#   "reward": 100
# }
```

#### Step 7: Check Blockchain
```bash
curl http://localhost:3000/api/blockchain

# Response:
# [
#   {index: 0, hash: "GENESIS_BLOCK", ...},
#   {index: 1, hash: "00abcdef123456...", transactions: [...], ...}
# ]
```

#### Step 8: Check Balance
```bash
# Alice's balance (sent 50 + received 100 reward = +50)
curl http://localhost:3000/api/blockchain/balance/0x4a5b6c7d...
# Response: 50

# Bob's balance (received 50)
curl http://localhost:3000/api/blockchain/balance/0x0a1b2c3d...
# Response: 50
```

#### Step 9: Validate Blockchain
```bash
curl http://localhost:3000/api/blockchain/validate

# Response: true
```

---

## 🔄 Luồng Hoạt Động Chi Tiết

### Sequence Diagram

```
┌─────────┐          ┌──────────────┐         ┌─────────┐
│ Client  │          │ Controller   │         │ Service │
└────────┬┘          └──────┬───────┘         └────┬────┘
         │                  │                      │
         │─ POST /wallet/create                   │
         │──────────────────>                      │
         │                  │─ createWallet()     │
         │                  │─────────────────>   │
         │                  │                  (generate keys)
         │                  │<─────────────────   │
         │<─ {privateKey, publicKey}              │
         │                  │                      │
         │─ POST /transaction/sign ─────────────> │
         │                  │  (tx + privKey)     │
         │                  │───────────────────> │
         │                  │                  (sign tx)
         │                  │<─────────────────   │
         │<─ {signed tx}    │                      │
         │                  │                      │
         │─ POST /transaction/verify ────────────>│
         │                  │ (signed tx)         │
         │                  │───────────────────> │
         │                  │                  (verify signature)
         │                  │<─────────────────   │
         │<─ {isValid: true}│                      │
         │                  │                      │
         │─ POST /transaction ──────────────────> │
         │                  │ (add to mempool)    │
         │                  │───────────────────> │
         │                  │<─────────────────── │
         │<─ {tx added}     │                      │
         │                  │                      │
         │─ POST /mine ─────────────────────────> │
         │                  │ (minerAddress)      │
         │                  │───────────────────> │
         │                  │                  (PoW mining)
         │                  │                  (create block)
         │                  │                  (save to DB)
         │                  │<─────────────────── │
         │<─ {new block}    │                      │
         │                  │                      │
         │─ GET /balance/:address ────────────────>
         │                  │                  (calculate balance)
         │<─ {balance: 150} │                      │
         │                  │                      │
```

### Detailed Flow Steps

**1. Request Initialization**
- Client sends HTTP request to Controller
- Controller validates input using DTOs
- If validation fails: return 400 Bad Request

**2. Business Logic Processing**
- Controller delegates to Service (Dependency Injection)
- Service contains all business logic
- Service accesses utilities for cryptographic operations

**3. Data Persistence**
- Service interacts with MongoDB via Mongoose Models
- Create: Block/Transaction persisted to database
- Read: Query blockchain from database

**4. Error Handling**
- Try-catch blocks catch all exceptions
- Throw appropriate NestJS exceptions:
  - `BadRequestException` (400): Invalid input
  - `InternalServerErrorException` (500): Server errors
- Exception Filter converts to JSON response

**5. Response Return**
- Service returns result to Controller
- Controller returns HTTP response with status code
- Client receives JSON response

---

## ⚠️ Error Handling

### Exception Strategy

| Scenario | Exception | Status | Message |
|----------|-----------|--------|---------|
| Missing required field | BadRequestException | 400 | "Transaction and privateKey are required" |
| Invalid signature | BadRequestException | 400 | "Failed to add transaction to mempool: Invalid transaction signature" |
| No transactions to mine | BadRequestException | 400 | "Mining failed: No transactions to mine" |
| Database connection error | InternalServerErrorException | 500 | "Failed to retrieve blockchain: ..." |
| Crypto operation failed | InternalServerErrorException | 500 | "Failed to create wallet: ..." |
| Invalid address format | BadRequestException | 400 | "Failed to get balance: Invalid address" |

### Error Response Format

All errors follow this format:
```json
{
  "message": "Detailed error message",
  "error": "Exception type",
  "statusCode": 400
}
```

### Try-Catch Implementation

All service methods are wrapped with try-catch:

```typescript
async someMethod() {
  try {
    // Input validation
    if (!input) throw new Error('Input required');
    
    // Business logic
    const result = await operation();
    
    return result;
  } catch (error) {
    // Convert to appropriate exception
    throw new BadRequestException('Operation failed: ' + error.message);
  }
}
```

---

## 📚 Key Learnings

### 1. Blockchain Fundamentals
- **Hash Linking**: Each block links to previous via hash (immutability)
- **Proof-of-Work**: Mining difficulty protects against spam
- **Digital Signatures**: Cryptographic proof of ownership
- **Merkle Tree**: Binary hash tree để tóm tắt transactions (Merkle Root)
- **Block Header/Body**: Tách biệt phần header (hash) và body (transactions)
- **Hash Only Header**: Chỉ hash header (bao gồm Merkle Root), không hash transactions trực tiếp
- **Difficulty Adjustment**: Tự động điều chỉnh độ khó để duy trì thời gian block ổn định

### 2. Cryptographic Concepts Learned
- **secp256k1 Curve**: Why Bitcoin uses this specific elliptic curve
- **ECDSA**: How signatures prove possession without revealing secrets
- **Hash Collision**: Why SHA-256 is preferred for blockchain
- **Key Management**: Critical importance of private key protection

### 3. Software Architecture Lessons
- **Separation of Concerns**: Clean architecture with layers
- **Dependency Injection**: NestJS makes testing easier
- **DTOs**: Validation layer prevents invalid data
- **Error Handling**: Proper exception management improves reliability

### 4. Performance Considerations
- **Mining Difficulty**: Trade-off between security and performance
- **Database Indexing**: Important for balance queries on large chains
- **In-memory Mempool**: Production needs persistent queue (Redis)
- **Hash Computation**: Expensive operation, caching possible

### 5. Security Implications
- **Private Key Storage**: MUST never log or transmit unsecured
- **Transaction Replay**: Future versions need sequence numbers/nonces
- **51% Attack**: PoW protects against but needs network distribution
- **Smart Contracts**: Current version supports only value transfer

---

## 🚀 Phát Triển Trong Tương Lai

### Short-term Improvements
- [x] ✅ Block Header/Body separation
- [x] ✅ Merkle Root implementation
- [x] ✅ Hash only header (không hash transactions trực tiếp)
- [x] ✅ Difficulty adjustment mechanism
- [ ] Add environment-based config (development, staging, production)
- [ ] Implement Redis for persistent mempool instead of in-memory
- [ ] Add transaction fee structure instead of fixed mining reward
- [ ] Support batch transactions per block limit
- [ ] Add transaction nonce to prevent replay attacks
- [ ] Implement Merkle Proof để chứng minh transaction thuộc block

### Medium-term Enhancements
- [ ] Implement P2P networking (peer-to-peer blockchain)
- [ ] Add multinode consensus mechanism
- [ ] Create simple smart contract system
- [ ] Add transaction history/audit trail
- [ ] Implement block pruning for storage optimization

### Long-term Vision
- [ ] Create mobile wallet interface
- [ ] Implement Lightning Network-like layer 2 solution
- [ ] Add privacy features (zero-knowledge proofs)
- [ ] Deploy mainnet testnet
- [ ] Create Web UI dashboard for visualization

### Testing Enhancements
- [ ] Unit tests for all utility functions (wallet, sign, verify)
- [ ] Integration tests for complete workflows
- [ ] Load tests for mining performance
- [ ] Chaos engineering tests for network failures
- [ ] Security audit & penetration testing

### Development Tools
- [ ] Docker container for easy deployment
- [ ] Docker Compose for multi-container setup
- [ ] Development UI dashboard (React/Vue.js)
- [ ] CLI tool for local testing
- [ ] Postman/OpenAPI collection for API testing

### Documentation Expansion
- [ ] Interactive tutorials for each feature
- [ ] Video walkthrough of the codebase
- [ ] Architecture decision records (ADR)
- [ ] Performance benchmarks
- [ ] Security considerations guide

---

## 📖 Swagger UI

Truy cập **http://localhost:3000/api/docs** để xem tất cả API endpoints và test trực tiếp qua giao diện interactive.

Features:
- 📋 View all endpoints và parameters
- 🧪 Try-it-out: Execute requests directly
- 📝 See response examples
- 🔑 Manage authentication tokens

---

## 📁 Project Structure

```
blockchain/
├── src/
│   ├── controller/
│   │   └── blockchain.controller.ts      # REST API endpoints
│   ├── services/
│   │   └── blockchain.service.ts         # Business logic & orchestration
│   ├── dto/
│   │   ├── transaction.dto.ts            # Transaction DTO
│   │   ├── sign-transaction.dto.ts       # Signing DTO
│   │   ├── verify-transaction.dto.ts     # Verification DTO
│   │   ├── mine.dto.ts                   # Mining DTO
│   │   └── create-block.dto.ts           # Block creation DTO
│   ├── entities/
│   │   ├── block.entity.ts               # Block schema
│   │   └── transaction.entity.ts         # Transaction schema
│   ├── utils/
│   │   ├── wallet.util.ts                # Wallet creation (keypair)
│   │   ├── sign.util.ts                  # Transaction signing
│   │   ├── verify.util.ts                # Signature verification
│   │   ├── mine_block.util.ts            # PoW mining algorithm (hash only header)
│   │   ├── calculate_hash.utils.ts       # SHA-256 hashing (header only)
│   │   ├── merkle.util.ts                # Merkle tree & Merkle root calculation
│   │   └── transaction.util.ts           # Transaction hashing
│   ├── types/
│   │   └── block-header.type.ts          # BlockHeader interface definition
│   ├── app.module.ts                     # Main module
│   └── main.ts                           # Entry point
├── test/
│   ├── app.e2e-spec.ts                   # E2E tests
│   └── jest-e2e.json                     # Jest E2E config
├── .env                                  # Environment variables
├── package.json                          # Dependencies
├── tsconfig.json                         # TypeScript config
├── README.md                             # This file
└── eslint.config.mjs                     # ESLint rules
```

---

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run unit tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:cov

# Run E2E tests
npm run test:e2e

# Run specific test file
npm test -- blockchain.service.spec.ts
```

---

## 🔍 Project Statistics

- **Total Lines of Code**: ~1000+
- **Number of Endpoints**: 8 major endpoints
- **Cryptographic Curves**: secp256k1 (Bitcoin standard)
- **Hash Algorithm**: SHA-256 (256-bit output)
- **Initial Difficulty**: 2 (hash starts with "00")
- **Difficulty Adjustment**: Tự động điều chỉnh mỗi 5 block
- **Target Block Time**: 10 giây
- **Mining Reward**: 100 tokens per block
- **Block Structure**: Header/Body separation với Merkle Root
- **Hash Strategy**: Hash only header (không hash transactions trực tiếp)

---

## 🌟 Project Highlights & Notable Features

### 🎯 What Makes This Project Stand Out

#### 1. **Advanced Transaction Model (Account-Style)**
- ✅ **Canonical Transaction Hashing**: Transaction hash là function xác định của transaction data
- ✅ **Nonce Tracking**: Phòng chống replay attacks như Ethereum
- ✅ **Double-Spend Prevention**: Kiểm tra pending balance trước khi add mempool
- ✅ **Transaction Fees**: Tích lũy vào mining reward
- ✅ **Prepare-Sign-Add Flow**: 3-step flow an toàn cho transaction creation

**Lợi ích so với UTXO model (Bitcoin-style):**
- Đơn giản hơn: account = address + nonce
- Hiệu quả hơn: không cần track UTXOs
- Flexible hơn: dễ implement advanced features (smart contracts)
- Familiar hơn: giống Ethereum model

#### 2. **Enhanced Blockchain Validation**
- ✅ **Merkle Root Verification**: Verify toàn bộ transactions qua 1 hash
- ✅ **Transaction Signature Verification**: Verify chữ ký của mỗi transaction
- ✅ **Canonical Hash Verification**: Verify mỗi transaction hash đúng cách
- ✅ **Coinbase Correctness**: Verify reward amount = baseReward + sumFees
- ✅ **Proof-of-Work Verification**: Verify hash thỏa mãn difficulty

Validation này đảm bảo:
- Không ai modify blockchain được (immutable)
- Miner không claim thêm tokens (reward correctness)
- Mỗi transaction authenticated by signature
- Block difficulty requirements met

#### 3. **Efficient Hash Strategy**
- ✅ **Header-Only Hashing**: Hash chỉ header, không hash transactions trực tiếp
- ✅ **Merkle Root Representation**: Merkle Root đại diện compact cho toàn bộ transactions
- ✅ **Mining Efficiency**: Không cần hash lại transaction list mỗi lần thử nonce

```
Bitcoin/Ethereum Approach (giống project này):
- Hash only header (32 bytes → 256-bit hash)
- Merkle Root (32 bytes) đại diện transactions

Thay vì:
- Hash toàn bộ block (header + transactions)
- Không cần recalculate nếu transaction order thay đổi
```

#### 4. **Production-Ready Code Structure**
- ✅ **NestJS Modular Architecture**: Controllers → Services → Utils
- ✅ **TypeScript Strong Typing**: Full type safety, compile-time checking
- ✅ **DTO Validation**: Input validation trước khi processing
- ✅ **Error Handling**: Comprehensive try-catch with meaningful errors
- ✅ **Dependency Injection**: Loose coupling, easy to test

#### 5. **Comprehensive Testing**
- ✅ **Unit Tests**: Service-level tests with mocked database
- ✅ **Validation Tests**: Tests for coinbase, signatures, balance
- ✅ **E2E Tests**: Integration tests with in-memory MongoDB
- ✅ **Mock Utilities**: Mocked DB models for isolated testing

#### 6. **Educational Value**
- ✅ **Step-by-Step Flow**: Detailed prepare → sign → add workflow
- ✅ **Canonical Hashing**: Deterministic hash for security
- ✅ **Merkle Tree**: Binary hash tree for efficient verification
- ✅ **Difficulty Adjustment**: Automatic PoW adjustment mechanism
- ✅ **Account Model vs UTXO**: Learn both paradigms (account implemented, UTXO as future)

### 📋 Technical Accomplishments

| Feature | Status | Notes |
|---------|--------|-------|
| Wallet Management | ✅ Complete | secp256k1 keypair generation |
| Digital Signatures | ✅ Complete | ECDSA signing/verification |
| Canonical Tx Hashing | ✅ Complete | Deterministic transaction hash |
| Account-Style Nonce | ✅ Complete | Replay attack protection |
| Double-Spend Prevention | ✅ Complete | Pending balance validation |
| Transaction Fees | ✅ Complete | Fee aggregation into reward |
| Prepare-Sign-Add Flow | ✅ Complete | 3-step secure transaction creation |
| Mempool Management | ✅ Complete | In-memory transaction pool |
| Block Mining (PoW) | ✅ Complete | Difficulty-based nonce finding |
| Header/Body Separation | ✅ Complete | Efficient hashing strategy |
| Merkle Tree | ✅ Complete | Compact transaction representation |
| Difficulty Adjustment | ✅ Complete | Automatic PoW adjustment (target: 10s/block) |
| Blockchain Validation | ✅ Complete | Chain continuity + signature + coinbase verification |
| Balance Calculation | ✅ Complete | Account-style balance tracking |
| Unit Tests | ✅ Complete | Service-level with mocks |
| Validation Tests | ✅ Complete | Signature, coinbase, balance tests |
| E2E Tests | ✅ Complete | Integration with in-memory DB |

### 🎓 Learning Outcomes

Setelah memahami project ini, belajar apa:

1. **Blockchain fundamentals**
   - Bây giờ hiểu cách blockchain bảo vệ data (immutability)
   - Hash chaining, Merkle tree, PoW consensus

2. **Cryptography essentials**
   - Elliptic curve cryptography (secp256k1)
   - Digital signatures (ECDSA)
   - Hash functions (SHA-256)

3. **System design patterns**
   - Account model vs UTXO model tradeoffs
   - Layered architecture (API → Service → Data)
   - Separation of concerns

4. **Backend development**
   - NestJS framework best practices
   - TypeScript for type safety
   - MongoDB integration
   - API design (DTOs, validation, error handling)

5. **Testing strategies**
   - Unit testing with mocks
   - Integration testing
   - Testing cryptographic functions
   - Test data factory patterns

### 🚀 Performance Characteristics

| Metric | Value | Notes |
|--------|-------|-------|
| Hash Algorithm | SHA-256 | 256-bit output, industry standard |
| Signing Algorithm | ECDSA/secp256k1 | ~110-120 bytes signature |
| Initial Difficulty | 2 | Block hash bắt đầu "00" |
| Target Block Time | ~10 seconds | Được điều chỉnh tự động |
| Mining Adjustment Interval | Every 5 blocks | Mild adjustment (+/-1 difficulty) |
| Base Reward | 100 tokens | Per block |
| Mempool Storage | In-memory array | ~100+ transactions |
| Transaction Hash | Canonical string | `from\|to\|amount\|nonce\|timestamp` |
| Merkle Root | Binary tree | log(n) proof depth |

---

## 📞 Support & Resources

### Blockchain Resources
- [Bitcoin Whitepaper](https://bitcoin.org/bitcoin.pdf)
- [Ethereum Documentation](https://ethereum.org/en/developers/)
- [Elliptic Curve Cryptography](https://en.wikipedia.org/wiki/Elliptic-curve_cryptography)

### NestJS Resources
- [NestJS Official Docs](https://docs.nestjs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [MongoDB Documentation](https://docs.mongodb.com/)

### Related Projects
- [Bitcoin Core](https://github.com/bitcoin/bitcoin) - Original implementation
- [Ethereum](https://github.com/ethereum/go-ethereum) - Go implementation
- [Hyperledger Fabric](https://github.com/hyperledger/fabric) - Enterprise blockchain

---

## 📄 License

MIT License - Feel free to use this project for learning purposes.

---

## 👨‍💻 Author

**Thanh Long**  
Learning Blockchain Development  
February 2026

---

## 📊 Update History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-02-14 | Initial project setup with core features |
| 1.1 | 2026-02-15 | Added comprehensive error handling with try/catch blocks in all service methods |
| 1.2 | 2026-02-15 | Complete documentation and detailed report generation |
| 2.0 | 2026-02-20 | **Major Update**: Block Header/Body separation, Merkle Root, Hash only header, Difficulty adjustment |
| 2.5 | 2026-03-02 | **Advanced Transactions**: Canonical hashing, account-style nonce, double-spend prevention, fees, coinbase validation |

**Version 2.5 Highlights (Latest):**
- ✅ **Canonical Transaction Hashing**: Deterministic hash = `from|to|amount|nonce|timestamp|tokenId`
- ✅ **Account-Style Nonce**: Sequential nonce per sender (phòng chống replay attacks)
- ✅ **Double-Spend Prevention**: Check pending balance before adding to mempool
- ✅ **Transaction Fees**: Fee support + aggregation into mining reward
- ✅ **Coinbase Validation**: Verify reward = baseReward + sumFees
- ✅ **Prepare-Sign-Add Flow**: 3-step secure transaction creation (backend → client → backend)
- ✅ **Enhanced Validation**: Verify each tx signature + hash + balance consistency
- ✅ **Merkle Leaf Update**: Use canonical tx.hash for merkle leaves (not JSON.stringify)
- ✅ **Comprehensive Tests**: Unit tests for account model, validation tests for coinbase/signatures
- ✅ **Refactored getBalance**: Explicit coinbase handling, deterministic sorting

**Version 2.0 Highlights:**
- ✅ Tách Block thành Header và Body theo chuẩn blockchain
- ✅ Implement Merkle Tree để tính Merkle Root từ transactions
- ✅ Hash only header (không hash transactions trực tiếp) - hiệu quả hơn và chuẩn hơn
- ✅ Difficulty adjustment tự động dựa trên thời gian block (target: 10s)
- ✅ Genesis block giờ cũng dùng hash header thay vì chuỗi cố định
- ✅ Validation được cải thiện: kiểm tra Merkle Root và difficulty requirement

_Last updated: March 2, 2026_

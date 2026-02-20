# 🔗 Blockchain Learning Project - Báo Cáo Chi Tiết

## 📋 Mục Lục
1. [Tổng Quan Dự Án](#tổng-quan-dự-án)
2. [Mục Tiêu Học Tập](#mục-tiêu-học-tập)
3. [Công Nghệ & Stack](#công-nghệ--stack)
4. [Kiến Trúc Hệ Thống](#kiến-trúc-hệ-thống)
5. [Tính Năng Chi Tiết](#tính-năng-chi-tiết)
6. [API Documentation](#api-documentation)
7. [Mô Hình Dữ Liệu](#mô-hình-dữ-liệu)
8. [Cryptography & Security](#cryptography--security)
9. [Cài Đặt & Chạy](#cài-đặt--chạy)
10. [Ví Dụ Sử Dụng](#ví-dụ-sử-dụng)
11. [Luồng Hoạt Động](#luồng-hoạt-động)
12. [Error Handling](#error-handling)
13. [Key Learnings](#key-learnings)
14. [Phát Triển Trong Tương Lai](#phát-triển-trong-tương-lai)

---

## 🎯 Tổng Quan Dự Án

**Blockchain Learning Project** là một triển khai giáo dục minh họa cơ chế hoạt động của blockchain sử dụng:
- **NestJS** - Framework Node.js mạnh mẽ với TypeScript
- **MongoDB** - Cơ sở dữ liệu NoSQL để lưu trữ blocks
- **Elliptic Cryptography** - Cho digital signatures (secp256k1 - chuẩn Bitcoin/Ethereum)
- **SHA-256 Hashing** - Để bảo vệ dữ liệu blocks

Dự án tập trung vào việc minh họa các khái niệm cơ bản của blockchain một cách dễ hiểu và có thể thực hành.

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

#### Sign Transaction
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

#### Add Transaction to Mempool
```http
POST /transaction
Content-Type: application/json

Request:
{
  "from_address": "...",
  "to_address": "...",
  "amount": 50,
  "signature": "..."
}

Response (201):
{
  "from_address": "...",
  "to_address": "...",
  "amount": 50,
  "signature": "..."
}

Error (400):
{
  "message": "Failed to add transaction to mempool: Invalid transaction signature",
  "statusCode": 400
}
```

#### Get Pending Transactions
```http
GET /transactions/pending

Response (200):
[
  { "from_address": "...", "to_address": "...", "amount": 50, "signature": "..." },
  { "from_address": "...", "to_address": "...", "amount": 30, "signature": "..." }
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
  signature: String,          // Chữ ký số (ECDSA DER format)
  createdAt: Date,
  updatedAt: Date
}
```

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

**Version 2.0 Highlights:**
- ✅ Tách Block thành Header và Body theo chuẩn blockchain
- ✅ Implement Merkle Tree để tính Merkle Root từ transactions
- ✅ Hash only header (không hash transactions trực tiếp) - hiệu quả hơn và chuẩn hơn
- ✅ Difficulty adjustment tự động dựa trên thời gian block (target: 10s)
- ✅ Genesis block giờ cũng dùng hash header thay vì chuỗi cố định
- ✅ Validation được cải thiện: kiểm tra Merkle Root và difficulty requirement

_Last updated: February 20, 2026_

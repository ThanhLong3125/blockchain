# 🔗 Hệ thống Blockchain (NestJS + MongoDB)

Dự án này là một triển khai minh họa một blockchain đơn giản bằng **NestJS** + **TypeScript** và sử dụng **MongoDB** cho lưu trữ. Mục tiêu: minh họa cơ chế hashing, ký số, mining, mempool và cung cấp API để thao tác (ví, giao dịch, mining, kiểm tra chuỗi).

---

## ⚙️ Tính năng chính

- Tạo ví (public/private key) và trả về `publicKey` / `privateKey`.
- Ký giao dịch bằng `privateKey` và xác thực chữ ký bằng `publicKey`.
- Quản lý mempool: thêm giao dịch chưa xác nhận.
- Khai thác (Proof-of-Work) để tạo block mới và nhận phần thưởng.
- Tính toán SHA-256 hash cho block và giao dịch.
- Lưu trữ block/giao dịch bằng MongoDB (Mongoose).
- API REST để tương tác với blockchain.

---

## Mục đích & tác dụng

- Minh họa cách blockchain bảo vệ dữ liệu: hash liên kết block để ngăn thay đổi lịch sử.
- Thể hiện vai trò của chữ ký số trong xác thực giao dịch.
- Giải thích cơ chế Proof-of-Work và mempool.

---

## Cấu trúc chính (tóm tắt)

- `src/controller/blockchain.controller.ts` — REST API (ví, giao dịch, mining, blockchain).
- `src/services/blockchain.service.ts` — Business logic (mempool, tạo block, mining, validate).
- `src/dto/` — DTOs cho các endpoint (ví dụ: `transaction.dto.ts`, `sign-transaction.dto.ts`, `verify-transaction.dto.ts`, `mine.dto.ts`).
- `src/utils/` — Utilities: hashing, sign, verify, mine, wallet.
- `src/entities/` — Entity / schema cho Mongoose.

---

## API chính (tóm tắt)

- `POST /api/blockchain/wallet/create` — Tạo ví mới.
- `POST /api/blockchain/transaction/sign` — Ký giao dịch. Body: `SignTransactionDto` (gồm `transaction` và `privateKey`).
- `POST /api/blockchain/transaction/verify` — Xác thực giao dịch. Body: `VerifyTransactionDto`.
- `POST /api/blockchain/transaction` — Thêm giao dịch vào mempool. Body: `TransactionDto`.
- `POST /api/blockchain/mine` — Khai thác pending transactions. Body: `MineDto` (gồm `minerAddress`).
- `GET /api/blockchain` — Lấy toàn bộ blockchain.
- `GET /api/blockchain/validate` — Kiểm tra tính toàn vẹn của blockchain.
- `GET /api/blockchain/balance/:address` — Lấy số dư cho `address`.

> Lưu ý: shapes của request/response được định nghĩa trong `src/dto/`.

---

## Cài đặt & chạy

Yêu cầu: Node.js v18+, npm/yarn, MongoDB.

1. Cài dependencies:

```bash
npm install
```

2. Tạo file `.env` (ví dụ):

```env
PORT=3000
DATABASE_URL=mongodb://localhost:27017/blockchain
NODE_ENV=development
```

3. Chạy dev server:

```bash
npm run start:dev
```

4. Build production:

```bash
npm run build
npm run start:prod
```

---

## Ví dụ nhanh (curl)

Tạo ví:

```bash
curl -X POST http://localhost:3000/api/blockchain/wallet/create
```

Ký giao dịch:

```bash
curl -X POST http://localhost:3000/api/blockchain/transaction/sign \
  -H "Content-Type: application/json" \
  -d '{
    "transaction": { "from_address":"<pub>", "to_address":"<addr>", "amount": 1 },
    "privateKey": "<priv>"
  }'
```

Khai thác pending transactions:

```bash
curl -X POST http://localhost:3000/api/blockchain/mine \
  -H "Content-Type: application/json" \
  -d '{ "minerAddress": "<miner_public_key>" }'
```

---

## Flow (Luồng hoạt động của hệ thống)

Dưới đây là luồng thao tác điển hình từ tạo ví đến block được thêm vào chuỗi:

1. Step 1 — Tạo ví (Generate keys)

- Endpoint: `POST /api/blockchain/wallet/create`
- Kết quả: nhận `privateKey` (giữ bí mật) và `publicKey` (dùng làm `from_address`).

2. Step 2 — Tạo & Ký giao dịch (Create & Sign Transaction)

- Tạo object giao dịch với `from_address`, `to_address`, `amount`.
- Ký: `POST /api/blockchain/transaction/sign` (Body: `SignTransactionDto`).
- Kết quả: giao dịch có `signature`.

3. Step 3 — Thêm giao dịch vào mempool (Broadcast / Submit)

- Endpoint: `POST /api/blockchain/transaction` (Body: `TransactionDto`).
- Giao dịch nằm trong mempool chờ được khai thác.

4. Step 4 — Xác thực giao dịch (Optional verify)

- Endpoint: `POST /api/blockchain/transaction/verify` (Body: `VerifyTransactionDto`).
- Hệ thống kiểm tra chữ ký dựa trên `from_address` và `signature`.

5. Step 5 — Khai thác pending transactions (Mining)

- Node miner gọi: `POST /api/blockchain/mine` (Body: `MineDto` với `minerAddress`).
- Service thu các giao dịch pending, tạo block, tìm `nonce` thỏa difficulty (Proof-of-Work), và thêm reward.

6. Step 6 — Thêm block vào blockchain

- Sau khi mining thành công, block được push vào chuỗi và lưu vào MongoDB.
- Mempool được làm rỗng hoặc loại bỏ các giao dịch đã được xác nhận.

7. Step 7 — Validate & Sync

- Kiểm tra tính hợp lệ: `GET /api/blockchain/validate`.
- Kiểm tra `previous_hash`, index và signatures.

8. Step 8 — Query trạng thái (Balance / Chain)

- Lấy balance: `GET /api/blockchain/balance/:address`.
- Lấy toàn bộ chain hoặc block cụ thể: `GET /api/blockchain`.

Luồng này phù hợp cho môi trường demo/local. Trong mạng nhiều node, sẽ có thêm bước broadcast block và sync giữa các node.

---

## 📖 Swagger UI

Truy cập `http://localhost:3000/api/docs` để xem tất cả API và test trực tiếp.

---

## 🏗️ Kiến Trúc Hệ Thống

```
┌──────────────────────────────┐
│  BlockchainController        │  (REST API Layer)
└──────────────┬───────────────┘
               │
┌──────────────▼───────────────┐
│  BlockchainService           │  (Business Logic)
└──────────────┬───────────────┘
               │
       ┌───────┴─────────┐
       │                 │
   ┌───▼─────┐      ┌────▼────┐
   │ MongoDB  │      │Utilities │
   │ (Data)  │      │(Pure FN) │
   └─────────┘      └──────────┘
                    ├─ calculate_hash
                    ├─ mine_block
                    ├─ createWallet
                    ├─ signTransaction
                    ├─ verifyTransaction
                    └─ calculateTransactionHash
```

---

## 📝 Testing

```bash
npm test          # unit tests
npm run test:e2e  # e2e tests
```

---

## License

MIT

---

_Last updated: February 14, 2026_

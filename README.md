<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

# 🔗 Hệ thống Blockchain (NestJS + MongoDB)

Project này là một triển khai minh họa một blockchain đơn giản dùng NestJS, TypeScript và MongoDB. Bao gồm cơ chế Proof-of-Work (mining), SHA-256 hashing, lưu chuỗi block vào MongoDB và API để quản lý/kiểm tra chuỗi.

## ⚙️ Tính năng chính

- Tạo Genesis Block và thêm block mới
- Mining bằng Proof-of-Work (difficulty configurable trong code)
- Tính hash bằng SHA-256 (bao gồm `index`, `timestamp`, `nfts`, `previousHash`, `nonce`)
- Lưu block và chuỗi vào MongoDB qua Mongoose
- Xác thực toàn bộ blockchain (kiểm tra `previous_hash`, `index` tuần tự)
- API document bằng Swagger UI

## Cấu trúc thư mục (tóm tắt)

```
src/
  controller/
    blockchain.controller.ts   # REST API cho blockchain
  services/
    blockchain.service.ts     # Quản lý chuỗi, validate
    block.service.ts          # Tạo và mine block
  entities/
    block.entity.ts           # Mongoose class cho Block
    blockchain.entity.ts      # Mongoose class cho Blockchain
    nft.entity.ts             # Mongoose class cho NFT
  dto/
    create_block.dto.ts       # DTO cho tạo block
  schemas/
    block.schema.ts
    blockchain.schema.ts
  utils/
    calculate_hash.utils.ts   # Tính SHA-256
    mine_block.util.ts        # Mining loop
  app.module.ts
  main.ts
```

## Yêu cầu (Requirements)

- Node.js (v18+ recommended)
- Yarn
- MongoDB (local hoặc Atlas)

## Cài đặt & chạy nhanh

1. Cài dependencies:

```bash
yarn install
```

2. Tạo file `.env` với tối thiểu:

```env
PORT=3000
DATABASE_URL=mongodb://localhost:27017/blockchain
NODE_ENV=development
```

3. Chạy ứng dụng (dev):

```bash
yarn start:dev
```

Ứng dụng mặc định chạy trên `http://localhost:3000` và Swagger UI tại `http://localhost:3000/api/docs`.

## API (tóm tắt)

- POST `/api/blockchain/genesis-block` — tạo genesis block
- GET `/api/blockchain` — lấy toàn bộ blockchain
- GET `/api/blockchain/validate` — validate toàn bộ blockchain
- GET `/api/blockchain/latest-block` — lấy block mới nhất
- POST `/api/blockchain` — thêm block mới (body: `index`, `previous_hash`, `nfts`)

Chi tiết request/response xem trong Swagger UI.

## Lưu ý về `timestamp` và `createdAt/updatedAt`

- `timestamp` (số nguyên milliseconds) là phần dữ liệu của blockchain và được dùng để tính hash và mining.
- `createdAt`/`updatedAt` là metadata do Mongoose (`@Schema({ timestamps: true })`) tự thêm — kiểu `Date` và phục vụ mục đích lưu trữ, không thay thế `timestamp` để tính hash.

## Mô hình dữ liệu (tóm tắt)

Block (ví dụ):

```json
{
  "_id": "...",
  "index": 1,
  "hash": "...",
  "previous_hash": "...",
  "nonce": 123,
  "timestamp": 1707776500000,
  "nfts": [],
  "createdAt": "2026-02-12T...",
  "updatedAt": "2026-02-12T..."
}
```

## Commit & Push lên GitHub (hướng dẫn nhanh)

1. Khởi tạo git nếu chưa có:

```bash
git init
git add .
git commit -m "Initial commit - blockchain"
```

2. Tạo repo trên GitHub (từ web hoặc dùng `gh`):

```bash
# nếu đã cài GitHub CLI
gh repo create <your-username>/<repo-name> --public --source=. --remote=origin --push

# hoặc tạo remote thủ công
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

> Lưu ý: máy của bạn cần cài `gh` và đăng nhập, hoặc dùng PAT để push.

## Testing

```bash
yarn test        # unit
yarn test:e2e    # e2e
```

## Gợi ý tinh chỉnh

- Thay đổi `difficulty` trong `mine_block.util.ts` để thử tốc độ/độ khó.
- Nếu muốn lưu thêm metadata, extend `BlockEntity`.

## License

MIT

---

Last updated: February 12, 2026

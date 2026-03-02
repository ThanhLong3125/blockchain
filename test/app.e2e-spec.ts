import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import * as mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

// Increase default Jest timeout because network/setup may take time
jest.setTimeout(30000);


describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let mongod: MongoMemoryServer;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    process.env.DATABASE_URL = mongod.getUri();
  });

  afterAll(async () => {
    if (mongod) await mongod.stop();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    // clear database to start fresh
    await mongoose.connection.db.dropDatabase();
  });

  afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
    await app?.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('should execute full transaction flow with nonce and balances', async () => {
    // create two wallets
    const wA = (await request(app.getHttpServer()).post('/api/blockchain/wallet/create')).body;
    const wB = (await request(app.getHttpServer()).post('/api/blockchain/wallet/create')).body;

    // mine one block to give A some balance
    await request(app.getHttpServer()).post('/api/blockchain/mine').send({ minerAddress: wA.publicKey });
    let balA = (await request(app.getHttpServer()).get('/api/blockchain/balance/' + wA.publicKey)).body;
    expect(balA).toBe(100);

    // prepare transaction from A to B
    const prep = (await request(app.getHttpServer())
      .post('/api/blockchain/transaction/prepare')
      .send({ from_address: wA.publicKey, to_address: wB.publicKey, amount: 30, fee: 1 }))
      .body;
    expect(prep.nonce).toBe(1);

    // sign it
    const signed = (await request(app.getHttpServer())
      .post('/api/blockchain/transaction/sign')
      .send({ transaction: prep, privateKey: wA.privateKey }))
      .body;
    expect(signed.signature).toBeDefined();

    // add to mempool
    await request(app.getHttpServer()).post('/api/blockchain/transaction').send(signed).expect(201);

    // pending balance check: second tx overspend should be rejected
    const prep2 = (await request(app.getHttpServer())
      .post('/api/blockchain/transaction/prepare')
      .send({ from_address: wA.publicKey, to_address: wB.publicKey, amount: 80, fee: 1 })).body;
    const signed2 = (await request(app.getHttpServer())
      .post('/api/blockchain/transaction/sign')
      .send({ transaction: prep2, privateKey: wA.privateKey })).body;
    await request(app.getHttpServer()).post('/api/blockchain/transaction').send(signed2).expect(400);

    // prepare another valid tx with correct nonce
    const prep3 = (await request(app.getHttpServer())
      .post('/api/blockchain/transaction/prepare')
      .send({ from_address: wA.publicKey, to_address: wB.publicKey, amount: 60, fee: 1 })).body;
    expect(prep3.nonce).toBe(2);
    // tamper nonce to wrong value
    prep3.nonce = 0;
    const signed3 = (await request(app.getHttpServer())
      .post('/api/blockchain/transaction/sign')
      .send({ transaction: prep3, privateKey: wA.privateKey })).body;
    await request(app.getHttpServer()).post('/api/blockchain/transaction').send(signed3).expect(400);
  });

  it('should include fees in miner reward when mining', async () => {
    const wA = (await request(app.getHttpServer()).post('/api/blockchain/wallet/create')).body;
    const wB = (await request(app.getHttpServer()).post('/api/blockchain/wallet/create')).body;

    // fund A with one mined block
    await request(app.getHttpServer()).post('/api/blockchain/mine').send({ minerAddress: wA.publicKey });

    // create two transactions each with fee 2
    for (let amt of [10, 5]) {
      const prep = (await request(app.getHttpServer())
        .post('/api/blockchain/transaction/prepare')
        .send({ from_address: wA.publicKey, to_address: wB.publicKey, amount: amt, fee: 2 })).body;
      const signed = (await request(app.getHttpServer())
        .post('/api/blockchain/transaction/sign')
        .send({ transaction: prep, privateKey: wA.privateKey })).body;
      await request(app.getHttpServer()).post('/api/blockchain/transaction').send(signed);
    }

    // mine with B as miner
    const mineRes = (await request(app.getHttpServer()).post('/api/blockchain/mine').send({ minerAddress: wB.publicKey })).body;
    // reward should equal baseReward 100 + total fees 4
    expect(mineRes.reward).toBe(104);

    // check B balance
    const balB = (await request(app.getHttpServer()).get('/api/blockchain/balance/' + wB.publicKey)).body;
    expect(balB).toBe(104);
  });
});

import { createWallet } from './utils/wallet.util';
import { signTransaction } from './utils/sign.util';
import { verifyTransaction } from './utils/verify.util';
import { TransactionEntity } from './entities/transaction.entity';

describe('🔗 Blockchain Features Test - Understanding How It Works', () => {
  
  // ========================================
  // 1️⃣ WALLET CREATION WITH ELLIPTIC CRYPTOGRAPHY
  // ========================================
  describe('1️⃣ Wallet Creation Using secp256k1 (Bitcoin/Ethereum Standard)', () => {
    it('should generate a wallet with private and public keys', () => {
      console.log('\n📝 Test: Create a Wallet (secp256k1)');
      
      const wallet = createWallet();
      
      console.log('✅ Wallet Generated:');
      console.log('  ├─ Private Key (hex):', wallet.privateKey.substring(0, 16) + '...');
      console.log('  ├─ Public Key (hex) :', wallet.publicKey.substring(0, 16) + '...');
      console.log('  ├─ Key Type        : secp256k1 (Bitcoin/Ethereum standard)');
      console.log('  └─ Use Case        : Digitally sign transactions');

      expect(wallet.privateKey).toBeDefined();
      expect(wallet.publicKey).toBeDefined();
      expect(wallet.privateKey.length).toBeGreaterThan(0);
      expect(wallet.publicKey.length).toBeGreaterThan(0);
    });

    it('should generate unique wallets each time', () => {
      console.log('\n📝 Test: Generate Multiple Unique Wallets');
      
      const wallet1 = createWallet();
      const wallet2 = createWallet();
      const wallet3 = createWallet();

      console.log('✅ Created 3 wallets:');
      console.log('  Wallet 1:', wallet1.publicKey.substring(0, 16) + '...');
      console.log('  Wallet 2:', wallet2.publicKey.substring(0, 16) + '...');
      console.log('  Wallet 3:', wallet3.publicKey.substring(0, 16) + '...');

      // Each wallet should have a unique public key
      expect(wallet1.publicKey).not.toBe(wallet2.publicKey);
      expect(wallet2.publicKey).not.toBe(wallet3.publicKey);
      expect(wallet1.privateKey).not.toBe(wallet2.privateKey);
    });
  });

  // ========================================
  // 2️⃣ DIGITAL SIGNATURE SYSTEM
  // ========================================
  describe('2️⃣ Digital Signatures - Proving Ownership Without Revealing Private Key', () => {
    it('should sign a transaction and create a verifiable signature', () => {
      console.log('\n📝 Test: Sign a Transaction');
      
      const wallet = createWallet();
      
      const transaction: TransactionEntity = {
        from_address: wallet.publicKey,
        to_address: 'bob_public_key_here',
        amount: 50,
        signature: '',
      };

      console.log('📨 Original Transaction:');
      console.log('  ├─ From   :', transaction.from_address.substring(0, 12) + '...');
      console.log('  ├─ To     :', transaction.to_address);
      console.log('  ├─ Amount :', transaction.amount, 'coins');
      console.log('  └─ Time   :', new Date().toISOString());

      // Sign the transaction with private key
      const signedTx = signTransaction(transaction, wallet.privateKey);

      console.log('\n✅ Transaction Signed:');
      console.log('  ├─ Signature (DER format):', signedTx.signature.substring(0, 20) + '...');
      console.log('  ├─ Signature Length      :', signedTx.signature.length, 'chars');
      console.log('  └─ Can be verified with  : Public Key (without revealing private key)');

      expect(signedTx.signature).toBeDefined();
      expect(signedTx.signature.length).toBeGreaterThan(0);
      expect(signedTx).toEqual(transaction); // Same object, signature added
    });

    it('should verify a valid signed transaction', () => {
      console.log('\n📝 Test: Verify Valid Transaction Signature');
      
      const wallet = createWallet();
      
      const transaction: TransactionEntity = {
        from_address: wallet.publicKey,
        to_address: 'recipient_public_key',
        amount: 100,
        signature: '',
      };

      // Sign it
      const signedTx = signTransaction(transaction, wallet.privateKey);

      // Verify it
      const isValid = verifyTransaction(signedTx);

      console.log('✅ Signature Verification:');
      console.log('  ├─ Is Valid           :', isValid ? '✓ YES' : '✗ NO');
      console.log('  ├─ Transaction Tampered:', isValid ? 'No (safe) ✓' : 'Yes (detected!) ✗');
      console.log('  └─ Method            : ECDSA (Elliptic Curve Digital Signature Algorithm)');

      expect(isValid).toBe(true);
    });

    it('should reject transactions with tampered data', () => {
      console.log('\n📝 Test: Detect Tampered Transaction');
      
      const wallet = createWallet();
      
      const transaction: TransactionEntity = {
        from_address: wallet.publicKey,
        to_address: 'recipient',
        amount: 50,
        signature: '',
      };

      const signedTx = signTransaction(transaction, wallet.privateKey);
      
      // Tamper with the transaction
      signedTx.amount = 500; // Changed amount!

      console.log('🔧 Transaction Tampering Attempt:');
      console.log('  ├─ Original Amount   : 50 coins');
      console.log('  ├─ Tampered Amount   : 500 coins');
      console.log('  ├─ Original Signature: Valid for 50 coins');
      console.log('  └─ Result            :');

      try {
        const isValid = verifyTransaction(signedTx);
        console.log('    ✓ Tampered transaction rejected:', !isValid);
        expect(isValid).toBe(false);
      } catch (error) {
        console.log('    ✓ Tampered transaction rejected with error');
        expect(error).toBeDefined();
      }
    });

    it('should reject invalid signatures', () => {
      console.log('\n📝 Test: Reject Invalid/Fake Signature');
      
      const fakeSignedTx: TransactionEntity = {
        from_address: 'some_wallet_key',
        to_address: 'another_wallet',
        amount: 1000,
        signature: 'FAKE_SIGNATURE_DATA_NOT_VALID',
      };

      console.log('❌ Fake Transaction (manually created signature):');
      console.log('  ├─ Signature Type  : Invalid/Fake');
      console.log('  ├─ Verification    :');

      try {
        const isValid = verifyTransaction(fakeSignedTx);
        console.log('    ✓ Rejected:', !isValid);
        expect(isValid).toBe(false);
      } catch (error) {
        console.log('    ✓ Rejected with error');
        expect(error).toBeDefined();
      }
    });
  });

  // ========================================
  // 3️⃣ UNDERSTANDING KEY COMPONENTS
  // ========================================
  describe('3️⃣ Blockchain Core Concepts', () => {
    it('should demonstrate the cryptography chain', () => {
      console.log('\n📝 Test: Blockchain Cryptography Chain');
      
      console.log('\n🔗 Complete Blockchain Security Chain:\n');

      const wallet1 = createWallet();
      const wallet2 = createWallet();

      console.log('1️⃣  WALLET GENERATION (random)');
      console.log('   └─ Creates unique private/public key pair using elliptic curve');
      
      console.log('\n2️⃣  TRANSACTION CREATION');
      const tx: TransactionEntity = {
        from_address: wallet1.publicKey,
        to_address: wallet2.publicKey,
        amount: 75,
        signature: '',
      };
      console.log('   └─ Transaction data:',' ', tx);

      console.log('\n3️⃣  DIGITAL SIGNATURE');
      const signedTx = signTransaction(tx, wallet1.privateKey);
      console.log('   └─ Signature proves sender has private key without revealing it');
      console.log('      Signature:', signedTx.signature.substring(0, 30) + '...');

      console.log('\n4️⃣  SIGNATURE VERIFICATION');
      const isValid = verifyTransaction(signedTx);
      console.log('   ├─ Anyone with public key can verify');
      console.log('   ├─ Verification:', isValid ? 'PASSED ✓' : 'FAILED ✗');
      console.log('   └─ No private key exposure!');

      console.log('\n5️⃣  TRANSACTION SECURITY');
      console.log('   ├─ Transaction is tamper-proof');
      console.log('   ├─ Can\'t modify amount without breaking signature');
      console.log('   └─ Only holder of private key can sign');

      expect(isValid).toBe(true);
    });
  });

  // ========================================
  // 4️⃣ PRACTICAL WORKFLOW
  // ========================================
  describe('4️⃣ Complete Bitcoin-Style Transaction Workflow', () => {
    it('should demonstrate a real transaction flow', () => {
      console.log('\n🚀 COMPLETE TRANSACTION WORKFLOW\n');

      // Create participants
      console.log('📍 STEP 1: Create Wallets (Participants)');
      const alice = createWallet();
      const bob = createWallet();
      const charlie = createWallet();

      console.log('  Alice   wallet created');
      console.log('  Bob     wallet created');
      console.log('  Charlie wallet created');

      // Create transaction
      console.log('\n📍 STEP 2: Create Transaction');
      console.log('  Alice wants to send 100 coins to Bob');

      const tx: TransactionEntity = {
        from_address: alice.publicKey,
        to_address: bob.publicKey,
        amount: 100,
        signature: '',
      };

      console.log('  ├─ From: Alice\'s public key', alice.publicKey.substring(0, 12) + '...');
      console.log('  ├─ To: Bob\'s public key', bob.publicKey.substring(0, 12) + '...');
      console.log('  └─ Amount: 100 coins');

      // Sign transaction
      console.log('\n📍 STEP 3: Sign Transaction (Alice signs with her private key)');
      const signedTx = signTransaction(tx, alice.privateKey);
      console.log('  ✓ Transaction signed');
      console.log('  ✓ Signature proves Alice authorized this transaction');
      console.log('  ✓ Alice\'s private key never leaves her wallet');

      // Verify transaction
      console.log('\n📍 STEP 4: Verify Signature (Anyone can verify)');
      const isValid = verifyTransaction(signedTx);
      console.log('  ✓ Signature verified successfully:', isValid ? 'YES ✓' : 'NO ✗');
      console.log('  ✓ Anyone can verify using Alice\'s public key');
      console.log('  ✓ No private key needed for verification');

      // Try to tamper
      console.log('\n📍 STEP 5: Test Tamper Detection');
      const tamperedTx = { ...signedTx };
      tamperedTx.amount = 1000; // Try to change amount
      console.log('  🔧 Attacker tries to change amount from 100 to 1000...');

      try {
        const tamperedValid = verifyTransaction(tamperedTx);
        console.log('  ✓ Signature verification FAILED (tampered detected) ✓');
        expect(tamperedValid).toBe(false);
      } catch (error) {
        console.log('  ✓ Signature verification FAILED (tampered detected) ✓');
        expect(error).toBeDefined();
      }

      console.log('\n✅ TRANSACTION SECURITY VERIFIED!\n');
      expect(isValid).toBe(true);
    });
  });

  // ========================================
  // 5️⃣ KEY CONCEPTS EXPLAINED
  // ========================================
  describe('5️⃣ Understanding Blockchain Security', () => {
    it('should explain elliptic curve cryptography benefits', () => {
      console.log('\n📚 ELLIPTIC CURVE CRYPTOGRAPHY (secp256k1) - Why Blockchain Uses It\n');

      console.log('✅ Benefits of Elliptic Curve Cryptography:\n');
      console.log('1. 🔐 SECURITY');
      console.log('   ├─ 256-bit ECDSA is as secure as 2048-bit RSA');
      console.log('   ├─ Smaller signatures = faster validation');
      console.log('   └─ Used by Bitcoin & Ethereum\n');

      console.log('2. 🎯 DIGITAL SIGNATURES');
      console.log('   ├─ Sign with private key (only you have)');
      console.log('   ├─ Verify with public key (everyone can have)');
      console.log('   └─ Signature proves: sender + exact transaction\n');

      console.log('3. 💰 AUTHENTICATION');
      console.log('   ├─ Proves you own coins without revealing keys');
      console.log('   ├─ Nobody can fake your signature');
      console.log('   └─ Transaction cannot be modified after signing\n');

      console.log('4. ⚡ EFFICIENCY');
      console.log('   ├─ Small key sizes (256 bits)');
      console.log('   ├─ Fast computation');
      console.log('   └─ Suitable for millions of transactions\n');

      console.log('🔗 BLOCKCHAIN TRUST MODEL:');
      console.log('   1. User A signs transaction with private key');
      console.log('   2. Network receives transaction + signature');
      console.log('   3. Network verifies signature using public key');
      console.log('   4. If valid → transaction added to mempool → mined into block');
      console.log('   5. Once in blockchain → 100% immutable\n');

      const wallet = createWallet();
      expect(wallet).toBeDefined();
    });
  });
});


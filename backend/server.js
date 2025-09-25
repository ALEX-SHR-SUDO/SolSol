const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Connection, Keypair, PublicKey, clusterApiUrl } = require('@solana/web3.js');
const { createMint, getOrCreateAssociatedTokenAccount, mintTo } = require('@solana/spl-token');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const connection = new Connection(clusterApiUrl('devnet'));

// Сервисный кошелек для создания токенов (тестовый, хранится на сервере!)
// В боевом режиме используйте безопасный способ хранения ключей!
const SERVICE_KEYPAIR = Keypair.generate();

app.get('/', (req, res) => {
  res.send('SolSol Backend API');
});

// Эндпоинт: создание SPL-токена и минтинг на кошелек владельца
app.post('/api/create-token', async (req, res) => {
  try {
    const { name, symbol, decimals, amount, owner } = req.body;
    if (!owner) return res.status(400).json({ error: "owner (wallet address) required" });

    const ownerPubkey = new PublicKey(owner);

    // Создание нового токена
    const mint = await createMint(
      connection,
      SERVICE_KEYPAIR,
      SERVICE_KEYPAIR.publicKey,
      null,
      Number(decimals)
    );

    // Создание ассоциированного токен-аккаунта для владельца
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      SERVICE_KEYPAIR,
      mint,
      ownerPubkey
    );

    // Минтинг токенов на аккаунт владельца
    await mintTo(
      connection,
      SERVICE_KEYPAIR,
      mint,
      tokenAccount.address,
      SERVICE_KEYPAIR,
      Number(amount)
    );

    res.json({
      status: "Token Created",
      mint: mint.toBase58(),
      owner: owner,
      tokenAccount: tokenAccount.address.toBase58(),
      amount,
      decimals,
      name,
      symbol
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

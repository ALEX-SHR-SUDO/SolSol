import React, { useState } from 'react';
import { Connection, clusterApiUrl, PublicKey, Keypair, Transaction, SystemProgram } from '@solana/web3.js';

const connection = new Connection(clusterApiUrl('devnet'));

function App() {
  const [wallet, setWallet] = useState(null);
  const [form, setForm] = useState({
    name: '',
    symbol: '',
    decimals: 0,
    amount: 0
  });
  const [result, setResult] = useState(null);

  // Подключение Phantom
  const connectWallet = async () => {
    if (window.solana && window.solana.isPhantom) {
      const resp = await window.solana.connect();
      setWallet(resp.publicKey.toString());
    } else {
      alert("Установите Phantom Wallet!");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!wallet) {
      alert("Подключите кошелек Phantom!");
      return;
    }
    // Отправка запроса на backend для создания токена
    const res = await fetch('http://localhost:4000/api/create-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, owner: wallet })
    });
    const data = await res.json();
    setResult(data);
  };

  return (
    <div style={{
      maxWidth: 420, margin: '40px auto', padding: 24, background: '#f8f8fa',
      borderRadius: 12, boxShadow: '0 2px 8px #0002', fontFamily: 'Arial,sans-serif'
    }}>
      <h1 style={{ textAlign: 'center' }}>SolSol Token Creator</h1>
      <button
        onClick={connectWallet}
        style={{
          width: '100%', padding: '10px 0', background: wallet ? '#34c759' : '#5c32e6',
          color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', marginBottom: 16
        }}
      >
        {wallet ? `Wallet: ${wallet.slice(0, 4)}...${wallet.slice(-4)}` : "Connect Phantom"}
      </button>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Token Name"
          value={form.name}
          onChange={handleChange}
          style={{ display: 'block', marginBottom: 10, width: '100%', padding: 8 }}
          required
        />
        <input
          name="symbol"
          placeholder="Token Symbol"
          value={form.symbol}
          onChange={handleChange}
          style={{ display: 'block', marginBottom: 10, width: '100%', padding: 8 }}
          required
        />
        <input
          name="decimals"
          placeholder="Decimals"
          type="number"
          value={form.decimals}
          onChange={handleChange}
          style={{ display: 'block', marginBottom: 10, width: '100%', padding: 8 }}
          min={0}
          required
        />
        <input
          name="amount"
          placeholder="Amount"
          type="number"
          value={form.amount}
          onChange={handleChange}
          style={{ display: 'block', marginBottom: 10, width: '100%', padding: 8 }}
          min={1}
          required
        />
        <button
          type="submit"
          style={{
            width: '100%', padding: '10px 0', background: '#5c32e6',
            color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer'
          }}>
          Create Token
        </button>
      </form>
      {result &&
        <div style={{ marginTop: 24, padding: 12, background: '#e4eeff', borderRadius: 8 }}>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      }
    </div>
  );
}

export default App;
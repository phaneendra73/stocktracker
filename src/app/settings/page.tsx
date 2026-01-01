"use client";

import { useState } from "react";

export default function Settings() {
  const [index, setIndex] = useState("NIFTY 50");
  const [symbol, setSymbol] = useState("^NSEI");
  const [drop, setDrop] = useState(5);

  return (
    <main style={{ padding: 24, maxWidth: 420 }}>
      <h2>⚙️ Settings</h2>

      <label>Index Name</label>
      <input value={index} onChange={e => setIndex(e.target.value)} />

      <label>Symbol</label>
      <input value={symbol} onChange={e => setSymbol(e.target.value)} />

      <label>Drop %</label>
      <input
        type="number"
        value={drop}
        onChange={e => setDrop(Number(e.target.value))}
      />

      <button style={{ marginTop: 12 }}>Save</button>
    </main>
  );
}

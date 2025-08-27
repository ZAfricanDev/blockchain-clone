import { pools } from "../assets/pools/pools";

export type MinerInfo = {
  name: string;
  link: string;
};

function hexToAscii(hex: string): string {
  let str = "";
  for (let i = 0; i < hex.length; i += 2) {
    const code = parseInt(hex.substr(i, 2), 16);
    if (code === 0) break; // stop at null byte
    str += String.fromCharCode(code);
  }
  return str;
}

export function findMiningPool(coinbaseHex: string): MinerInfo | null {
  const ascii = hexToAscii(coinbaseHex).toLowerCase();

  for (const key in pools.coinbase_tags) {
    const normalizedKey = key.replace(/\//g, "").toLowerCase();
    if (ascii.includes(normalizedKey)) {
      return (pools.coinbase_tags as Record<string, MinerInfo>)[key];
    }
  }

  return null;
}

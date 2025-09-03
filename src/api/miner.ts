import { pools } from "../assets/pools/pools";

export type MinerInfo = {
  name: string;
  link: string;
};

export function hexToAscii(hex: string): string {
  let str = "";
  for (let i = 0; i < hex.length; i += 2) {
    const code = parseInt(hex.slice(i, i + 2), 16);
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

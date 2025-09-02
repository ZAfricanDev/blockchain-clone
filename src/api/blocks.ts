import { findMiningPool, MinerInfo } from "./miner";

export type LatestBlockResponse = {
  hash: string;
  time: string;
  height: number;
  txIndexes?: number[];
  size: number;
};

export type UiTransaction = {
  hash: string;
  inputs: string[];
  outputs: string[];
  fee: string;
  value: string;
  confirmations: number;
  timestamp: string;
  values: string[];
  feeDetails?: string;
  total: string;
};

export type PrevOut = {
  addr?: string;
  value?: number | string;
  [k: string]: any;
};

export type TxInput = {
  prev_out?: PrevOut | null;
  [k: string]: any;
};

export type TxOutput = {
  addr?: string;
  value?: number | string;
  [k: string]: any;
};

export type Transaction = {
  hash: string;
  inputs?: TxInput[] | any;
  out?: TxOutput[] | any;
  time?: number;
  [k: string]: any;
};

export type Block = {
  miner: MinerInfo | null;
  hash: string;
  time?: number;
  height?: number;
  n_tx?: number;
  tx: Transaction[];
  relayed_by?: string;
  bits?: number;
  difficulty?: number;
  fee?: number;
  confirmations?: number;
  [k: string]: any;
};

export const TARGET_COUNT = 20;

export function timeAgo(ms: number): string {
  const now = Date.now();
  const diff = now - ms;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (seconds < 60) return `${seconds} seconds ago`;
  if (minutes < 60) return `${minutes} minutes ago`;
  if (hours < 24) return `${hours} hours ago`;
  return `${days} days ago`;
}

export function condenseHash(
  hash: string,
  startLength = 1,
  endLength = 40
): string {
  if (!hash) return "";
  if (hash.length <= startLength + endLength) return hash;
  return `${hash.slice(0, startLength)}...${hash.slice(-endLength)}...`;
}

type BlockResponse = {
  block_index: number;
  hash: string;
  height: number;
  time: number;
};

export async function getLastBlocks(
  limit: number,
  fromTime: number,
  daysBack: number
): Promise<Block[]> {
  const FIVE_MINUTES_MS = 5 * 60 * 1000;

  const lastRetrieved = Number(localStorage.getItem("block_info_time")) || 0;

  if (Date.now() - lastRetrieved < FIVE_MINUTES_MS) {
    const stored = localStorage.getItem("block_info");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Block[];
        // Respect the requested limit
        return Array.isArray(parsed) ? parsed.slice(0, limit) : [];
      } catch (err) {
        console.warn(
          "Unable to parse block_info from localStorage, fetching remotely",
          err
        );
      }
    }
  }

  const url = `https://blockchain.info/blocks/${fromTime}?format=json&cors=true`;
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text().catch(() => null);
    throw { status: res.status, statusText: res.statusText, body };
  }
  const json: BlockResponse[] = await res.json();

  const cutoff = Math.floor(fromTime / 1000) - daysBack * 24 * 60 * 60;

  const latestHeight = json[0]?.height ?? 0;
  localStorage.setItem("latestBlockHeight", latestHeight.toString());

  const relevantItems = json.filter((b) => b.time >= cutoff).slice(0, limit);

  const results = await Promise.all(
    relevantItems.map(async (item) => {
      return fetchBlockByHash(item.hash);
    })
  );

  localStorage.setItem("block_info", JSON.stringify(results));

  localStorage.setItem("block_info_time", String(Date.now()));

  return results;
}

export async function fetchBlockByHash(blockHash: string): Promise<Block> {
  if (!blockHash) throw new Error("blockHash required");
  const res = await fetch(
    `https://blockchain.info/rawblock/${encodeURIComponent(
      blockHash
    )}?cors=true`
  );
  if (!res.ok) {
    const body = await res.text().catch(() => null);
    throw { status: res.status, statusText: res.statusText, body };
  }
  const json = (await res.json()) as Block;
  // Limit tx to 20 due to local storage constraint
  json.tx = json.tx.slice(0, 20);

  return { ...json, miner: findMiningPool(json.tx[0]?.inputs[0].script) };
}

export type Prices = { BTC: number; ETH: number; BCH: number };

export async function fetchPrices(): Promise<Prices> {
  const res = await fetch("https://blockchain.info/ticker?cors=true");
  const valrResponse = await fetch(
    "https://api.valr.com/v1/public/ETHUSDT/marketsummary"
  );

  const json = await res.json();
  const valrJson = await valrResponse.json();

  return {
    BTC: json.USD?.last ?? -1,
    ETH: Number(valrJson.lastTradedPrice) ?? -1,
    BCH: json.BCH?.USD?.last ?? -1,
  };
}

const satoshiToBTC = (sat?: number | string) => {
  if (sat == null) return 0;
  const n = typeof sat === "string" ? parseInt(sat, 10) : sat;
  if (!Number.isFinite(n)) return 0;
  return n / 1e8;
};

export const formatBtc = (satoshis?: number | string) =>
  `${satoshiToBTC(satoshis).toFixed(8)} BTC`;

function safeInputs(inputs?: TxInput[] | any): TxInput[] {
  return Array.isArray(inputs) ? (inputs as TxInput[]) : [];
}

export function getBlockReward(transactions: any) {
  if (!transactions || transactions.length === 0) return 0;

  const coinbaseTx = transactions[0];

  const totalSatoshis = coinbaseTx.out.reduce(
    (sum: number, output: any) => sum + output.value,
    0
  );

  return formatBtc(totalSatoshis);
}

function bitsToTarget(bits: number): bigint {
  const exponent = bits >>> 24;
  const mantissa = bits & 0xffffff;
  return BigInt(mantissa) << BigInt(8 * (exponent - 3));
}

export function getDifficulty(bits: number): number {
  const maxTarget = bitsToTarget(0x1d00ffff); // difficulty 1 target
  const target = bitsToTarget(bits);
  return Number(maxTarget) / Number(target);
}

export function mapApiTxToUi(
  tx: Transaction,
  blockTime?: number
): UiTransaction {
  const inputsArr = safeInputs(tx.inputs);

  const inputs: string[] = inputsArr.map((inp: any) => {
    const prev = inp?.prev_out;
    if (prev && prev.addr) return prev.addr as string;
    return "COINBASE (Newly Generated Coins)";
  });

  const outputs: string[] = (Array.isArray(tx.out) ? tx.out : []).map(
    (o: any) => {
      const v = o?.value ?? 0;
      const addr = o?.addr ? `${o.addr} ` : "";
      return `${addr}${formatBtc(v)}`;
    }
  );

  const totalOutSat = (Array.isArray(tx.out) ? tx.out : []).reduce(
    (acc: number, o: any) => {
      const v =
        typeof o?.value === "string" ? parseInt(o.value, 10) : o?.value ?? 0;
      return acc + (Number.isFinite(v) ? v : 0);
    },
    0
  );

  const totalInSat = inputsArr.reduce((acc: number, inp: any) => {
    const prev = inp?.prev_out;
    const v = prev
      ? typeof prev.value === "string"
        ? parseInt(prev.value, 10)
        : prev.value ?? 0
      : 0;
    return acc + (Number.isFinite(v) ? v : 0);
  }, 0);

  const feeSat = totalInSat > 0 ? Math.max(0, totalInSat - totalOutSat) : NaN;
  const fee = Number.isFinite(feeSat) ? formatBtc(feeSat) : "-";
  const total = formatBtc(totalOutSat);
  const timestamp = tx.time
    ? new Date(tx.time * 1000).toLocaleString()
    : blockTime
    ? new Date(blockTime * 1000).toLocaleString()
    : "—";

  return {
    hash: tx.hash,
    inputs,
    outputs,
    fee,
    value: total,
    confirmations: 1,
    timestamp,
    values: outputs,
    feeDetails: undefined,
    total,
  };
}

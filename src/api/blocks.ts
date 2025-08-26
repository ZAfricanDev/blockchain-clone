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
  hash: string;
  time?: number;
  height?: number;
  n_tx?: number;
  tx?: Transaction[];
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

export type BlockSummary = LatestBlockResponse;

export async function getLastBlocks(
  limit: number,
  fromTime: number,
  daysBack: number
): Promise<BlockSummary[]> {
  const url = `https://blockchain.info/blocks/${fromTime}?format=json&cors=true`;
  const res = await fetch(url);
  const json: BlockResponse[] = await res.json();

  const cutoff = Math.floor(fromTime / 1000) - daysBack * 24 * 60 * 60;

  return json
    .filter((b) => b.time >= cutoff)
    .slice(0, limit)
    .map((b) => ({
      hash: b.hash,
      height: b.height,
      time: timeAgo(b.time * 1000),
      size: 0,
    }));
}

export async function fetchBlockByHash(
  blockHash: string,
  txLimit = 10
): Promise<Block> {
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

  if (Array.isArray(json.tx)) {
    const limit = Math.max(0, Math.floor(txLimit));
    if (limit === 0) json.tx = [];
    else if (json.tx.length > limit) json.tx = json.tx.slice(-limit);
  }

  return json;
}

export type Prices = { BTC: number; ETH: number; BCH: number };

export async function fetchPrices(): Promise<Prices> {
  const res = await fetch("https://blockchain.info/ticker?cors=true");
  const json = await res.json();
  return {
    BTC: json.USD?.last ?? -1,
    ETH: json.ETH?.USD?.last ?? -1,
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

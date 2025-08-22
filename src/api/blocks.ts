export type LatestBlockResponse = {
  hash: string;
  time: string;
  height: number;
  txIndexes?: number[];
  size: number;
};

export type BlockSummary = LatestBlockResponse;

export const TARGET_COUNT = 20;

export function timeAgo(ms: number): string {
  console.log("hit");
  const now = Date.now();
  const diff = now - ms; // difference in milliseconds

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (seconds < 60) return `${seconds} seconds ago`;
  if (minutes < 60) return `${minutes} minutes ago`;
  if (hours < 24) return `${hours} hours ago`;
  return `${days} days ago`;
}

type BlockResponse = {
  block_index: number;
  hash: string;
  height: number;
  time: number;
};

export function condenseHash(
  hash: string,
  startLength = 1,
  endLength = 40
): string {
  if (!hash) return "";
  if (hash.length <= startLength + endLength) return hash;
  const start = hash.slice(0, startLength);
  const end = hash.slice(-endLength);
  return `${start}...${end}...`;
}

export async function getLastBlocks(
  limit: number,
  fromTime: number,
  daysBack: number
): Promise<BlockSummary[]> {
  const url = `https://blockchain.info/blocks/${fromTime}?format=json&cors=true`;
  const res = await fetch(url);
  const json: BlockResponse[] = await res.json();

  console.log(json);

  const cutoff = Math.floor(fromTime / 1000) - daysBack * 24 * 60 * 60;

  return json
    .filter((block) => block.time >= cutoff)
    .slice(0, limit)
    .map((block) => ({
      hash: block.hash,
      height: block.height,
      time: timeAgo(block.time * 1000),
      size: 0, // Hard set size for now as its not included in response
    }));
}

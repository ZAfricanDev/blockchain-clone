import React, { useEffect, useMemo, useState } from "react";
import "../css/single_block.css";
import { useParams } from "react-router-dom";
import { Coins, Icons } from "../constants";

import {
  fetchBlockByHash,
  formatBtc,
  getBlockReward,
  getDifficulty,
  mapApiTxToUi,
} from "../api/blocks";
import type {
  Block,
  Transaction as ApiTransaction,
  UiTransaction,
} from "../api/blocks";
import { Transactions } from "./transactions";
import { hexToAscii } from "../api/miner";

export function SingleBlock() {
  const params = useParams<{ coin: Coins; block: string }>();
  const { coin, block: blockHash } = params;
  console.log("blockHash", blockHash);
  const localItems = localStorage.getItem("block_info") || "[]";
  const localBlocks = JSON.parse(localItems);
  console.log("localBlocks", localBlocks);
  const localBlock = localBlocks.find(
    (item: Block) =>
      item.hash === blockHash || item.height === Number(blockHash)
  );

  const [blockInfo, setBlockInfo] = useState<Block | null>(localBlock);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!localBlock) {
      const hash = blockHash ?? blockInfo?.hash;
      if (!hash) return;

      setLoading(true);
      fetchBlockByHash(hash)
        .then((b) => setBlockInfo(b as Block))
        .catch((err) => console.error("fetchBlockByHash:", err))
        .finally(() => setLoading(false));
    }
  }, [localBlock, blockHash]);

  const highestBlock = Number(localStorage.getItem("latestBlockHeight"));

  const txs: ApiTransaction[] = Array.isArray(blockInfo?.tx)
    ? (blockInfo!.tx as ApiTransaction[])
    : [];

  const { transactions, totalOutputSat, totalFeeSat } = useMemo(() => {
    const mapped: UiTransaction[] = txs.map((t) =>
      mapApiTxToUi(t, blockInfo?.time)
    );

    const totalOutputSat = txs.reduce((acc: number, tx: ApiTransaction) => {
      const outSum = Array.isArray(tx.out)
        ? tx.out.reduce((s: number, o: any) => {
            const v =
              typeof o.value === "string" ? parseInt(o.value, 10) : o.value;
            return s + (Number.isFinite(v) ? v : 0);
          }, 0)
        : 0;
      return acc + outSum;
    }, 0);

    const totalFeeSat = txs.reduce((acc: number, tx: ApiTransaction) => {
      const outSum = Array.isArray(tx.out)
        ? tx.out.reduce((s: number, o: any) => {
            const v =
              typeof o.value === "string" ? parseInt(o.value, 10) : o.value;
            return s + (Number.isFinite(v) ? v : 0);
          }, 0)
        : 0;

      const inSum = Array.isArray(tx.inputs)
        ? (tx.inputs as any[]).reduce((s: number, inp: any) => {
            const prev = inp?.prev_out;
            const v = prev
              ? typeof prev.value === "string"
                ? parseInt(prev.value, 10)
                : prev.value
              : 0;
            return s + (Number.isFinite(v) ? v : 0);
          }, 0)
        : 0;

      const fee = inSum > 0 ? Math.max(0, inSum - outSum) : 0;
      return acc + fee;
    }, 0);

    return { transactions: mapped, totalOutputSat, totalFeeSat };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txs]);

  if (loading && !blockInfo) {
    return (
      <div className="block-details">
        <p className="loading">Loading...</p>
      </div>
    );
  }

  if (!blockInfo) {
    return (
      <div className="block-details">
        <p>No block info</p>
      </div>
    );
  }

  const hash = blockInfo.hash ?? "—";

  const confirmations = blockInfo?.height
    ? highestBlock - blockInfo?.height + 1
    : 1;

  const timestamp =
    blockInfo.time != null
      ? new Date(blockInfo.time * 1000).toLocaleString()
      : "—";
  const height = (blockInfo as any).height ?? blockInfo.block_index ?? "—";
  const miner = blockInfo.miner;
  const numberOfTransactions =
    blockInfo.n_tx ?? (blockInfo.tx ? blockInfo.tx.length : "—");
  const difficulty = getDifficulty(blockInfo.bits as number) ?? "—";
  const merkleRoot =
    (blockInfo as any).mrkl_root ?? (blockInfo as any).merkle_root ?? "—";
  const version = blockInfo.ver ?? "—";
  const bits = blockInfo.bits ?? "—";
  const weight = (blockInfo as any).weight ?? "—";
  const size = blockInfo.size ?? "—";
  const nonce = blockInfo.nonce ?? "—";
  const reward = getBlockReward(txs);
  const message = hexToAscii(txs[0]?.inputs[0].script);

  const transactionVolume = formatBtc(totalOutputSat);
  const feeReward = Number.isFinite(totalFeeSat) ? formatBtc(totalFeeSat) : "—";

  const icon = coin ? Icons[coin] : null;

  return (
    <div className="block-details">
      <h2>
        {icon && <img className="icon" src={icon} alt={`${coin} icon`} />}
        <span className="coin-header">{coin?.toLocaleUpperCase()} /</span> Block
      </h2>

      <p>Block at depth {height} in the Bitcoin blockchain</p>

      <table className="block-table">
        <tbody>
          <tr>
            <td>Hash</td>
            <td>{hash}</td>
          </tr>
          <tr>
            <td>Confirmations</td>
            <td>{confirmations}</td>
          </tr>
          <tr>
            <td>Timestamp</td>
            <td>{timestamp}</td>
          </tr>
          <tr>
            <td>Height</td>
            <td>{height}</td>
          </tr>
          <tr>
            <td>Miner</td>
            <td>
              {miner ? <a href={miner?.link}>{miner?.name}</a> : "Unknown"}
            </td>
          </tr>
          <tr>
            <td>Number of Transactions</td>
            <td>{numberOfTransactions}</td>
          </tr>
          <tr>
            <td>Difficulty</td>
            <td>{difficulty}</td>
          </tr>
          <tr>
            <td>Merkle Root</td>
            <td>{merkleRoot}</td>
          </tr>
          <tr>
            <td>Version</td>
            <td>{version}</td>
          </tr>
          <tr>
            <td>Bits</td>
            <td>{bits}</td>
          </tr>
          <tr>
            <td>Weight</td>
            <td>{weight}</td>
          </tr>
          <tr>
            <td>Size</td>
            <td>{size}</td>
          </tr>
          <tr>
            <td>Nonce</td>
            <td>{nonce}</td>
          </tr>
          <tr>
            <td>Transaction Volume</td>
            <td>{transactionVolume}</td>
          </tr>
          <tr>
            <td>Block Reward</td>
            <td>{reward}</td>
          </tr>
          <tr>
            <td>Fee Reward</td>
            <td>{feeReward}</td>
          </tr>
          <tr>
            <td>Message</td>
            <td>{message}</td>
          </tr>
        </tbody>
      </table>

      <Transactions transactions={transactions} />
    </div>
  );
}

import React from "react";
import "../css/single_block.css";
import { useParams } from "react-router-dom";

const placeholderBlock = {
  hash: "123",
  confirmations: 10,
  timestamp: "11/12/123",
  height: 1,
  miner: "123",
  numberOfTransactions: 4,
  difficulty: 5,
  merkleRoot: "123",
  version: "123",
  bits: 125,
  weight: "123",
  size: "123",
  nonce: 123,
  transactionVolume: 5555,
  blockReward: 123,
  feeReward: 123,
};

type Props = {
  block?: {
    hash: string;
    confirmations: number;
    timestamp: string;
    height: number;
    miner: string;
    numberOfTransactions: number;
    difficulty: number;
    merkleRoot: string;
    version: string;
    bits: number;
    weight: string;
    size: string;
    nonce: number;
    transactionVolume: number;
    blockReward: number;
    feeReward: number;
  };
};

export function SingleBlock({ block = placeholderBlock }: Props) {
  const params = useParams();
  const { block: paramBlock, coin } = params;
  const {
    hash,
    confirmations,
    timestamp,
    height,
    miner,
    numberOfTransactions,
    difficulty,
    merkleRoot,
    version,
    bits,
    weight,
    size,
    nonce,
    transactionVolume,
    blockReward,
    feeReward,
  } = block;

  return (
    <div className="block-details">
      <h2>{coin?.toLocaleUpperCase()} / Block</h2>
      <p>Block at depth {height} in the Bitcoin blockchain</p>
      <div className="block-table">
        <div className="row">
          <span>Hash</span>
          <span>{hash}</span>
        </div>
        <div className="row">
          <span>Confirmations</span>
          <span>{confirmations}</span>
        </div>
        <div className="row">
          <span>Timestamp</span>
          <span>{timestamp}</span>
        </div>
        <div className="row">
          <span>Height</span>
          <span>{height}</span>
        </div>
        <div className="row">
          <span>Miner</span>
          <span>{miner}</span>
        </div>
        <div className="row">
          <span>Number of Transactions</span>
          <span>{numberOfTransactions}</span>
        </div>
        <div className="row">
          <span>Difficulty</span>
          <span>{difficulty}</span>
        </div>
        <div className="row">
          <span>Merkle Root</span>
          <span>{merkleRoot}</span>
        </div>
        <div className="row">
          <span>Version</span>
          <span>{version}</span>
        </div>
        <div className="row">
          <span>Bits</span>
          <span>{bits}</span>
        </div>
        <div className="row">
          <span>Weight</span>
          <span>{weight}</span>
        </div>
        <div className="row">
          <span>Size</span>
          <span>{size}</span>
        </div>
        <div className="row">
          <span>Nonce</span>
          <span>{nonce}</span>
        </div>
        <div className="row">
          <span>Transaction Volume</span>
          <span>{transactionVolume}</span>
        </div>
        <div className="row">
          <span>Block Reward</span>
          <span>{blockReward}</span>
        </div>
        <div className="row">
          <span>Fee Reward</span>
          <span>{feeReward}</span>
        </div>
      </div>
    </div>
  );
}

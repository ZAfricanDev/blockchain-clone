import React from "react";
import "../css/single_block.css";
import { useParams } from "react-router-dom";
import { Coins, Icons } from "../constants";
import arrowSVG from "../assets/icons/arrow.svg";

type Transaction = {
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
  transactions: [
    {
      hash: "ad0895632b4ad17b9902bf5d3b51c2b1744691f2b4c53157600b3a...",
      inputs: ["COINBASE (Newly Generated Coins)"],
      fee: "0.00000000 BTC",
      feeDetails: "(0.000 sat/B - 0.000 sat/WU - 290 bytes)",
      values: ["0.00000000 BTC", "0.00000000 BTC"],
      total: "12.59776762 BTC",
      confirmations: 2,
      timestamp: "2020-02-04 06:34",
    },
  ],
};

type Props = {
  block?: typeof placeholderBlock;
};

export function SingleBlock({ block = placeholderBlock }: Props) {
  const params = useParams<{ coin: Coins; block: string }>();
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
    transactions,
  } = block;

  const icon = coin ? Icons[coin] : null;

  return (
    <div className="block-details">
      <h2>
        {icon && <img className="icon" src={icon} />}
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
            <td>{miner}</td>
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
            <td>{blockReward}</td>
          </tr>
          <tr>
            <td>Fee Reward</td>
            <td>{feeReward}</td>
          </tr>
        </tbody>
      </table>

      <div className="transactions">
        <h3>Transactions</h3>
        <table className="transactions-table">
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.hash} className="transaction">
                <td className="tx-left">
                  <div className="hash">
                    <h4>Hash</h4>
                    <div className="hash-info">
                      <a href={`/${coin}/tx/${tx.hash}`}>{tx.hash}</a>
                      {tx.inputs.map((i, idx) => (
                        <div key={idx} className="input-label">
                          {i}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="fee">
                    <h4>Fee</h4>
                    <div className="fee-info">
                      {tx.fee}
                      <div className="fee-sub">{tx.feeDetails}</div>
                    </div>
                  </div>
                </td>

                <td className="tx-middle">
                  <img src={arrowSVG} className="arrow" />
                </td>

                <td className="tx-right">
                  <div className="timestamp">{tx.timestamp}</div>
                  <div className="amounts">
                    {tx.values.map((v, idx) => (
                      <div key={idx}>{v}</div>
                    ))}
                  </div>
                  <div className="pills">
                    <div className="pill green">{tx.total}</div>
                    <div className="pill blue">
                      {tx.confirmations} Confirmations
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

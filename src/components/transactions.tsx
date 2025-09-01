import React from "react";
import arrowSVG from "../assets/icons/arrow.svg";
import { useParams } from "react-router-dom";
import { Coins } from "../constants";

import type { UiTransaction } from "../api/blocks";

type Props = {
  transactions: UiTransaction[];
};

export function Transactions({ transactions }: Props) {
  console.log("transaction", transactions);
  return (
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
                    <span>{tx.hash}</span>
                    {tx.inputs &&
                      tx.inputs.map((i: string, idx: number) => (
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
                <img src={arrowSVG} className="arrow" alt="arrow" />
              </td>

              <td className="tx-right">
                <div className="timestamp">{tx.timestamp}</div>
                <div className="amounts">
                  {tx.values &&
                    tx.values.map((v: string, idx: number) => (
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
  );
}

import "../css/block_table.css";
import React from "react";

import { BlockSummary, condenseHash } from "../api/blocks";
import { Link } from "react-router";

type Props = {
  blocks?: BlockSummary[];
};

export function BlockExplorerTable({ blocks }: Props) {
  if (!blocks) return null;

  return (
    <div>
      <h3>Latest blocks</h3>
      <table className="blocks-table">
        <thead>
          <tr>
            <th>Height</th>
            <th>Hash</th>
            <th>Mined</th>
            <th>Miner</th>
            <th>Size</th>
          </tr>
        </thead>
        <tbody>
          {blocks.map((block, index) => {
            return (
              <tr key={index}>
                <td>{block.height}</td>
                <td className="hash-cell">
                  <Link to={`btc/${block.hash}`}>
                    {condenseHash(block.hash)}
                  </Link>
                </td>
                <td>{block.time}</td>
                <td>Unknown</td>
                <td>{block.size?.toLocaleString?.() ?? "N/A"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

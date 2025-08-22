import "../css/block_table.css";
import React from "react";

import { BlockSummary, condenseHash } from "../api/blocks";

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
            <th>Size</th>
          </tr>
        </thead>
        <tbody>
          {blocks.map((block, index) => (
            <tr key={index}>
              <td>{block.height}</td>
              <td className="hash-cell">{condenseHash(block.hash)}</td>
              <td>{block.time}</td>
              <td>{block.size?.toLocaleString?.() ?? "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

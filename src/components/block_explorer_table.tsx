import React from "react";
import { Block } from "../types/types";
import "../css/block_table.css";

type Props = {
  blocks: Block[];
};

export function BlockExplorerTable({ blocks }: Props) {
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
          {blocks.map((block, index) => (
            <tr key={index}>
              <td>{block.height}</td>
              <td>{block.hash}</td>
              <td>{block.mined}</td>
              <td>{block.miner}</td>
              <td>{block.size}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

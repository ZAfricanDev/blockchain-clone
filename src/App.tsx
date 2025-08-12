import React from "react";
import "./css/App.css";
import { SideBar } from "./components/sidebar";

interface Block {
  height: number;
  hash: string;
  mined: string;
  miner: string;
  size: string;
}

const blocks: Block[] = [
  {
    height: 615894,
    hash: "0.4cac55...",
    mined: "4 minutes",
    miner: "SlushPool",
    size: "918,291 bytes",
  },
  {
    height: 615893,
    hash: "0.3015bc...",
    mined: "15 minutes",
    miner: "AntPool",
    size: "178,292 bytes",
  },
  {
    height: 615892,
    hash: "0.63d805...",
    mined: "18 minutes",
    miner: "Unknown",
    size: "29,471 bytes",
  },
  {
    height: 615891,
    hash: "0.f8d3a0...",
    mined: "18 minutes",
    miner: "F2Pool",
    size: "395,783 bytes",
  },
  {
    height: 615890,
    hash: "0.108a46...",
    mined: "22 minutes",
    miner: "F2Pool",
    size: "97,227 bytes",
  },
  {
    height: 615889,
    hash: "0.e26c527...",
    mined: "23 minutes",
    miner: "Unknown",
    size: "833,324 bytes",
  },
  {
    height: 615888,
    hash: "0.f620710...",
    mined: "25 minutes",
    miner: "F2Pool",
    size: "1,281,256 bytes",
  },
  {
    height: 615887,
    hash: "0.b6ff4e0...",
    mined: "31 minutes",
    miner: "Unknown",
    size: "1,299,833 bytes",
  },
  {
    height: 615886,
    hash: "0.142f7eb...",
    mined: "46 minutes",
    miner: "AntPool",
    size: "1,254,775 bytes",
  },
  {
    height: 615885,
    hash: "0.285db6e...",
    mined: "1 hour",
    miner: "F2Pool",
    size: "1,245,996 bytes",
  },
];

export default function BlockExplorer() {
  return (
    <div className="container">
      <SideBar />

      <main className="main-content">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for things like address, transaction, block"
          />
          <button>Search</button>
        </div>

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
      </main>
    </div>
  );
}

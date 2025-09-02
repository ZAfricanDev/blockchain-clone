import React, { useEffect, useState } from "react";

import BtcIcon from "../assets/icons/btc.svg";
import EthIcon from "../assets/icons/eth.svg";
import BtcCashIcon from "../assets/icons/bch.svg";
import { fetchPrices, Prices } from "../api/blocks";

import "../css/side_bar.css";

export function SideBar() {
  const [prices, setPrices] = useState<Prices | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    let interval: NodeJS.Timeout;

    const load = async () => {
      try {
        const data = await fetchPrices();
        setPrices(data);
        setLoading(false);
      } catch (e) {
        console.error("Failed to fetch prices", e);
      }
    };

    load();
    interval = setInterval(load, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <aside className="sidebar">
      <h2>Block Explorer</h2>

      <div className="crypto">
        <img src={BtcIcon} className="crypto-icon" />
        <div className="crypto-text">
          <span className="crypto-name">Bitcoin</span>
          <span className="crypto-price">${prices?.BTC}</span>
        </div>
      </div>
      <div className="crypto">
        <img src={EthIcon} className="crypto-icon" />
        <div className="crypto-text">
          <span className="crypto-name">Ethereum</span>
          <span className="crypto-price">${prices?.ETH}</span>
        </div>
      </div>
      <div className="crypto">
        <img src={BtcCashIcon} className="crypto-icon" />
        <div className="crypto-text">
          <span className="crypto-name">Bitcoin Cash</span>
          <span className="crypto-price">${prices?.BCH}</span>
        </div>
      </div>
    </aside>
  );
}

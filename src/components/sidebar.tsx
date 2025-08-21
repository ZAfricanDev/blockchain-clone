import React from "react";

import BtcIcon from "../assets/icons/btc.svg";
import EthIcon from "../assets/icons/eth.svg";
import BtcCashIcon from "../assets/icons/bch.svg";

import "../css/side_bar.css";

export function SideBar() {
  return (
    <aside className="sidebar">
      <h2>Block Explorer</h2>
      <div className="crypto">
        <img src={BtcIcon} className="crypto-icon" />
        <div className="crypto-text">
          <span className="crypto-name">Bitcoin</span>
          <span className="crypto-price">$9,273.76</span>
        </div>
      </div>
      <div className="crypto">
        <img src={EthIcon} className="crypto-icon" />
        <div className="crypto-text">
          <span className="crypto-name">Ethereum</span>
          <span className="crypto-price">$188.03</span>
        </div>
      </div>
      <div className="crypto">
        <img src={BtcCashIcon} className="crypto-icon" />
        <div className="crypto-text">
          <span className="crypto-name">Bitcoin Cash</span>
          <span className="crypto-price">$382.77</span>
        </div>
      </div>
    </aside>
  );
}

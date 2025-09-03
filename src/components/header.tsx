import React from "react";

import "../css/header.css";
import { Link } from "react-router-dom";

export function Header() {
  return (
    <div className="header">
      <Link to={"/"}>
        <button>Go to explorer</button>
      </Link>

      <button
        onClick={() => {
          localStorage.setItem("block_info_time", "0");
          window.location.reload();
        }}
      >
        Manual Refresh
      </button>
    </div>
  );
}

import React from "react";

import "../css/header.css";
import { Link } from "react-router-dom";

export function Header() {
  return (
    <div className="header">
      <Link to={"/"}>Go to explorer</Link>
    </div>
  );
}

import React from "react";

import "../css/search_bar.css";

export function SearchBar() {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search for things like address, transaction, block"
      />
      <button>Search</button>
    </div>
  );
}

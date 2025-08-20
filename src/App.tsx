import "./css/App.css";

import React from "react";
import { Routes, Route } from "react-router-dom";

import { Header } from "./components/header";
import { BlockExplorer } from "./components/block_explorer";
import { SingleBlock } from "./components/single_block";

export function App() {
  return (
    <div className="container">
      <Header />

      <div className="content">
        <Routes>
          <Route
            path="/"
            element={
              <main className="main-content">
                <BlockExplorer />
              </main>
            }
          />

          <Route
            path="/:coin/:block"
            element={
              <main className="main-content">
                <SingleBlock />
              </main>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

import React, { useEffect, useRef, useState } from "react";
import { SideBar } from "./sidebar";
import { SearchBar } from "./search_bar";
import { BlockExplorerTable } from "./block_explorer_table";
import { BlockSummary, getLastBlocks } from "../api/blocks";

export function BlockExplorer() {
  const [blocks, setBlocks] = useState<BlockSummary[]>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const res = await getLastBlocks(20, Date.now(), 7);
        console.log("res", res);
        if (!mounted) return;
        setBlocks(res);
      } catch (err: any) {
        if (!mounted) return;
        setError(err?.message ?? String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <SideBar />
      <div className="content-area">
        <SearchBar />
        {loading && <div>Loading latest block…</div>}
        {error && <div style={{ color: "crimson" }}>Error: {error}</div>}
        <BlockExplorerTable blocks={blocks} />
      </div>
    </>
  );
}

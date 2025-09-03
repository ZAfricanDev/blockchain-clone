import { formatBtc, getDifficulty, mapApiTxToUi } from "./blocks";

describe("formatBtc", () => {
  it("formats a number of satoshis to BTC with 8 decimals", () => {
    expect(formatBtc(100000000)).toBe("1.00000000 BTC");
  });

  it("formats a string input correctly", () => {
    expect(formatBtc("250000000")).toBe("2.50000000 BTC");
  });

  it("returns 0 BTC when input is undefined", () => {
    expect(formatBtc()).toBe("0.00000000 BTC");
  });

  it("handles small values", () => {
    expect(formatBtc(1)).toBe("0.00000001 BTC");
  });
});

describe("getDifficulty", () => {
  it("returns 1.0 for the base difficulty bits (0x1d00ffff)", () => {
    const result = getDifficulty(0x1d00ffff);
    expect(result).toBe(1);
  });

  it("returns 1.0 for the base difficulty bits (0x1d00ffff)", () => {
    const result = getDifficulty(386018193);
    expect(result).toBe(129699156960680.9);
  });
});

describe("mapApiTxToUi", () => {
  it("maps a regular tx: computes inputs, outputs, total and zero fee", () => {
    const tx: any = {
      hash: "tx123",
      inputs: [
        { prev_out: { addr: "sender1", value: 150000 } }, // number
        { prev_out: { addr: "sender2", value: "50000" } }, // string value
      ],
      out: [
        { addr: "recipient1", value: 100000 },
        { value: 100000 }, // no addr
      ],
      time: 1_600_000_000, // seconds
    };

    const ui = mapApiTxToUi(tx);

    // outputs: each 100000 sat -> 0.00100000 BTC
    expect(ui.hash).toBe("tx123");
    expect(ui.inputs).toEqual(["sender1", "sender2"]);
    expect(ui.outputs).toEqual(["recipient1 0.00100000 BTC", "0.00100000 BTC"]);
    // total: 200000 sat -> 0.00200000 BTC
    expect(ui.value).toBe("0.00200000 BTC");
    // fee: totalIn == totalOut => 0
    expect(ui.fee).toBe("0.00000000 BTC");
    expect(ui.confirmations).toBe(1);
    // timestamp should match runtime toLocaleString for the given seconds
    const expectedTs = new Date(tx.time * 1000).toLocaleString();
    expect(ui.timestamp).toBe(expectedTs);
    expect(ui.values).toEqual(ui.outputs);
    expect(ui.feeDetails).toBeUndefined();
  });

  it("handles coinbase-like input (no prev_out) and returns '-' fee", () => {
    const tx: any = {
      hash: "coinbase1",
      inputs: [{ some_field: "whatever" }], // prev_out missing -> treated as COINBASE
      out: [{ value: 5_000_000 }], // 5_000_000 sat -> 0.05 BTC
      // no time provided
    };

    const ui = mapApiTxToUi(tx);

    expect(ui.hash).toBe("coinbase1");
    expect(ui.inputs).toEqual(["COINBASE (Newly Generated Coins)"]);
    expect(ui.outputs).toEqual(["0.05000000 BTC"]);
    expect(ui.value).toBe("0.05000000 BTC");
    // totalInSat == 0 -> fee should be "-" (unknown)
    expect(ui.fee).toBe("-");
    // timestamp missing & no blockTime -> "—"
    expect(ui.timestamp).toBe("—");
  });

  it("uses blockTime when tx.time is missing", () => {
    const blockTime = 1_610_000_000; // seconds
    const tx: any = {
      hash: "txWithBlockTime",
      inputs: [],
      out: [{ value: 10_000 }],
      // no time
    };

    const ui = mapApiTxToUi(tx, blockTime);
    const expectedTs = new Date(blockTime * 1000).toLocaleString();
    expect(ui.timestamp).toBe(expectedTs);
  });
});

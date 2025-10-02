import { describe, it, expect } from "vitest";
import { MorphMainnet, MorphHoodiTestnet } from "../src/chains";

describe("MorphMainnet", () => {
  it("has correct chain id", () => {
    expect(MorphMainnet.id).toBe(2818);
  });

  it("has correct native currency symbol", () => {
    expect(MorphMainnet.nativeCurrency.symbol).toBe("ETH");
  });

  it("has correct RPC endpoint", () => {
    expect(MorphMainnet.rpcUrls.default.http[0]).toBe("https://rpc-quicknode.morphl2.io");
  });

  it("has correct block explorer URL", () => {
    expect(MorphMainnet.blockExplorers.default.url).toBe("https://explorer.morphl2.io");
  });
});

describe("MorphHoodiTestnet", () => {
  it("has correct chain id", () => {
    expect(MorphHoodiTestnet.id).toBe(2910);
  });

  it("has correct native currency symbol", () => {
    expect(MorphHoodiTestnet.nativeCurrency.symbol).toBe("ETH");
  });

  it("has correct RPC endpoint", () => {
    expect(MorphHoodiTestnet.rpcUrls.default.http[0]).toBe("https://rpc-hoodi.morphl2.io");
  });

  it("has correct block explorer URL", () => {
    expect(MorphHoodiTestnet.blockExplorers.default.url).toBe("https://explorer-hoodi.morphl2.io");
  });
});

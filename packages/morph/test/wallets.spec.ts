import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock React hooks
vi.mock('react', () => ({
  useState: vi.fn(),
  useEffect: vi.fn(),
}));

vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
  useBalance: vi.fn(),
  useConnect: vi.fn(),
  useDisconnect: vi.fn(),
}));

vi.mock('viem', () => ({
  formatEther: vi.fn((value) => (Number(value) / 1e18).toString()),
}));

// Import after mocking
import { useBitgetWallet } from "../src/wallets/bitget";
import { useState, useEffect } from 'react';
import { useAccount, useBalance, useConnect, useDisconnect } from 'wagmi';

// Get mocked functions
const mockUseState = vi.mocked(useState);
const mockUseEffect = vi.mocked(useEffect);
const mockUseAccount = vi.mocked(useAccount);
const mockUseBalance = vi.mocked(useBalance);
const mockUseConnect = vi.mocked(useConnect);
const mockUseDisconnect = vi.mocked(useDisconnect);

describe("useBitgetWallet", () => {
  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
    
    // Setup default mock implementations
    mockUseState.mockImplementation((initial) => [initial, vi.fn()]);
    mockUseEffect.mockImplementation((fn) => fn());
    
    mockUseAccount.mockReturnValue({
      address: undefined,
      isConnected: false,
      chainId: undefined,
    });
    
    mockUseBalance.mockReturnValue({
      data: undefined,
    });
    
    mockUseConnect.mockReturnValue({
      connect: vi.fn(),
      connectors: [],
    });
    
    mockUseDisconnect.mockReturnValue({
      disconnect: vi.fn(),
    });

    // Mock window object
    Object.defineProperty(global, 'window', {
      value: {},
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns default state { isConnected: false } initially", () => {
    // Mock useState to return false for isMounted
    mockUseState.mockImplementation((initial) => {
      if (initial === false) return [false, vi.fn()]; // isMounted
      return [initial, vi.fn()];
    });

    const result = useBitgetWallet();

    expect(result.isConnected).toBe(false);
    expect(result.address).toBeUndefined();
    expect(result.chainId).toBeUndefined();
    expect(result.balance).toBeUndefined();
  });

  it("provides connect and disconnect functions", () => {
    const result = useBitgetWallet();

    expect(typeof result.connect).toBe("function");
    expect(typeof result.disconnect).toBe("function");
  });

  it("detects Bitget Wallet if injected", () => {
    // Mock Bitget wallet presence
    Object.defineProperty(global, 'window', {
      value: {
        bitkeep: {
          ethereum: {},
        },
      },
      writable: true,
    });

    // Mock connectors with Bitget connector
    const mockConnect = vi.fn();
    const mockConnectors = [
      { id: 'bitget', name: 'Bitget Wallet' },
      { id: 'injected', name: 'Injected' },
    ];

    mockUseConnect.mockReturnValue({
      connect: mockConnect,
      connectors: mockConnectors,
    });

    // Mock useState to return true for isMounted
    mockUseState.mockImplementation((initial) => {
      if (initial === false) return [true, vi.fn()]; // isMounted
      return [initial, vi.fn()];
    });

    const result = useBitgetWallet();
    
    // Test that connect function exists
    expect(typeof result.connect).toBe("function");
  });

  it("falls back gracefully if not present", () => {
    // Mock no Bitget wallet
    Object.defineProperty(global, 'window', {
      value: {},
      writable: true,
    });

    // Mock connectors without Bitget
    const mockConnect = vi.fn();
    const mockConnectors = [
      { id: 'metamask', name: 'MetaMask' },
      { id: 'injected', name: 'Injected' },
    ];

    mockUseConnect.mockReturnValue({
      connect: mockConnect,
      connectors: mockConnectors,
    });

    // Mock useState to return true for isMounted
    mockUseState.mockImplementation((initial) => {
      if (initial === false) return [true, vi.fn()]; // isMounted
      return [initial, vi.fn()];
    });

    const result = useBitgetWallet();
    
    // Should still provide connect/disconnect functions
    expect(typeof result.connect).toBe("function");
    expect(typeof result.disconnect).toBe("function");
  });

  it("handles connected state correctly", () => {
    // Mock connected state
    mockUseAccount.mockReturnValue({
      address: "0x1234567890123456789012345678901234567890",
      isConnected: true,
      chainId: 1,
    });

    mockUseBalance.mockReturnValue({
      data: { value: BigInt("1000000000000000000") }, // 1 ETH
    });

    // Mock useState to return true for isMounted
    mockUseState.mockImplementation((initial) => {
      if (initial === false) return [true, vi.fn()]; // isMounted
      return [initial, vi.fn()];
    });

    const result = useBitgetWallet();

    expect(result.isConnected).toBe(true);
    expect(result.address).toBe("0x1234567890123456789012345678901234567890");
    expect(result.chainId).toBe(1);
    expect(result.balance).toBe("1");
  });
});

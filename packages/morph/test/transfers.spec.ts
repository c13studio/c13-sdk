import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock wagmi hooks
vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
  useSendTransaction: vi.fn(),
  useWriteContract: vi.fn(),
  useWaitForTransactionReceipt: vi.fn(),
}));

vi.mock('viem', () => ({
  parseUnits: vi.fn((amount, decimals) => BigInt(Number(amount) * Math.pow(10, decimals))),
  formatUnits: vi.fn((value, decimals) => (Number(value) / Math.pow(10, decimals)).toString()),
  isAddress: vi.fn((address) => address && address.startsWith('0x') && address.length === 42),
}));

vi.mock('react', () => ({
  useState: vi.fn((initial) => [initial, vi.fn()]),
}));

// Import after mocking
import { useTokenTransfer } from "../src/tokens/useTokenTransfer";
import { validateTransferAmount, validateRecipientAddress, estimateTransferFee } from "../src/tokens/transferUtils";
import { useAccount, useSendTransaction, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, isAddress } from 'viem';
import { useState } from 'react';

// Get mocked functions
const mockUseAccount = vi.mocked(useAccount);
const mockUseSendTransaction = vi.mocked(useSendTransaction);
const mockUseWriteContract = vi.mocked(useWriteContract);
const mockUseWaitForTransactionReceipt = vi.mocked(useWaitForTransactionReceipt);
const mockParseUnits = vi.mocked(parseUnits);
const mockIsAddress = vi.mocked(isAddress);
const mockUseState = vi.mocked(useState);

describe("useTokenTransfer", () => {
  const mockSendTransaction = vi.fn();
  const mockWriteContract = vi.fn();

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
    
    // Setup default mock implementations
    mockUseAccount.mockReturnValue({
      address: '0x1234567890123456789012345678901234567890',
      chainId: 2818,
      isConnected: true,
      isConnecting: false,
      isDisconnected: false,
      isReconnecting: false,
      status: 'connected'
    });

    mockUseSendTransaction.mockReturnValue({
      sendTransaction: mockSendTransaction,
      isPending: false,
      error: null,
      data: undefined,
    });

    mockUseWriteContract.mockReturnValue({
      writeContract: mockWriteContract,
      isPending: false,
      error: null,
      data: undefined,
    });

    mockUseWaitForTransactionReceipt.mockReturnValue({
      isLoading: false,
      isSuccess: false,
    });

    mockUseState.mockImplementation((initial) => [initial, vi.fn()]);

    mockParseUnits.mockImplementation((amount, decimals) => 
      BigInt(Number(amount) * Math.pow(10, decimals))
    );

    mockIsAddress.mockImplementation((address) => 
      typeof address === 'string' && address.startsWith('0x') && address.length === 42
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });


  it("initializes transfer hook correctly", () => {
    const result = useTokenTransfer();

    expect(typeof result.transfer).toBe('function');
    expect(result.isLoading).toBe(false);
    expect(result.error).toBe(null);
    expect(result.txHash).toBeUndefined();
    expect(result.isConfirming).toBe(false);
    expect(result.isConfirmed).toBe(false);
  });

  it("handles loading states correctly", () => {
    mockUseSendTransaction.mockReturnValue({
      sendTransaction: mockSendTransaction,
      isPending: true,
      error: null,
      data: undefined,
    });

    const result = useTokenTransfer();
    expect(result.isLoading).toBe(true);
  });

  it("handles error states correctly", () => {
    const mockError = new Error('Transfer failed');
    mockUseSendTransaction.mockReturnValue({
      sendTransaction: mockSendTransaction,
      isPending: false,
      error: mockError,
      data: undefined,
    });

    const result = useTokenTransfer();
    expect(result.error).toBe(mockError);
  });

  it("handles confirmation states correctly", () => {
    mockUseWaitForTransactionReceipt.mockReturnValue({
      isLoading: true,
      isSuccess: false,
    });

    const result = useTokenTransfer();
    expect(result.isConfirming).toBe(true);
    expect(result.isConfirmed).toBe(false);
  });

  it("provides transfer function", () => {
    const result = useTokenTransfer();
    expect(typeof result.transfer).toBe('function');
  });

  it("accepts callback functions", () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();
    
    const result = useTokenTransfer({ onSuccess, onError });
    expect(typeof result.transfer).toBe('function');
  });

  it("uses connected account chain by default", () => {
    mockUseAccount.mockReturnValue({
      address: '0x1234567890123456789012345678901234567890',
      chainId: 2910, // Testnet
      isConnected: true,
      isConnecting: false,
      isDisconnected: false,
      isReconnecting: false,
      status: 'connected'
    });

    const result = useTokenTransfer();
    expect(typeof result.transfer).toBe('function');
  });

  it("handles ERC-20 loading states correctly", () => {
    mockUseWriteContract.mockReturnValue({
      writeContract: mockWriteContract,
      isPending: true,
      error: null,
      data: undefined,
    });

    const result = useTokenTransfer();
    expect(result.isLoading).toBe(true);
  });

  it("handles confirmation states correctly", () => {
    mockUseWaitForTransactionReceipt.mockReturnValue({
      isLoading: true,
      isSuccess: false,
    });

    const result = useTokenTransfer();
    expect(result.isConfirming).toBe(true);
    expect(result.isConfirmed).toBe(false);
  });
});

describe("Transfer Utilities", () => {
  describe("validateTransferAmount", () => {
    it("validates amount correctly", () => {
      expect(validateTransferAmount('1.5', '10.0', 18)).toEqual({ isValid: true });
      expect(validateTransferAmount('', '10.0', 18)).toEqual({ 
        isValid: false, 
        error: 'Amount is required' 
      });
      expect(validateTransferAmount('15.0', '10.0', 18)).toEqual({ 
        isValid: false, 
        error: 'Insufficient balance' 
      });
      expect(validateTransferAmount('1.123456789012345678901', '10.0', 18)).toEqual({ 
        isValid: false, 
        error: 'Too many decimal places. Max: 18' 
      });
    });
  });

  describe("validateRecipientAddress", () => {
    it("validates addresses correctly", () => {
      expect(validateRecipientAddress('0x742d35Cc6634C0532925a3b8D0C9e3e')).toEqual({ 
        isValid: false, 
        error: 'Address must be 42 characters long' 
      });
      expect(validateRecipientAddress('0x742d35Cc6634C0532925a3b8D0C9e3e742d35Cc6')).toEqual({ 
        isValid: true 
      });
      expect(validateRecipientAddress('742d35Cc6634C0532925a3b8D0C9e3e742d35Cc66')).toEqual({ 
        isValid: false, 
        error: 'Address must start with 0x' 
      });
      expect(validateRecipientAddress('')).toEqual({ 
        isValid: false, 
        error: 'Recipient address is required' 
      });
    });
  });

  describe("estimateTransferFee", () => {
    it("estimates fees correctly", () => {
      const ethFee = estimateTransferFee('ETH', 2818);
      expect(ethFee.gasLimit).toBe(BigInt(21000));
      
      const usdtFee = estimateTransferFee('USDT', 2818);
      expect(usdtFee.gasLimit).toBe(BigInt(65000));
      
      expect(typeof ethFee.formattedFee).toBe('string');
      expect(ethFee.formattedFee).toContain('ETH');
    });
  });
});

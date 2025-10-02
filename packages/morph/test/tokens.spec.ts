import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock wagmi hooks
vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
  useBalance: vi.fn(),
  useReadContract: vi.fn(),
}));

vi.mock('viem', () => ({
  formatUnits: vi.fn((value, decimals) => (Number(value) / Math.pow(10, decimals)).toString()),
  isAddress: vi.fn((address) => address && address.startsWith('0x') && address.length === 42),
}));

// Import after mocking
import { useTokenBalance } from "../src/tokens/useTokenBalance";
import { MORPH_TOKENS } from "../src/tokens/constants";
import { useAccount, useBalance, useReadContract } from 'wagmi';
import { formatUnits, isAddress } from 'viem';

// Get mocked functions
const mockUseAccount = vi.mocked(useAccount);
const mockUseBalance = vi.mocked(useBalance);
const mockUseReadContract = vi.mocked(useReadContract);
const mockFormatUnits = vi.mocked(formatUnits);
const mockIsAddress = vi.mocked(isAddress);

describe("useTokenBalance", () => {
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
    
    mockUseBalance.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });
    
    mockUseReadContract.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });
    
    mockFormatUnits.mockImplementation((value, decimals) => 
      (Number(value) / Math.pow(10, decimals)).toString()
    );
    
    mockIsAddress.mockImplementation((address) => 
      typeof address === 'string' && address.startsWith('0x') && address.length === 42
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns ETH balance correctly", () => {
    const mockEthBalance = {
      value: BigInt("1000000000000000000"), // 1 ETH
      decimals: 18,
      formatted: "1.0",
      symbol: "ETH"
    };

    mockUseBalance.mockReturnValue({
      data: mockEthBalance,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    mockFormatUnits.mockReturnValue("1.0");

    const result = useTokenBalance({ token: 'ETH' });

    expect(result.balance).toBe("1.0");
    expect(result.symbol).toBe("ETH");
    expect(result.decimals).toBe(18);
    expect(result.isLoading).toBe(false);
    expect(result.error).toBe(null);
  });

  it("returns ERC-20 token balance correctly", () => {
    const mockTokenBalance = BigInt("1000000"); // 1 USDT (6 decimals)

    mockUseReadContract.mockReturnValue({
      data: mockTokenBalance,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    mockFormatUnits.mockReturnValue("1.0");

    const result = useTokenBalance({ token: 'USDT' });

    expect(result.balance).toBe("1.0");
    expect(result.symbol).toBe("USDT");
    expect(result.decimals).toBe(6);
    expect(result.isLoading).toBe(false);
    expect(result.error).toBe(null);
  });

  it("handles loading state correctly", () => {
    mockUseBalance.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      refetch: vi.fn(),
    });

    const result = useTokenBalance({ token: 'ETH' });

    expect(result.isLoading).toBe(true);
    expect(result.balance).toBeUndefined();
  });

  it("handles error state correctly", () => {
    const mockError = new Error("Network error");

    mockUseBalance.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: mockError,
      refetch: vi.fn(),
    });

    const result = useTokenBalance({ token: 'ETH' });

    expect(result.error).toBe(mockError);
    expect(result.balance).toBeUndefined();
  });

  it("supports custom contract addresses", () => {
    const customAddress = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd';
    
    mockIsAddress.mockReturnValue(true);
    mockUseReadContract.mockReturnValue({
      data: BigInt("5000000000000000000"), // 5 tokens
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    mockFormatUnits.mockReturnValue("5.0");

    const result = useTokenBalance({ token: customAddress });

    expect(result.balance).toBe("5.0");
    expect(result.symbol).toBe("UNKNOWN");
    expect(result.decimals).toBe(18);
  });

  it("supports different chain IDs", () => {
    mockUseAccount.mockReturnValue({
      address: '0x1234567890123456789012345678901234567890',
      chainId: 2910, // Testnet
      isConnected: true,
      isConnecting: false,
      isDisconnected: false,
      isReconnecting: false,
      status: 'connected'
    });

    const result = useTokenBalance({ token: 'USDC', chainId: 2910 });

    expect(result.symbol).toBe("USDC");
    expect(result.decimals).toBe(6);
  });

  it("supports custom user address", () => {
    const customAddress = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd';
    
    mockUseBalance.mockReturnValue({
      data: {
        value: BigInt("2000000000000000000"), // 2 ETH
        decimals: 18,
        formatted: "2.0",
        symbol: "ETH"
      },
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    mockFormatUnits.mockReturnValue("2.0");

    const result = useTokenBalance({ 
      token: 'ETH', 
      address: customAddress 
    });

    expect(result.balance).toBe("2.0");
    expect(mockUseBalance).toHaveBeenCalledWith(
      expect.objectContaining({
        address: customAddress
      })
    );
  });

  it("can be disabled with enabled parameter", () => {
    const result = useTokenBalance({ 
      token: 'ETH', 
      enabled: false 
    });

    expect(mockUseBalance).toHaveBeenCalledWith(
      expect.objectContaining({
        query: expect.objectContaining({
          enabled: false
        })
      })
    );
  });

  it("provides refetch functionality", () => {
    const mockRefetch = vi.fn();
    
    mockUseBalance.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    });

    const result = useTokenBalance({ token: 'ETH' });
    result.refetch();

    expect(mockRefetch).toHaveBeenCalled();
  });

  it("handles all supported tokens", () => {
    const supportedTokens = ['ETH', 'USDT', 'USDC', 'BGB'] as const;
    
    supportedTokens.forEach(token => {
      const result = useTokenBalance({ token });
      expect(result.symbol).toBe(token);
      expect(typeof result.decimals).toBe('number');
      expect(typeof result.refetch).toBe('function');
    });
  });
});

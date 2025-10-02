import { describe, it, expect } from "vitest";
import { 
  formatBalance, 
  formatAddress, 
  formatTokenAmount,
  formatCompactNumber,
  formatPercentage,
  parseError,
  categorizeError,
  createParsedError,
  ErrorType
} from "../src/utils";

describe("Format Utilities", () => {
  describe("formatBalance", () => {
    it("formats string balances correctly", () => {
      expect(formatBalance("123.456")).toBe("123.46");
      expect(formatBalance("123.456", 3)).toBe("123.456");
      expect(formatBalance("0")).toBe("0.00");
      expect(formatBalance("1000.123")).toBe("1,000.12");
    });

    it("formats bigint balances correctly", () => {
      expect(formatBalance(BigInt(123456))).toBe("123,456.00");
      expect(formatBalance(BigInt(0))).toBe("0.00");
      expect(formatBalance(BigInt(1000))).toBe("1,000.00");
    });

    it("handles undefined and null values", () => {
      expect(formatBalance(undefined)).toBe("0.00");
      expect(formatBalance(null as any)).toBe("0.00");
    });

    it("handles invalid string values", () => {
      expect(formatBalance("invalid")).toBe("0.00");
      expect(formatBalance("")).toBe("0.00");
      expect(formatBalance("abc123")).toBe("0.00");
    });

    it("respects decimal places parameter", () => {
      expect(formatBalance("123.456789", 0)).toBe("123");
      expect(formatBalance("123.456789", 1)).toBe("123.5");
      expect(formatBalance("123.456789", 4)).toBe("123.4568");
    });

    it("handles zero values with different decimal places", () => {
      expect(formatBalance("0", 0)).toBe("0");
      expect(formatBalance("0", 3)).toBe("0.000");
      expect(formatBalance(BigInt(0), 4)).toBe("0.0000");
    });
  });

  describe("formatAddress", () => {
    const validAddress = "0x742d35Cc6634C0532925a3b8D0C9e3e742d35Cc6";

    it("formats valid addresses correctly", () => {
      expect(formatAddress(validAddress)).toBe("0x742d…5Cc6");
      expect(formatAddress(validAddress, 6)).toBe("0x742d35…d35Cc6");
      expect(formatAddress(validAddress, 2)).toBe("0x74…c6");
    });

    it("handles undefined addresses", () => {
      expect(formatAddress(undefined)).toBe("0x0000…0000");
      expect(formatAddress(null as any)).toBe("0x0000…0000");
    });

    it("handles invalid addresses", () => {
      expect(formatAddress("invalid")).toBe("0x0000…0000");
      expect(formatAddress("0x123")).toBe("0x0000…0000"); // Too short
      expect(formatAddress("742d35Cc6634C0532925a3b8D0C9e3e742d35Cc6")).toBe("0x0000…0000"); // No 0x prefix
    });

    it("handles edge cases for chars parameter", () => {
      expect(formatAddress(validAddress, 0)).toBe("0x7…6"); // Minimum 1 char
      expect(formatAddress(validAddress, 25)).toBe(validAddress); // Returns full address when chars is too large
    });

    it("returns full address if short enough", () => {
      const shortAddress = "0x12345678"; // Short address that shouldn't be shortened
      expect(formatAddress(shortAddress, 4)).toBe(shortAddress);
    });
  });

  describe("formatTokenAmount", () => {
    it("formats token amounts with symbols", () => {
      expect(formatTokenAmount("123.45", "ETH")).toBe("123.45 ETH");
      expect(formatTokenAmount("1000", "USDT", 0)).toBe("1,000 USDT");
      expect(formatTokenAmount(BigInt(500), "BGB")).toBe("500.00 BGB");
    });

    it("handles undefined amounts", () => {
      expect(formatTokenAmount(undefined, "ETH")).toBe("0.00 ETH");
    });
  });

  describe("formatCompactNumber", () => {
    it("formats large numbers with suffixes", () => {
      expect(formatCompactNumber(1234)).toBe("1.2K");
      expect(formatCompactNumber(1234567)).toBe("1.2M");
      expect(formatCompactNumber(1234567890)).toBe("1.2B");
      expect(formatCompactNumber(123)).toBe("123.0");
    });

    it("handles negative numbers", () => {
      expect(formatCompactNumber(-1234)).toBe("-1.2K");
      expect(formatCompactNumber(-1234567)).toBe("-1.2M");
    });

    it("handles edge cases", () => {
      expect(formatCompactNumber(0)).toBe("0");
      expect(formatCompactNumber(undefined)).toBe("0");
      expect(formatCompactNumber("invalid")).toBe("0");
    });

    it("respects decimal places", () => {
      expect(formatCompactNumber(1234, 0)).toBe("1K");
      expect(formatCompactNumber(1234, 2)).toBe("1.23K");
    });
  });

  describe("formatPercentage", () => {
    it("formats percentages correctly", () => {
      expect(formatPercentage(12.34)).toBe("12.34%");
      expect(formatPercentage(0)).toBe("0.00%");
      expect(formatPercentage(100)).toBe("100.00%");
    });

    it("handles string inputs", () => {
      expect(formatPercentage("12.34")).toBe("12.34%");
      expect(formatPercentage("0")).toBe("0.00%");
    });

    it("handles edge cases", () => {
      expect(formatPercentage(undefined)).toBe("0.00%");
      expect(formatPercentage("invalid")).toBe("0.00%");
    });

    it("respects decimal places", () => {
      expect(formatPercentage(12.3456, 0)).toBe("12%");
      expect(formatPercentage(12.3456, 3)).toBe("12.346%");
    });
  });
});

describe("Error Utilities", () => {
  describe("parseError", () => {
    it("handles user rejection errors", () => {
      expect(parseError("User rejected the transaction")).toBe("Transaction cancelled by user");
      expect(parseError("User denied transaction signature")).toBe("Transaction cancelled by user");
      expect(parseError("user cancelled")).toBe("Transaction cancelled by user");
      expect(parseError("rejected by user")).toBe("Transaction cancelled by user");
    });

    it("handles insufficient funds errors", () => {
      expect(parseError("insufficient funds for gas")).toBe("Insufficient balance");
      expect(parseError("Insufficient balance")).toBe("Insufficient balance");
      expect(parseError("not enough ETH")).toBe("Insufficient balance");
    });

    it("handles unsupported token errors", () => {
      expect(parseError("Unsupported token")).toBe("This token isn't supported yet");
      expect(parseError("Token not supported")).toBe("This token isn't supported yet");
      expect(parseError("Invalid token address")).toBe("This token isn't supported yet");
    });

    it("handles network errors", () => {
      expect(parseError("Network error occurred")).toBe("Network connection error. Please try again.");
      expect(parseError("Connection failed")).toBe("Network connection error. Please try again.");
      expect(parseError("fetch failed")).toBe("Network connection error. Please try again.");
    });

    it("handles gas errors", () => {
      expect(parseError("Gas limit exceeded")).toBe("Transaction requires more gas. Please try again.");
      expect(parseError("out of gas")).toBe("Transaction requires more gas. Please try again.");
    });

    it("handles nonce errors", () => {
      expect(parseError("nonce too low")).toBe("Transaction conflict. Please try again.");
      expect(parseError("replacement transaction underpriced")).toBe("Transaction conflict. Please try again.");
    });

    it("handles wallet connection errors", () => {
      expect(parseError("Wallet not connected")).toBe("Please connect your wallet first");
      expect(parseError("No wallet found")).toBe("Please connect your wallet first");
    });

    it("handles network switching errors", () => {
      expect(parseError("Wrong network")).toBe("Please switch to the correct network");
      expect(parseError("Unsupported network")).toBe("Please switch to the correct network");
    });

    it("handles Error objects", () => {
      const error = new Error("User rejected the transaction");
      expect(parseError(error)).toBe("Transaction cancelled by user");
    });

    it("handles objects with message property", () => {
      const error = { message: "insufficient funds" };
      expect(parseError(error)).toBe("Insufficient balance");
    });

    it("handles unknown errors", () => {
      expect(parseError("Some random error")).toBe("Some random error");
      expect(parseError(null)).toBe("Unknown error");
      expect(parseError(undefined)).toBe("Unknown error");
      expect(parseError(123)).toBe("123");
    });
  });

  describe("categorizeError", () => {
    it("categorizes user rejection errors", () => {
      expect(categorizeError("User rejected")).toBe(ErrorType.USER_REJECTED);
    });

    it("categorizes insufficient funds errors", () => {
      expect(categorizeError("insufficient funds")).toBe(ErrorType.INSUFFICIENT_FUNDS);
    });

    it("categorizes network errors", () => {
      expect(categorizeError("network error")).toBe(ErrorType.NETWORK_ERROR);
    });

    it("categorizes transaction failures", () => {
      expect(categorizeError("execution reverted")).toBe(ErrorType.TRANSACTION_FAILED);
    });

    it("categorizes wallet errors", () => {
      expect(categorizeError("connect your wallet")).toBe(ErrorType.WALLET_ERROR);
    });

    it("categorizes validation errors", () => {
      expect(categorizeError("invalid address")).toBe(ErrorType.VALIDATION_ERROR);
    });

    it("categorizes unknown errors", () => {
      expect(categorizeError("random error")).toBe(ErrorType.UNKNOWN_ERROR);
    });
  });

  describe("createParsedError", () => {
    it("creates structured error objects", () => {
      const error = "User rejected the transaction";
      const parsed = createParsedError(error);

      expect(parsed.type).toBe(ErrorType.USER_REJECTED);
      expect(parsed.message).toBe("Transaction cancelled by user");
      expect(parsed.originalError).toBe(error);
    });

    it("handles Error objects", () => {
      const error = new Error("insufficient funds");
      const parsed = createParsedError(error);

      expect(parsed.type).toBe(ErrorType.INSUFFICIENT_FUNDS);
      expect(parsed.message).toBe("Insufficient balance");
      expect(parsed.originalError).toBe(error);
    });
  });
});

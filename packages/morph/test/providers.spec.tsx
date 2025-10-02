import { describe, it, expect, vi } from "vitest";
import React from 'react';

// Mock wagmi and react-query
vi.mock('wagmi', () => ({
  WagmiProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="wagmi-provider">{children}</div>,
  createConfig: vi.fn(() => ({})),
  http: vi.fn(() => ({})),
}));

vi.mock('wagmi/connectors', () => ({
  injected: vi.fn(() => ({})),
}));

vi.mock('@tanstack/react-query', () => ({
  QueryClient: vi.fn(() => ({})),
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="query-provider">{children}</div>,
}));

// Mock React
const mockRender = vi.fn();
vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    createElement: vi.fn((type, props, ...children) => {
      mockRender(type, props, children);
      return { type, props: { ...props, children } };
    }),
  };
});

// Import after mocking
import { C13Provider } from "../src/providers/C13Provider";

describe("C13Provider", () => {
  it("renders C13Provider with a dummy child", () => {
    const DummyChild = () => React.createElement('div', { 'data-testid': 'dummy-child' }, 'Test Child');
    
    const result = C13Provider({ 
      children: React.createElement(DummyChild) 
    });

    expect(result).toBeDefined();
    expect(result.type).toBeDefined();
  });

  it("asserts children render successfully", () => {
    const testChild = React.createElement('span', { 'data-testid': 'test-child' }, 'Hello World');
    
    const result = C13Provider({ 
      children: testChild 
    });

    expect(result.props.children).toBeDefined();
    expect(result.props.children.props.children).toBe(testChild);
  });

  it("confirms no runtime errors", () => {
    expect(() => {
      C13Provider({ 
        children: React.createElement('div', {}, 'No errors') 
      });
    }).not.toThrow();
  });

  it("accepts custom config and queryClient props", () => {
    const customConfig = { chains: [], connectors: [], transports: {} };
    const customQueryClient = {};

    expect(() => {
      C13Provider({ 
        children: React.createElement('div', {}, 'Custom props'),
        config: customConfig as any,
        queryClient: customQueryClient as any
      });
    }).not.toThrow();
  });

  it("uses default config when no custom config provided", () => {
    const result = C13Provider({ 
      children: React.createElement('div', {}, 'Default config') 
    });

    // Should render without throwing
    expect(result).toBeDefined();
    expect(result.type).toBeDefined();
  });
});

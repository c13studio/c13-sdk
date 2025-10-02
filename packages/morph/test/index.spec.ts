import { describe, it, expect } from 'vitest'
import { SDK_INFO } from '../src'

describe('SDK Info', () => {
  it('exports correct SDK information', () => {
    expect(SDK_INFO.name).toBe('@c13/morph-sdk')
    expect(SDK_INFO.version).toBe('0.0.1')
    expect(SDK_INFO.description).toBe('Professional TypeScript SDK for Morph blockchain')
  })
})
#!/usr/bin/env node

/**
 * React Compatibility Check Script
 * Ensures React 18 compatibility for @c13/morph-sdk
 */

const fs = require('fs')
const path = require('path')

function checkReactCompatibility() {
  console.log('🔍 Checking React compatibility...')

  try {
    // Check if we're in a project with package.json
    const packageJsonPath = path.join(process.cwd(), 'package.json')
    
    if (!fs.existsSync(packageJsonPath)) {
      console.log('ℹ️  No package.json found, skipping React compatibility check')
      return
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
    
    // Check dependencies and devDependencies for React versions
    const allDeps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies
    }

    const reactVersion = allDeps.react
    const reactDomVersion = allDeps['react-dom']

    if (reactVersion) {
      console.log(`📦 Found React version: ${reactVersion}`)
      
      // Check if React 19 is being used
      if (reactVersion.includes('19') || reactVersion.includes('^19') || reactVersion.includes('~19')) {
        console.warn('⚠️  WARNING: React 19 detected!')
        console.warn('   @c13/morph-sdk requires React 18 for compatibility')
        console.warn('   Please downgrade to React 18.3.1:')
        console.warn('   npm install react@18.3.1 react-dom@18.3.1')
        console.warn('')
        process.exit(1)
      }

      // Check if React version is too old
      const versionNumber = reactVersion.replace(/[^\d.]/g, '')
      const majorVersion = parseInt(versionNumber.split('.')[0])
      const minorVersion = parseInt(versionNumber.split('.')[1])

      if (majorVersion < 18 || (majorVersion === 18 && minorVersion < 3)) {
        console.warn('⚠️  WARNING: React version too old!')
        console.warn('   @c13/morph-sdk requires React 18.3.1 or higher')
        console.warn('   Please upgrade to React 18.3.1:')
        console.warn('   npm install react@18.3.1 react-dom@18.3.1')
        console.warn('')
        process.exit(1)
      }

      console.log('✅ React version is compatible!')
    } else {
      console.log('ℹ️  No React dependency found')
    }

    // Check for React DOM compatibility
    if (reactDomVersion && reactVersion) {
      if (reactDomVersion !== reactVersion) {
        console.warn('⚠️  WARNING: React and React DOM versions mismatch!')
        console.warn(`   React: ${reactVersion}`)
        console.warn(`   React DOM: ${reactDomVersion}`)
        console.warn('   Please ensure both versions match:')
        console.warn('   npm install react@18.3.1 react-dom@18.3.1')
        console.warn('')
      }
    }

  } catch (error) {
    console.error('❌ Error checking React compatibility:', error.message)
    process.exit(1)
  }
}

// Run the check
checkReactCompatibility()

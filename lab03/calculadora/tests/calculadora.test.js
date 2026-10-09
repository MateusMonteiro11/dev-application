import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'
import test from 'node:test'
import { transformWithEsbuild } from 'vite'

// Load the actual React component, including JSX, without adding a test framework.
const appUrl = new URL('../src/App.jsx', import.meta.url)
const require = createRequire(appUrl)
const { code } = await transformWithEsbuild(readFileSync(appUrl, 'utf8'), 'App.jsx', {
  loader: 'jsx',
  jsx: 'transform',
})
const resolvedCode = code.replace(/from (['"])([^'"]+)\1/g, (_, quote, specifier) => {
  const url = specifier.startsWith('.')
    ? new URL(specifier, appUrl)
    : pathToFileURL(require.resolve(specifier))
  return `from ${quote}${url.href}${quote}`
})
const { default: App } = await import(`data:text/javascript,${encodeURIComponent(resolvedCode)}`)

function calculator() {
  const app = new App({})
  // Apply updates synchronously so sequences of button handlers can be tested.
  app.setState = (update) => {
    const next = typeof update === 'function' ? update(app.state) : update
    if (next !== null) app.state = { ...app.state, ...next }
  }
  return app
}

function enter(app, number) {
  for (const character of String(number)) {
    if (character === '.') app.handleDecimal()
    else {
      assert.match(character, /^[0-9]$/)
      app.handleDigit(character)
    }
  }
}

test('retains precision across chained operations', () => {
  const app = calculator()
  enter(app, 99999999)
  app.handleOperator('+')
  enter(app, 2)
  app.handleOperator('−')
  assert.equal(app.state.display, '100000001')
  enter(app, 99999999)
  app.handleEquals()
  assert.equal(app.state.display, '2')
})

test('division followed by multiplication uses the unrounded value', () => {
  const app = calculator()
  enter(app, 1)
  app.handleOperator('÷')
  enter(app, 3)
  app.handleOperator('×')
  enter(app, 3)
  app.handleEquals()
  assert.equal(app.state.display, '1')
})

test('retains precision when continuing after equals and changing the sign', () => {
  const app = calculator()
  enter(app, 1)
  app.handleOperator('÷')
  enter(app, 3)
  app.handleEquals()
  assert.equal(app.state.display, '0.33333333')
  app.handleSign()
  app.handleOperator('×')
  enter(app, 3)
  app.handleEquals()
  assert.equal(app.state.display, '-1')
})

test('scientific notation preserves all eight significant digits', () => {
  const app = calculator()
  enter(app, 99999999)
  app.handleOperator('×')
  enter(app, 99999999)
  app.handleEquals()
  assert.equal(app.state.display, '9.9999998e+15')
  app.handleOperator('÷')
  enter(app, 99999999)
  app.handleEquals()
  assert.equal(app.state.display, '99999999')
})

test('basic arithmetic and decimal addition still work', () => {
  for (const [first, operator, second, expected] of [
    [12, '+', 3, '15'],
    [12, '−', 3, '9'],
    [12, '×', 3, '36'],
    [12, '÷', 3, '4'],
    [0.1, '+', 0.2, '0.3'],
  ]) {
    const app = calculator()
    enter(app, first)
    app.handleOperator(operator)
    enter(app, second)
    app.handleEquals()
    assert.equal(app.state.display, expected)
  }
})

test('decimal cancellation does not leave floating-point residue', () => {
  for (const keys of ['0.1+0.2-0.3=', '0.3-0.2-0.1=']) {
    const app = calculator()
    for (const key of keys) app.handleKeyDown({ key, preventDefault() {} })
    assert.equal(app.state.display, '0')
  }
})

test('small nonzero results are preserved', () => {
  const app = calculator()
  enter(app, '0.0000001')
  app.handleOperator('÷')
  enter(app, 10)
  app.handleEquals()
  app.handleOperator('−')
  enter(app, 0)
  app.handleEquals()
  assert.equal(app.state.value, 1e-8)
  assert.equal(app.state.display, '1e-8')
})

test('editing a new number discards the previous result', () => {
  const app = calculator()
  enter(app, 1)
  app.handleOperator('÷')
  enter(app, 3)
  app.handleEquals()
  enter(app, 24)
  app.handleBackspace()
  app.handleDecimal()
  enter(app, 5)
  app.handleOperator('×')
  enter(app, 2)
  app.handleEquals()
  assert.equal(app.state.display, '5')
})

test('supports a negative second operand', () => {
  const app = calculator()
  enter(app, 5)
  app.handleOperator('+')
  app.handleSign()
  app.handleDecimal()
  enter(app, 5)
  app.handleEquals()
  assert.equal(app.state.display, '4.5')
})

test('replacing an operator does not evaluate an absent operand', () => {
  const app = calculator()
  enter(app, 8)
  app.handleOperator('+')
  app.handleOperator('×')
  enter(app, 2)
  app.handleEquals()
  assert.equal(app.state.display, '16')
})

test('division by zero reports an error and accepts fresh input', () => {
  const app = calculator()
  enter(app, 1)
  app.handleOperator('÷')
  enter(app, 0)
  app.handleEquals()
  assert.equal(app.state.display, 'Erro')
  enter(app, 7)
  app.handleOperator('+')
  enter(app, 2)
  app.handleEquals()
  assert.equal(app.state.display, '9')
  app.handleClear()
  assert.equal(app.state.display, '0')
})

test('keyboard shortcuts and editable controls are left alone', () => {
  const app = calculator()
  enter(app, 9)
  for (const event of [
    { key: 'x', ctrlKey: true },
    { key: '1', altKey: true },
    { key: '+', metaKey: true },
    { key: '2', isComposing: true },
    { key: '3', defaultPrevented: true },
    { key: '4', target: { tagName: 'INPUT' } },
    { key: '5', target: { tagName: 'TEXTAREA' } },
    { key: '6', target: { tagName: 'SELECT' } },
    { key: '7', target: { isContentEditable: true } },
  ]) {
    const before = { ...app.state }
    app.handleKeyDown({
      ...event,
      preventDefault: () => assert.fail('Ignored keys must keep their default behavior'),
    })
    assert.deepEqual(app.state, before)
  }
})

test('keyboard arithmetic, comma decimals and clearing work', () => {
  const app = calculator()
  for (const key of ['0', ',', '1', '+', '0', '.', '2', 'Enter']) {
    let prevented = false
    app.handleKeyDown({ key, preventDefault: () => { prevented = true } })
    assert.equal(prevented, true)
  }
  assert.equal(app.state.display, '0.3')
  app.handleKeyDown({ key: 'Escape', preventDefault() {} })
  assert.equal(app.state.display, '0')
})

import React from 'react'
import { Soma } from './operations/Soma.js'
import { Subtracao } from './operations/Subtracao.js'
import { Multiplicacao } from './operations/Multiplicacao.js'
import { Divisao } from './operations/Divisao.js'

const MAX_DIGITS = 8

const initialState = {
  display: '0',
  value: 0,
  storedValue: null,
  operator: null,
  waitingForNumber: false,
  error: false,
}

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = { ...initialState }
    this.operations = {
      '+': new Soma(),
      '−': new Subtracao(),
      '×': new Multiplicacao(),
      '÷': new Divisao(),
    }
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown)
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown)
  }

  calculate = (first, second, operator) => {
    const result = this.operations[operator].calculate(first, second)
    if (!Number.isFinite(result)) return null

    // Treat floating-point residue from cancelling operands as zero.
    if (operator === '+' || operator === '−') {
      const tolerance = 2 * Number.EPSILON * Math.max(Math.abs(first), Math.abs(second))
      if (Math.abs(result) <= tolerance) return 0
    }

    return result
  }

  formatResult = (result) => {
    const exactDisplay = result.toString()
    if (exactDisplay.length <= 10) return exactDisplay

    const rounded = Number(result.toPrecision(MAX_DIGITS))
    const display = rounded.toString()
    return display.length <= 10 ? display : result.toExponential(MAX_DIGITS - 1)
  }

  handleDigit = (digit) => {
    this.setState((previous) => {
      const startsNewNumber = previous.error || previous.waitingForNumber || previous.display === '0'
      if (!startsNewNumber && previous.display.replace(/\D/g, '').length >= MAX_DIGITS) {
        return null
      }

      const display = startsNewNumber
        ? digit
        : previous.display === '-0'
          ? `-${digit}`
          : previous.display + digit

      return {
        display,
        value: Number(display),
        waitingForNumber: false,
        error: false,
      }
    })
  }

  handleDecimal = () => {
    this.setState((previous) => {
      if (previous.error || previous.waitingForNumber) {
        return { display: '0.', value: 0, waitingForNumber: false, error: false }
      }

      return previous.display.includes('.') ||
        previous.display.replace(/\D/g, '').length >= MAX_DIGITS
        ? null
        : { display: `${previous.display}.` }
    })
  }

  handleClear = () => this.setState({ ...initialState })

  handleBackspace = () => {
    this.setState((previous) => {
      if (previous.error) return { ...initialState }
      if (previous.waitingForNumber) return null

      const shortened = previous.display.slice(0, -1)
      const display = shortened === '' || shortened === '-' ? '0' : shortened
      return {
        display,
        value: Number(display),
      }
    })
  }

  handleSign = () => {
    this.setState((previous) => {
      if (previous.waitingForNumber && previous.operator) {
        return { display: '-0', value: -0, waitingForNumber: false }
      }

      if (previous.error || previous.display === '0') return null

      return {
        value: -previous.value,
        display: previous.display.startsWith('-')
          ? previous.display.slice(1)
          : `-${previous.display}`,
      }
    })
  }

  handleOperator = (nextOperator) => {
    this.setState((previous) => {
      if (previous.error) return null

      if (previous.operator && !previous.waitingForNumber) {
        const result = this.calculate(
          previous.storedValue,
          previous.value,
          previous.operator,
        )

        if (result === null) {
          return { ...initialState, display: 'Erro', error: true }
        }

        return {
          display: this.formatResult(result),
          value: result,
          storedValue: result,
          operator: nextOperator,
          waitingForNumber: true,
        }
      }

      return {
        storedValue: previous.storedValue ?? previous.value,
        operator: nextOperator,
        waitingForNumber: true,
      }
    })
  }

  handleEquals = () => {
    this.setState((previous) => {
      if (
        previous.error ||
        previous.operator === null ||
        previous.storedValue === null ||
        previous.waitingForNumber
      ) {
        return null
      }

      const result = this.calculate(
        previous.storedValue,
        previous.value,
        previous.operator,
      )

      return result === null
        ? { ...initialState, display: 'Erro', error: true }
        : {
            ...initialState,
            display: this.formatResult(result),
            value: result,
            waitingForNumber: true,
          }
    })
  }

  handleKeyDown = (event) => {
    if (
      event.defaultPrevented ||
      event.ctrlKey ||
      event.metaKey ||
      event.altKey ||
      event.isComposing ||
      event.target?.isContentEditable ||
      ['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target?.tagName)
    ) {
      return
    }

    const { key } = event

    if (/^[0-9]$/.test(key)) this.handleDigit(key)
    else if (key === '.' || key === ',') this.handleDecimal()
    else if (key === '+') this.handleOperator('+')
    else if (key === '-') this.handleOperator('−')
    else if (key === '*' || key.toLowerCase() === 'x') this.handleOperator('×')
    else if (key === '/') this.handleOperator('÷')
    else if (key === '=' || key === 'Enter') this.handleEquals()
    else if (key === 'Backspace') this.handleBackspace()
    else if (key === 'Escape') this.handleClear()
    else return

    event.preventDefault()
  }

  render() {
    const { display, storedValue, operator } = this.state

    return (
      <main className="page">
        <section className="calculator" aria-label="Calculadora">
          <div className="calculator__header">
            <span className="calculator__label">CALCULADORA</span>
            <span className="calculator__hint">Operações básicas</span>
          </div>

          <div className="calculator__screen">
            <div className="calculator__history" aria-hidden="true">
              {operator ? `${this.formatResult(storedValue)} ${operator}` : '\u00a0'}
            </div>
            <output
              className={`calculator__display${display.length > 10 ? ' calculator__display--compact' : ''}`}
              aria-live="polite"
            >
              {display}
            </output>
          </div>

          <div className="calculator__keys">
            <button className="key key--utility" onClick={this.handleClear} type="button">AC</button>
            <button className="key key--utility" onClick={this.handleSign} type="button" aria-label="Trocar sinal">±</button>
            <button className="key key--utility" onClick={this.handleBackspace} type="button" aria-label="Apagar último dígito">⌫</button>
            <button className="key key--operator" onClick={() => this.handleOperator('÷')} type="button" aria-label="Dividir">÷</button>

            <button className="key" onClick={() => this.handleDigit('7')} type="button">7</button>
            <button className="key" onClick={() => this.handleDigit('8')} type="button">8</button>
            <button className="key" onClick={() => this.handleDigit('9')} type="button">9</button>
            <button className="key key--operator" onClick={() => this.handleOperator('×')} type="button" aria-label="Multiplicar">×</button>

            <button className="key" onClick={() => this.handleDigit('4')} type="button">4</button>
            <button className="key" onClick={() => this.handleDigit('5')} type="button">5</button>
            <button className="key" onClick={() => this.handleDigit('6')} type="button">6</button>
            <button className="key key--operator" onClick={() => this.handleOperator('−')} type="button" aria-label="Subtrair">−</button>

            <button className="key" onClick={() => this.handleDigit('1')} type="button">1</button>
            <button className="key" onClick={() => this.handleDigit('2')} type="button">2</button>
            <button className="key" onClick={() => this.handleDigit('3')} type="button">3</button>
            <button className="key key--operator" onClick={() => this.handleOperator('+')} type="button" aria-label="Somar">+</button>

            <button className="key key--zero" onClick={() => this.handleDigit('0')} type="button">0</button>
            <button className="key" onClick={this.handleDecimal} type="button" aria-label="Vírgula decimal">,</button>
            <button className="key key--equals" onClick={this.handleEquals} type="button" aria-label="Igual">=</button>
          </div>
        </section>
        <p className="keyboard-hint">Use os botões ou o teclado para calcular.</p>
      </main>
    )
  }
}

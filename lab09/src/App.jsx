import { useEffect, useRef, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  getIdToken,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'
import { auth, db, isAdminApp } from './firebase'
import { dishes, money, orderData } from './menu'

const messages = {
  'auth/invalid-credential': 'E-mail ou senha incorretos.',
  'auth/email-already-in-use': 'Este e-mail já está cadastrado. Entre com sua senha.',
  'auth/weak-password': 'Use uma senha com pelo menos 6 caracteres.',
  'auth/invalid-email': 'Informe um e-mail válido.',
  'auth/too-many-requests': 'Muitas tentativas. Aguarde e tente novamente.',
  'auth/network-request-failed': 'Não foi possível conectar. Confira sua internet.',
  'permission-denied': 'Acesso não autorizado. Entre novamente ou contate o administrador.',
  unavailable: 'Serviço indisponível. Tente novamente.',
}

function errorText(error) {
  return messages[error.code] || 'Não foi possível concluir. Tente novamente.'
}

function Notice({ children }) {
  return children ? <p className="notice" role="alert">{children}</p> : null
}

function AuthForm({ user, onUser, onWorking }) {
  const [register, setRegister] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const profileOnly = !!user && !isAdminApp

  async function submit(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const name = String(form.get('name') || '').trim()

    if ((register || profileOnly) && name.length < 2) {
      setError('Informe seu nome com pelo menos 2 caracteres.')
      return
    }

    setError('')
    setBusy(true)
    onWorking(true)

    try {
      let current = user

      if (!profileOnly) {
        const action = register ? createUserWithEmailAndPassword : signInWithEmailAndPassword
        const result = await action(auth, String(form.get('email')).trim(), String(form.get('password')))
        current = result.user
      }

      if (register || profileOnly) {
        await updateProfile(current, { displayName: name })
        await getIdToken(current, true)
      }

      onUser(current)
    } catch (err) {
      setError(errorText(err))
    } finally {
      setBusy(false)
      onWorking(false)
    }
  }

  return (
    <section className="auth-form">
      <h1>{isAdminApp ? 'Login do restaurante' : profileOnly ? 'Completar cadastro' : register ? 'Cadastro' : 'Login'}</h1>
      {isAdminApp && <p className="muted">Acesso para administradores autorizados.</p>}
      <form onSubmit={submit}>
        {(register || profileOnly) && (
          <label>
            Nome do cliente
            <input name="name" autoComplete="name" required minLength={2} maxLength={80} disabled={busy} />
          </label>
        )}
        {!profileOnly && (
          <>
            <label>
              E-mail
              <input type="email" name="email" autoComplete="email" required maxLength={254} disabled={busy} />
            </label>
            <label>
              Senha
              <input type="password" name="password" autoComplete={register ? 'new-password' : 'current-password'} required minLength={6} maxLength={128} disabled={busy} />
            </label>
            {register && <p className="muted small">A senha deve ter pelo menos 6 caracteres.</p>}
          </>
        )}
        <Notice>{error}</Notice>
        <button disabled={busy}>{busy ? 'Aguarde…' : profileOnly ? 'Salvar nome' : register ? 'Cadastrar' : 'Entrar'}</button>
      </form>
      {!isAdminApp && !profileOnly && (
        <button className="text-button" disabled={busy} onClick={() => { setRegister(!register); setError('') }}>
          {register ? 'Já tenho uma conta' : 'Criar conta'}
        </button>
      )}
    </section>
  )
}

function SelectedDish({ dish }) {
  return (
    <div className="selected-dish">
      <img src={dish.image} alt={dish.name} width="120" height="100" />
      <div>
        <h2>{dish.name}</h2>
        <p className="muted">{dish.description}</p>
        <p>{money(dish.price)} por unidade</p>
      </div>
    </div>
  )
}

function Cardapio({ user }) {
  const [dish, setDish] = useState(null)
  const [quantity, setQuantity] = useState('1')
  const [step, setStep] = useState('menu')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [receipt, setReceipt] = useState('')
  const pendingRef = useRef(null)
  const submitting = useRef(false)
  const heading = useRef(null)

  useEffect(() => {
    heading.current?.focus()
    window.scrollTo(0, 0)
  }, [step])

  function select(item) {
    setDish(item)
    setQuantity('1')
    setError('')
    pendingRef.current = null
    setStep('quantity')
  }

  function confirmQuantity(event) {
    event.preventDefault()
    const value = Number(quantity)

    if (!Number.isInteger(value) || value < 1 || value > 20) {
      setError('Escolha entre 1 e 20 unidades.')
      return
    }

    setError('')
    setStep('review')
  }

  async function finish() {
    if (submitting.current) return
    submitting.current = true
    setBusy(true)
    setError('')
    pendingRef.current ||= doc(collection(db, 'pedidos'))
    const ref = pendingRef.current

    try {
      await getIdToken(user, true)
      const existing = await getDoc(ref)

      if (!existing.exists()) {
        await setDoc(ref, { ...orderData(user, dish, Number(quantity)), criadoEm: serverTimestamp() })
      }

      setReceipt(ref.id)
      setStep('success')
    } catch (err) {
      setError(errorText(err))
    } finally {
      setBusy(false)
      submitting.current = false
    }
  }

  if (step === 'menu') {
    return (
      <>
        <h1 ref={heading} tabIndex={-1}>Cardápio</h1>
        <div className="menu-list">
          {dishes.map((item) => (
            <article className="dish" key={item.id}>
              <img src={item.image} alt={item.name} width="150" height="110" loading="lazy" />
              <div className="dish-content">
                <h2>{item.name}</h2>
                <p className="muted">{item.description}</p>
                <strong>{money(item.price)}</strong>
              </div>
              <button onClick={() => select(item)} aria-label={`Escolher ${item.name}`}>Escolher</button>
            </article>
          ))}
        </div>
      </>
    )
  }

  if (step === 'success') {
    return (
      <section className="checkout">
        <h1 ref={heading} tabIndex={-1}>Pedido enviado</h1>
        <p>O restaurante recebeu seu pedido.</p>
        <dl className="summary">
          <div><dt>Prato</dt><dd>{dish.name}</dd></div>
          <div><dt>Quantidade</dt><dd>{quantity}</dd></div>
          <div><dt>Total</dt><dd>{money(dish.price * Number(quantity))}</dd></div>
          <div><dt>Número do pedido</dt><dd>{receipt}</dd></div>
        </dl>
        <button onClick={() => { pendingRef.current = null; setStep('menu') }}>Voltar ao cardápio</button>
      </section>
    )
  }

  return (
    <section className="checkout">
      <button className="text-button back-button" disabled={busy} onClick={() => {
        setError('')
        pendingRef.current = null
        setStep(step === 'review' ? 'quantity' : 'menu')
      }}>
        {step === 'review' ? 'Alterar quantidade' : 'Voltar ao cardápio'}
      </button>
      <h1 ref={heading} tabIndex={-1}>{step === 'quantity' ? 'Confirmar pedido' : 'Resumo do pedido'}</h1>
      <SelectedDish dish={dish} />
      {step === 'quantity' ? (
        <form onSubmit={confirmQuantity}>
          <label>
            Quantidade
            <input className="quantity-input" type="number" min="1" max="20" step="1" required value={quantity} onChange={(event) => setQuantity(event.target.value)} />
          </label>
          <p className="muted small">De 1 a 20 unidades.</p>
          <Notice>{error}</Notice>
          <button>Confirmar quantidade</button>
        </form>
      ) : (
        <>
          <dl className="summary">
            <div><dt>Cliente</dt><dd>{user.displayName}</dd></div>
            <div><dt>Quantidade</dt><dd>{quantity}</dd></div>
            <div><dt>Preço unitário</dt><dd>{money(dish.price)}</dd></div>
            <div className="total"><dt>Total</dt><dd>{money(dish.price * Number(quantity))}</dd></div>
          </dl>
          <Notice>{error}</Notice>
          <button disabled={busy} onClick={finish}>{busy ? 'Enviando…' : 'Finalizar pedido'}</button>
        </>
      )}
    </section>
  )
}

function Pedidos({ user }) {
  const [status, setStatus] = useState('loading')
  const [orders, setOrders] = useState([])
  const [error, setError] = useState('')
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    let cancelled = false
    let unsubscribe = () => {}
    setStatus('loading')
    setOrders([])
    setError('')

    getDoc(doc(db, 'administradores', user.uid)).then((snapshot) => {
      if (cancelled) return

      if (!snapshot.exists()) {
        setStatus('denied')
        return
      }

      unsubscribe = onSnapshot(
        query(collection(db, 'pedidos'), orderBy('criadoEm', 'desc')),
        { includeMetadataChanges: true },
        (result) => {
          if (cancelled) return
          setOrders(result.docs.map((item) => ({ id: item.id, ...item.data() })))
          setStatus(result.metadata.fromCache ? 'cached' : 'ready')
        },
        (err) => {
          if (cancelled) return
          setError(errorText(err))
          setStatus('error')
        },
      )
    }).catch((err) => {
      if (cancelled) return
      setError(errorText(err))
      setStatus('error')
    })

    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [user.uid, retry])

  if (status === 'denied') {
    return (
      <>
        <h1>Acesso restrito</h1>
        <p>Sua conta não tem permissão para consultar os pedidos.</p>
      </>
    )
  }

  return (
    <>
      <h1>Pedidos</h1>
      <Notice>{error}</Notice>
      {status === 'error' && <button onClick={() => setRetry(retry + 1)}>Tentar novamente</button>}
      {status === 'loading' && <p role="status">Carregando pedidos…</p>}
      {(status === 'ready' || status === 'cached') && (
        <>
          <p className="muted small" role="status">
            {status === 'cached' ? 'Aguardando conexão…' : 'Atualização automática. Mais recentes primeiro.'}
          </p>
          {orders.length === 0 ? (
            <p>{status === 'ready' ? 'Nenhum pedido registrado.' : 'Conectando ao restaurante…'}</p>
          ) : (
            <ul className="order-list">
              {orders.map((item) => (
                <li key={item.id}>
                  <div className="order-header">
                    <h2>{item.nomeCliente}</h2>
                    <span className="muted small">
                      {item.criadoEm?.toDate
                        ? item.criadoEm.toDate().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', dateStyle: 'short', timeStyle: 'short' })
                        : 'Confirmando data…'}
                    </span>
                  </div>
                  <dl className="order-fields">
                    <div><dt>Prato</dt><dd>{item.prato}</dd></div>
                    <div><dt>Quantidade</dt><dd>{item.quantidade}</dd></div>
                    <div><dt>Total</dt><dd>{money(item.valorTotalCentavos)}</dd></div>
                  </dl>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </>
  )
}

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [working, setWorking] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    document.title = `${isAdminApp ? 'Pedidos' : 'Cardápio'} | Restaurante`
    return onAuthStateChanged(auth, (current) => {
      setUser(current)
      setLoading(false)
    }, () => {
      setError('Não foi possível iniciar a sessão. Recarregue a página.')
      setLoading(false)
    })
  }, [])

  async function logout() {
    try {
      await signOut(auth)
    } catch (err) {
      setError(errorText(err))
    }
  }

  const needsLogin = !user || working || (!isAdminApp && !user.displayName?.trim())

  return (
    <>
      <a className="skip-link" href="#content">Pular para o conteúdo</a>
      <header>
        <div className="header-content">
          <span className="site-name">Restaurante</span>
          <nav aria-label="Principal">
            <a href="/cardapio" aria-current={!isAdminApp ? 'page' : undefined}>Cardápio</a>
            <a href="/pedidos" aria-current={isAdminApp ? 'page' : undefined}>Pedidos</a>
            {user && !working && <button className="text-button" onClick={logout}>Sair</button>}
          </nav>
        </div>
      </header>
      <main id="content">
        <Notice>{error}</Notice>
        {loading ? (
          <p role="status">Carregando…</p>
        ) : needsLogin ? (
          <AuthForm user={user} onUser={setUser} onWorking={setWorking} />
        ) : isAdminApp ? (
          <Pedidos key={user.uid} user={user} />
        ) : (
          <Cardapio key={user.uid} user={user} />
        )}
      </main>
    </>
  )
}

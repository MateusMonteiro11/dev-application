import { initializeApp } from 'firebase/app'
import { initializeAuth, browserSessionPersistence } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

if (Object.values(config).some((value) => !value?.trim())) {
  throw new Error('Configuração Firebase incompleta. Preencha as variáveis VITE_FIREBASE_* na .env e reinicie o Vite.')
}

export const isAdminApp = /^\/pedidos(?:\/|$)/.test(window.location.pathname)
const app = initializeApp(config, isAdminApp ? 'restaurante' : 'cardapio')
export const auth = initializeAuth(app, { persistence: browserSessionPersistence })
export const db = getFirestore(app)

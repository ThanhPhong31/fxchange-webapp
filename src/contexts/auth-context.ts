import type { User } from '@/types/model'
import { createContext, useContext } from 'react';

type AuthStateType = {
  user: User | null
  isValidating?: boolean
  signOut: () => void
  signIn: () => void
  signInWithEmailPassword: (email: string, password: string) => void
  redirectToLogin: () => void
  updatePhone: (phone: string) => void
}

const initialState: AuthStateType = {
  user: null,
  isValidating: false,
  signOut: () => {},
  signIn: () => {},
  signInWithEmailPassword: () => {},
  redirectToLogin: () => {},
  updatePhone: () => {}
}

export const AuthContext = createContext(initialState)
export const AuthProvider = AuthContext.Provider

export const useAuth = () => {
  return useContext(AuthContext)
}

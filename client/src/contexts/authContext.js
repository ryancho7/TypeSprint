import { createContext } from 'react'

export const AuthContext = createContext({
    isAuthenticated: false,
    inGuestMode: null,
    user: null,
    setAuth: () => { }
})

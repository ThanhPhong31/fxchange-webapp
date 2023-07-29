import { GoogleAuthProvider } from 'firebase/auth'

export const getSignInProvider = () => {
  const provider = new GoogleAuthProvider()
  provider.setCustomParameters({
    hd: 'fpt.edu.vn',
  })
  provider.addScope('email')

  return provider
}

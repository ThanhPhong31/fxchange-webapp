import { cookies } from 'next/dist/client/components/headers'
import Cookies from 'universal-cookie'

export const storeAuthToken = (token: string, customCookieName?: string) => {
  const cookieName = customCookieName || 'token'
  const cookies = new Cookies()
  cookies.set(cookieName, token, { httpOnly: true })
}

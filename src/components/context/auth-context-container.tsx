import { useApp } from '@/contexts/app-context'
import { AuthProvider } from '@/contexts/auth-context'
import client from '@/graphql'
import { auth } from '@/libs/firebase'
import { resourceUrls } from '@/libs/resource-urls'
import authService from '@/services/auth.service'
import { WithChildren } from '@/types/WithChildren'
import { User } from '@/types/model'
import { message } from 'antd'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
import { useAuthState, useSignOut } from 'react-firebase-hooks/auth'

export const ROLES = {
  ADMIN: 0,
  MODERATOR: 1,
  MEMBER: 2,
}

export const isAdmin = (role: number) => role === ROLES.ADMIN
export const isModerator = (role: number) => role === ROLES.MODERATOR
export const isAdminOrModerator = (role: number) => [ROLES.ADMIN, ROLES.MODERATOR].includes(role)

const AuthContextContainer = ({ children }: WithChildren) => {
  const [signOut, signOutLoading, signOutError] = useSignOut(auth)
  const { toastIt } = useApp()
  const [user, loading, error] = useAuthState(auth)
  const [isValidating, setIsValidating] = useState(true)
  const [userData, setUserData] = useState<User | null>(null)
  const router = useRouter()
  const [messageApi, contextHolder] = message.useMessage()

  useEffect(() => {
    if (router.asPath === resourceUrls.login && (isValidating || loading)) {
      messageApi.open({
        content: 'Đang tải',
        key: 'is-validating',
        type: 'loading',
        duration: 0,
      })
    }

    return () => {
      messageApi.destroy('is-validating')
    }
  }, [isValidating, loading, messageApi, router.asPath])

  useEffect(() => {
    ;(async () => {
      syncLoginState()
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, resourceUrls, userData])

  if (error || signOutError) {
    toastIt({
      title: 'Lỗi đăng nhập',
      description: 'Vui lòng kiểm tra thông tin đăng nhập và thử lại.',
    })
    router.push(resourceUrls.homepage)
  }

  async function syncLoginState() {
    try {
      if (!loading && user && !userData) {
        const redirectUrl: string | string[] | undefined = router.query.redirectUrl
        setUserData(null)
        setIsValidating(true)
        const userData: User = await authService.signInWithServer(await user.getIdToken())

        flushSync(() => setUserData({ ...userData }))
        // messageApi.success('Đăng nhập thành công')

        if (redirectUrl) {
          return router.push(redirectUrl as string)
        }

        if (router.asPath === resourceUrls.dashboard.login && isAdminOrModerator(userData.role)) {
          console.log('redirect to dashboard')
          return router.push(resourceUrls.dashboard.base)
        }

        if (router.asPath === resourceUrls.login) {
          return router.push(resourceUrls.homepage)
        }
      }
    } catch (e) {
      console.error(e)
      if (!signOutLoading) messageApi.error('Lỗi đăng nhập. Vui lòng thử lại sau.')
      onSignOut()
      setUserData(null)
    } finally {
      setIsValidating(false)
    }
  }

  const onLogin = async () => {
    try {
      await authService.signInWithProvider()
    } catch (error) {
      console.log({ error })
      messageApi.error('Lỗi đăng nhập')
    }
  }

  const onLoginWithEmailPassword = async (email: string, password: string) => {
    try {
      setIsValidating(true)
      if (email.trim() === '') throw new Error('Vui lòng nhập email.')
      if (password.trim() === '') throw new Error('Vui lòng nhập mật khẩu.')
      await authService.signInWithEmailAndPassword(email, password)
    } catch (error) {
      setIsValidating(false)
      console.log({ error })
      messageApi.error('Lỗi đăng nhập')
    }
  }

  const onSignOut = async () => {
    try {
      await signOut()
      await authService.logout()
      await client.clearStore()
      setUserData(null)
      router.push(resourceUrls.homepage)
    } catch (error) {
      console.error(error)
    }
    // router.reload()
  }

  const redirectToLogin = () => {
    router.push({
      pathname: resourceUrls.login,
      query: {
        redirectUrl: router.asPath,
      },
    })
  }

  const updatePhone = (phone: string) => {
    if (!userData) return
    setUserData({
      ...userData,
      phone: phone,
    })
  }

  return (
    <AuthProvider
      value={{
        user: userData,
        signOut: onSignOut,
        signIn: onLogin,
        signInWithEmailPassword: onLoginWithEmailPassword,
        redirectToLogin,
        isValidating: isValidating,
        updatePhone: updatePhone,
      }}
    >
      {contextHolder}
      {children}
    </AuthProvider>
  )
}

export default AuthContextContainer

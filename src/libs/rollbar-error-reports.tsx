import { WithChildren } from '../types/WithChildren'
import NotFoundPage from '@/pages/404'
import { ErrorBoundary, Provider } from '@rollbar/react'

const rollbarConfig = {
  accessToken: 'd0c1239f122a4c3fa8920112a7bad9db',
  environment: 'testenv',
}

export const RollbarProvider = ({ children }: WithChildren) => {
  return (
    <Provider config={rollbarConfig}>
      <ErrorBoundary>{children}</ErrorBoundary>
    </Provider>
  )
}

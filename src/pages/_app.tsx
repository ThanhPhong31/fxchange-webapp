import 'antd'
import '../styles/globals.css'
import AppContextContainer from '@/components/context/app-context-container'
import AuthContextContainer from '@/components/context/auth-context-container'
import ChatContextContainer from '@/components/context/chat-context-container'
import { SocketProvider } from '@/components/context/socket-provider'
import { getAppLayout } from '@/components/layouts/app-layout'
import { MUICssProvider } from '@/components/ui/customs/custom-css-vars-provider'
import client from '@/graphql'
import { ApolloProvider } from '@apollo/client'
import { NextPage } from 'next'
import { NextSeo } from 'next-seo'
import { AppProps } from 'next/app'
import { Inter } from 'next/font/google'
import Head from 'next/head'
import { ReactElement, ReactNode } from 'react'

export const inter = Inter({ subsets: ['latin'] })

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
  meta?: {
    title?: string
    description?: string
  }
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout || getAppLayout

  return (
    <>
      <NextSeo
        facebook={{
          appId: '752817676528615',
        }}
        title={Component.meta?.title}
        defaultTitle="FXchange"
        description={
          Component.meta?.description ||
          'Trang trao đổi, mua bán và đấu giá vật phẩm cũ dành riêng cho sinh viên Đại học FPT'
        }
      />
      <Head>
        <link
          rel="shortcut icon"
          href="/favicon.ico"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/fx-180.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/fx-32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/fx-16.png"
        />
      </Head>
      <ApolloProvider client={client}>
        <AuthContextContainer>
          <AppContextContainer>
            <SocketProvider>
              <ChatContextContainer>
                <MUICssProvider>{getLayout(<Component {...pageProps} />)}</MUICssProvider>
              </ChatContextContainer>
            </SocketProvider>
          </AppContextContainer>
        </AuthContextContainer>
      </ApolloProvider>
    </>
  )
}

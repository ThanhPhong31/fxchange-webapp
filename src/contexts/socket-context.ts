import socket from '@/libs/socket-io'
import { createContext, useContext } from 'react'
import { Socket } from 'socket.io-client'

export type SocketContextState = {
  socket: Socket | null
  isConnected: boolean
}

const initialState: SocketContextState = { socket: null, isConnected: false }

export const SocketContext = createContext(initialState)
export const useSocket = () => useContext(SocketContext)

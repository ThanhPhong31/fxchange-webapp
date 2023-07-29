import { io } from 'socket.io-client'

const socket = io(`${process.env.NEXT_PUBLIC_API_URL}/` || 'http://localhost:8080/', {
  autoConnect: false,
  reconnection: true,
  reconnectionDelay: 500,
  reconnectionAttempts: 20,
})

export default socket

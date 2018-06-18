import io from 'socket.io-client'
const socket = io(window.location.origin)

socket.on('connect', () => {
  console.log('Connected!')
})

socket.on('hello', () => {
  console.log('hi frontend')
})

export default socket

import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { Server } from 'socket.io'
import { serveStatic } from '@hono/node-server/serve-static';
import ejs from 'ejs'

const app = new Hono()
const server = serve({
    fetch: app.fetch,
    port: 8000,
}, (info) => {
    console.log(`Server spuštěn na  http://localhost:${info.port}`)
})

const io = new Server(server, {
    cors: { origin: '*' },
})

app.use('/*', serveStatic({ root: './public' }))

io.on('connection', (socket) => {
    const role = socket.handshake.query.role

    if (role === 'admin') {
    socket.join('admin')
  } else if (role === 'player') {
    socket.join('players')
  } else if (role === 'screen') {
    socket.join('screen')
  }

    console.log(`Socket.IO připojen: ${socket.id}`)
    socket.emit('welcome', 'Vítejte na PubQuizu!')

    socket.on('otazka', (otazka) => {
        console.log(`Otazka od klienta: ${otazka}`)
        io.to(['players', 'screen']).emit('otazka', otazka)
    })

    socket.on('odpoved', (odpoved) => {
        console.log(`Odpoved od klienta: ${odpoved}`)
        io.to('admin').emit('odpoved', odpoved)
    })

    socket.on('disconnect', () => {
        console.log(`Socket.IO odpojen: ${socket.id}`)
    })
})

app.get('/', async(c) => {
    c.status(303)
    c.header('Location', '/login')
    return c.text("Redirecting...")
})
import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import ejs from 'ejs'

const app = new Hono()

const username = "Tomáš"

let todos = [
    {
        id: 1,
        title: 'Zajít na pivo',
        done: true
    },
    {
        id: 2,
        title: 'Udělat úkol',
        done: false
    }
]

function getReturnUrl(c) {
    const referer = c.req.header('referer')
    if (!referer) return '/'
    try {
        const url = new URL(referer)
        return url.pathname + url.search
    } catch {
        return '/'
    }
}

app.use(async(c, next) => {
    console.log(c.req.method, c.req.url)
    if (c.req.method === 'POST') {
        const formData = await c.req.formData()
        console.log('Form data:')
        for (const [key, value] of formData.entries()) {
            console.log(`  ${key}: ${value}`)
        }
    }
    await next()
})

app.get('/', async(c) => {
    const html = await ejs.renderFile('views/index.html', {
        name: username,
        todos: todos,
        }
    )

    return c.html(html)
})

app.post('/add-todo', async(c) => {
    const body = await c.req.formData()
    const title = body.get('title')

    todos.push({
        id: todos.length + 1,
        title,
        done: false
    })
    return c.redirect('/')
})

app.get('/remove-todo/:id', async (c) => {
    const id = Number(c.req.param('id'))
    todos = todos.filter((todo) => todo.id !== id)
    return c.redirect('/')
})

app.post('/edit-todo/:id', async (c) => {
    const id = Number(c.req.param('id'))
    const body = await c.req.formData()
    let title = body.get('title')
    let toggle = Boolean(body.get('toggle'))
    const todo = todos.find((todo) => todo.id === id)

    if (!todo) {
        return c.redirect('/')
    } else {
        if (title) {
            todo.title = title
        }
        if (toggle) {
            todo.done = !todo.done
        }
    }

    return c.redirect(getReturnUrl(c))
})

app.get('/todo/:id', async (c) => {
    const id = Number(c.req.param('id'))
    const todo = todos.find((todo) => todo.id === id)
    if (!todo) {
        c.status(404)
        const html = await ejs.renderFile('views/404.html')
        return c.html(html)
    }

    const html = await ejs.renderFile('views/todo.html', {
        todo: todo,
        }
    )
    return c.html(html)
})

app.notFound(async(c) => {
    const html = await ejs.renderFile('views/404.html')
    c.status(404)
    return c.html(html)
})

serve({
    fetch: app.fetch,
    port: 8000,
}, (info) => {
    console.log(`Server spuštěn na  http://localhost:${info.port}`)
})
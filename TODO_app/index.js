import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import ejs from 'ejs'
import { drizzle } from "drizzle-orm/libsql"
import { todosTable } from './src/schema.js'
import { eq } from "drizzle-orm"

const db = drizzle({
  connection: "file:db.sqlite",
  logger: true,
})

const app = new Hono()

const username = "Tomáš"

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
    const filter = c.req.query('filter') || 'all'
    const todos = await db.select().from(todosTable).all()
    let filteredTodos = todos

    if (filter === 'completed') {
        filteredTodos = todos.filter((todo) => todo.done)
    } else if (filter === 'pending') {
        filteredTodos = todos.filter((todo) => !todo.done)
    }

    const html = await ejs.renderFile('views/index.html', {
        name: username,
        todos: filteredTodos,
        filter: filter,
        }
    )

    return c.html(html)
})

app.post('/add-todo', async(c) => {
    const body = await c.req.formData()
    const title = body.get('title')
    const description = body.get('description')

    if (!title) {
        return c.redirect('/')
    }
    await db.insert(todosTable).values({
        title,
        description: description || '',
        done: false
    })
    return c.redirect('/')
})

app.get('/remove-todo/:id', async (c) => {
    const id = Number(c.req.param('id'))
    await db.delete(todosTable).where(eq(todosTable.id, id))
    return c.redirect('/')
})

app.get('/delete-completed', async (c) => {
    await db.delete(todosTable).where(eq(todosTable.done, true))
    return c.redirect('/')
})

app.post('/edit-todo/:id', async (c) => {
    const id = Number(c.req.param('id'))
    const body = await c.req.formData()
    let title = body.get('title')
    let toggle = Boolean(body.get('toggle'))
    let description = body.get('description')
    const todo = await db.select().from(todosTable).where(eq(todosTable.id, id))
    let updatedFields = {}

    if (!todo) {
        return c.redirect('/')
    } else {
        if (title) {
            updatedFields.title = title
        }
        if (toggle) {
            updatedFields.done = !todo.done
        }
        if (description) {
            updatedFields.description = description
        }
    }

    await db.update(todosTable).set(updatedFields).where(eq(todosTable.id, id))

    return c.redirect(getReturnUrl(c))
})

app.get('/todo/:id', async (c) => {
    const id = Number(c.req.param('id'))
    const todo = await db.select().from(todosTable).where(eq(todosTable.id, id)).get()
    if (!todo) return await next()

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
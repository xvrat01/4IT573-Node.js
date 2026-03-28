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

function mapPriority(priorityValue) {
    switch (String(priorityValue)) {
        case '1':
        case 'nízká':
            return 'nízká'
        case '2':
        case 'normální':
            return 'normální'
        case '3':
        case 'vysoká':
            return 'vysoká'
        default:
            return 'normální'
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
    const doneFilter = c.req.query('done') || 'all'
    const priorityFilter = c.req.query('priority') || '0'
    const sort = c.req.query('sort') || 'default'
    const todos = await db.select().from(todosTable).all()
    let filteredTodos = todos

    if (doneFilter !== 'all') {
        switch (doneFilter) {
            case 'completed':
                filteredTodos = todos.filter((todo) => todo.done)
                break
            case 'pending':
                filteredTodos = todos.filter((todo) => !todo.done)
                break
            default:
                filteredTodos = todos
        }
    }
    

    if (priorityFilter !== '0') {
        const mappedPriority = mapPriority(priorityFilter)
        filteredTodos = filteredTodos.filter((todo) => todo.priority === mappedPriority)
    }

    if(sort !== 'default') {
        switch (sort) {
            case 'doneFirst':
                filteredTodos.sort((a, b) => b.done - a.done)
                break
            case 'pendingFirst':
                filteredTodos.sort((a, b) => a.done - b.done)
                break
            case '↓ priority':
                const priorityOrder = { 'nízká': 1, 'normální': 2, 'vysoká': 3 }
                filteredTodos.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority])
                break
            case '↑ priority':
                const priorityOrderAsc = { 'nízká': 1, 'normální': 2, 'vysoká': 3 }
                filteredTodos.sort((a, b) => priorityOrderAsc[a.priority] - priorityOrderAsc[b.priority])
                break
            default:
        }  
    }

    const html = await ejs.renderFile('views/index.html', {
        name: username,
        todos: filteredTodos,
        doneFilter: doneFilter,
        priorityFilter: priorityFilter,
        sort: sort
        }
    )

    return c.html(html)
})

app.post('/add-todo', async(c) => {
    const body = await c.req.formData()
    const title = body.get('title')
    const description = body.get('description')
    const priority = body.get('priority')
    const mappedPriority = mapPriority(priority)

    if (!title) {
        return c.redirect('/')
    }
    await db.insert(todosTable).values({
        title,
        priority: mappedPriority,
        description: description,
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
    let priority = body.get('priority')
    const mappedPriority = mapPriority(priority)
    const todo = await db.select().from(todosTable).where(eq(todosTable.id, id)).get()
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
        if (mappedPriority) {
            updatedFields.priority = mappedPriority
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
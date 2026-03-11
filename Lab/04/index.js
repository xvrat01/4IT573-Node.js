import chalk from 'chalk'
import http from 'http'
import fs from "fs/promises"

const readHTML = async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    const data = await fs.readFile("index.html")
    const html = data.toString()
    return html
}

const readFile = async (name) => {
    try {
        const data = await fs.readFile(name)
        return data
    } catch (err) {
        console.error("Error loading file " + name + ": " + err.message)
    }
}

const server = http.createServer(async (request, response) => {
    if (request.url === "/") {
        response.statusCode = 301
        response.setHeader("Location", "/html")
        response.end()
    } else if  (request.url === "/html"){
        const html = await readHTML()
        response.statusCode = 200
        response.setHeader("Content-type", "text/html")
        response.write(html)
        response.end()
    } else {
        try {
                const filename = request.url.replace("/", "")
                const path = "./public/" + filename
                console.log(path)
                const data = readFile(path)
                response.setHeader("Content-type", "text")
                response.write(data)
                response.end
            } catch (err) {
                response.setHeader = 404
                response.write("File not found")
                response.write(path)
                response.end()
            }
    }
    
})

server.listen(8080, "localhost", ()=> {
    console.log(chalk.blue('Server started on hhtp://localhost:8080'));
})


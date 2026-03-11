import http from 'http'
import fs from "fs/promises"
import path from 'path'

const server = http.createServer(async (request, response) => {
    const url = request.url
    if (url.match("^/[a-zA-Z0-9]+\.txt$")) {
        try {
            const filename = url.replace("/", "")
            const filepath = path.join("./public", filename)
            const data = await fs.readFile(filepath)
            const dataStr = data.toString()
            response.setHeader("Content-type", "text/plain")
            response.write(dataStr)
            response.end()
        } catch (err) {
            response.statusCode = 404
            response.write("File not found")
            response.end()
            }
    } else {
        response.statusCode = 404
        response.write("Page not found")
        response.end()
    }
})

server.listen(8080, "localhost", ()=> {
    console.log('Server started on http://localhost:8080');
})


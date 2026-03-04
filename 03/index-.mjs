import fs from "fs"
import util from "util"
/* 
await před asynchronní fcí
import fs from "fs/promises"
const data = await fs.readfile("copy.txt")
console.log(data.toString())
*/



const readFile = (name) => {
    return new Promise ((resolve, reject) => {
        fs.readFile(name, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}

const writeFile = util.promisify(fs.writeFile)

readFile("text.txt")
    .then((data) => {
        return data.toString()
    }).then((string) => {
        return writeFile("copy.txt", string)
    })
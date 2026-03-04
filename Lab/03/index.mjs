import fs from "fs/promises"

const main = async () => {
    const data = await fs.readFile("copy.txt")
    return data.file.toString()
}

try {
    const result = await main()

    console.log(result)
} catch (err) {
    console.log("oops", err.message)
}

/*
conts promise1 =...
const promise2 = ...

await Promise.all([promise1, promise2])
*/

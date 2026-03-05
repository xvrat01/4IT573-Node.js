import fs from "fs/promises"

let errFile

const readFile = async (name) => {
    try {
        const data = await fs.readFile(name)
        return data
    } catch (err) {
        console.error("Error loading file " + name + ": " + err.message)
    }
}

const writeFile = async (name, data) => {
    try {
        await fs.writeFile(name, data)
    } catch (err) {
        // console.error("Error writing file " + name + ": " + err.message)
        errFile = name
        throw err
    }   
}

const main = async () => {
    const promises = []
    let instruction = await readFile("instructions.txt")
    if (instruction) {
        instruction = instruction.toString().trim()
        const txtRegex = /^[1-9][0-9]*$/;
        if (!txtRegex.test(instruction)) {
            console.error("Invalid instruction format: " + instruction)
            return
        } else {
            for (let i =0; i< parseInt(instruction); i++) {
                const promise = writeFile(i + ".txt", "Soubor " + i)
                promises.push(promise)
            }
        }
        try {
            // Možná by bylo lepší Promise.allSettled, aby mi to vypsalo, kdyby byla chyba u více souborů.
            await Promise.all(promises)
            console.log("Finished writing all files")
        } catch (err) {
            console.error("Error writing files. Error on file " + errFile + ": " + err.message)
        }
        
    }
}

main()
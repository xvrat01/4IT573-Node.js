import fs from "fs/promises"

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
        await fs.access(name)
        console.log("File " + name + " already exists, writing...")
    } catch {
        console.error("File " + name + " does not exist, Creating and writing...")
    }

    try {
        await fs.writeFile(name, data)
        console.log("Finished writing file " + name)
    } catch (err) {
        console.error("Error writing file " + name + ": " + err.message)
        return
    }   
}

const main = async () => {
    let instruction = await readFile("instructions.txt")
    if (instruction) {
        instruction = instruction.toString()
        const [instruction1, instruction2] = instruction.trim().split(" ")
        const txtRegex = /^.+\.txt$/;
        if (!txtRegex.test(instruction1) || !txtRegex.test(instruction2)) {
            console.error("Invalid instruction format: " + instruction)
            return
        } else {
            const data = await readFile(instruction1)
            if (data) {
                await writeFile(instruction2, data)
            }
        }
    }
}

main()
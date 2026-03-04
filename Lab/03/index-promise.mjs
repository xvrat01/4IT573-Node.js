function asyncAdd(a, b) {
	return new Promise ((resolve, reject) => {
        setTimeout(() => {
            const result = (a + b)
            if (isNaN(result)) {
                reject("not a number")
            } else {
                resolve (result)
            }
        }, 1000)
    })
    
}

const result = asyncAdd(1, 2)

result
    .then((value) => {
        console.log(value)
    })
    .catch((reason) => {
        console.error(reason)
    })
    .finally(() => {
        console.log("finally")
    })
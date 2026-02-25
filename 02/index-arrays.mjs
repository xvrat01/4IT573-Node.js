const arr = [1, 2, 3, 4, 5, 6];

// filtrování prvků
const even = arr.filter((num) => num % 2 === 0);

console.log(even)
console.log(arr)

const doubles = arr.map((num) => num * 2);
console.log(doubles)

// redukuje na jeden prvek - součet
const reduce = arr.reduce((previous, current) => previous + current, 0);
console.log(reduce)

// redukuje na jeden prvek - nejmenší prvek
const min = arr.reduce((previous, current) => previous < current? previous : current, Infinity);
console.log(min)


const people = [
	{ firstName: 'Franta', lastName: 'Sádlo' },
	{ firstName: 'Jirka', lastName: 'Máslo' },
	{ firstName: 'Pepa', lastName: 'Vomáčka' },
]

const userName= "Jirka"

const user = people.find((person)=> {
    if (person.firstName === userName) {
        return person.lastName
    } else {
        return false
    }
})

console.log(user)


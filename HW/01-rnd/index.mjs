let number = Math.floor(Math.random() * 10) + 1
let guessed = false

for (let i = 1; i <=5; i++) {
    let guess
    while (true) {
        guess = prompt("Hádej číslo od 1 do 10")
        guess = Number(guess)
        if (!isNaN(guess) && (guess >= 1 && guess <= 10)) {
            break
        }
        console.log("Neplatný vstup, zadej číslo od 1 do 10")
    }
    
    if (guess === number) {
        console.log("Gratulace, uhodl jsi číslo " + number + " na " + i + ". pokus!")
        guessed = true
        break
    } else if (guess < number) {
        console.log("Tvoje číslo je příliš malé. Počet zbývajících pokusů: " + (5-i))
    } else {
        console.log("Tvoje číslo je příliš velké. Počet zbývajících pokusů: " + (5-i))

    }
}

if (!guessed) {
    console.log("Neuhodl jsi. Správné číslo bylo číslo: " + number)
}
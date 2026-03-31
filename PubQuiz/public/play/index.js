const socket = io(window.location.origin, {
    query: { role: 'player' }
})

socket.on('connect', () => {
    alert('Hrac pripojen')
})

socket.on("welcome", (message) => {
    console.log(message)
})

socket.on("otazka", (data) => {
    const btn = document.createElement("button")
    btn.innerText = "odpovědět"
    btn.disabled = false
    btn.onclick = () => {
        socket.emit("odpoved", "Moje odpověď")
        btn.disabled = true
        document.body.appendChild(document.createTextNode(`Odeslána odpověď: Moje odpověď`))
    }
    document.body.appendChild(btn)
})
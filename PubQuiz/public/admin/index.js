const socket = io(window.location.origin, {
    query: { role: 'admin' }
})

socket.on("connect", () => {
    alert("Admin pripojen")
})

socket.on("welcome", (message) => {
    console.log(message)
})

socket.on("odpoved", (data) => {
    alert(`Nova odpoved: ${data}`)
})

document.getElementById("otazka").onclick = () => {
    socket.emit("otazka", "text otázky")
    document.body.appendChild(document.createTextNode("Odeslána otázka"))
}
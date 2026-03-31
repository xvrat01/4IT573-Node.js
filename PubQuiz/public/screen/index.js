const socket = io(window.location.origin, {
    query: { role: 'screen' }
}
)

socket.on("connect", () => {
    alert("Admin pripojen")
})

socket.on("welcome", (message) => {
    console.log(message)
})

socket.on("otazka", (data) => {
    const div = document.getElementById("otazka")
    div.innerText = data
})
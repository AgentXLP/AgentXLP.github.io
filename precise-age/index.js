const secondsInYear = 31536000
const millisecondsToSeconds = 0.001

const dateInput = document.getElementById("date")
const age = document.getElementById("age")

let interval = false

window.calculate = () => {
    const date = new Date(dateInput.value)
    age.innerHTML = "Age: " + ((Date.now() * millisecondsToSeconds) - (date.getTime() * millisecondsToSeconds)) / secondsInYear
    
    if (!interval) {
        interval = true
        setInterval(window.calculate, 100)
    }
}
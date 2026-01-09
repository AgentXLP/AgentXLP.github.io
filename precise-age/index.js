const SECONDS_IN_YEAR = 31536000;
const TIME_MS_TO_S = 0.001;

const dateInput = document.getElementById("date");
const age = document.getElementById("age");

let interval = false;

window.calculate = () => {
    const date = new Date(dateInput.value);
    age.innerHTML = "Age: " + ((Date.now() * TIME_MS_TO_S) - (date.getTime() * TIME_MS_TO_S)) / SECONDS_IN_YEAR;
    
    if (!interval) {
        interval = true;
        setInterval(window.calculate, 100);
    }
}
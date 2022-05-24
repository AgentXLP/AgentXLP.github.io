console.log("hi")
alert("Nintendo copyright generator\nGenerate text in the '(C) 1996 Nintendo' style")
const year = prompt("What year?")
const company = prompt("What company name?")

document.getElementById("year").innerHTML = `©${year} `
document.getElementById("company").innerHTML = company
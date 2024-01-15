const quoteApiUrl = "https://api.quotable.io/random?minLength=80&maxLength=100";

const quoteSection = document.getElementById("quote");
const userInput = document.getElementById("quote-input");

let quote = "";
let time = 60;
let timer= "";
let mistakes = 0;

const renderNewQuote = async () => {
       const response = await fetch(quoteApiUrl);   
    let data = await response.json();    
    quote = data.content;
    let arr= quote.split("").map(value => {       
        return "<span class='quote-chars'>" + value + "</span>";
    })

    quoteSection.innerHTML += arr.join("");
};

//Logic for comparing input words with quote
userInput.addEventListener("input", () => {
    let quoteChars = document.querySelectorAll(".quote-chars");
    //Create an array from received span stags
    quoteChars = Array.from(quoteChars);
   
    let userInputChars = userInput.value.split("");

    //loop through each character in quote
    quoteChars.forEach((char,index)=> {        
        if(char.innerText == userInputChars[index]){
            char.classList.add("success");
        }      
        else if(userInputChars[index] == null){           
            if(char.classList.contains("success")){
                char.classList.remove("success");
            }
            else{
                char.classList.remove("fail");
            }
        }
        // If User enter wrong charater
        else{
            if(!char.classList.contains("fail")){
                mistakes += 1;
                char.classList.add("fail");
            }
            document.getElementById("mistakes").innerText = mistakes;
        }
        //Returns true if all chars are entered correctly
        let check = quoteChars.every(element=>{
            return element.classList.contains("success")
        });
        //End test if all chars are correct
        if(check){
            displayResult();
        }
        
    })
});

function updateTimer(){
    if(time === 0){ 
        displayResult()
    }
    else{
        document.getElementById("timer").innerText = --time + "s";
    }
}

//Sets timer
const timeReduce= () => {
    time = 60;
    timer = setInterval(updateTimer, 1000);
}


const displayResult = () => {   
    document.querySelector(".result").style.display = "block";
    clearInterval(timer);
    document.getElementById("stop-test").style.display = "none";
    userInput.disabled = true;
    let timeTaken = 1;
    if(time != 0){
        timeTaken = (60-time)/60;
    }
    document.getElementById("speed").innerText = (userInput.value.length / 5 / timeTaken).toFixed(2)+ "wpm";
    document.getElementById("accuracy").innerText = Math.round((userInput.value.length - mistakes) / userInput.value.length*100) + "%";
}


const startTest = () => {
    mistakes = 0;
    time = "";
    userInput.disabled = false;
    userInput.focus();
    timeReduce();
    document.getElementById("start-test").style.display = "none";
    document.getElementById("stop-test").style.display = "block";
}


window.onload= () => {
    userInput.value = "";
    document.getElementById("start-test").style.display = "block";
    document.getElementById("stop-test").style.display = "none";
    userInput.disabled = true;
    renderNewQuote();
}

const reset = () => {
    quote = "";
    time = 60;
    mistakes = 0;

    // Clear the quote section
    quoteSection.innerHTML = "";

    // Reset userInput
    userInput.value = "";
    userInput.disabled = true;

    // Reset display elements
    document.getElementById("start-test").style.display = "block";
    document.getElementById("stop-test").style.display = "none";
    document.querySelector(".result").style.display = "none";

    // Reset mistake count display
    document.getElementById("mistakes").innerText = "0";

    // Reset timer display
    document.getElementById("timer").innerText = time + "s";
    renderNewQuote();
};

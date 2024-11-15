const listOfAllDice = document.querySelectorAll(".die");
const scoreInputs = document.querySelectorAll("#score-options input");
const scoreSpans = document.querySelectorAll("#score-options span");
const roundElement = document.getElementById("current-round");
const rollsElement = document.getElementById("current-round-rolls");
const totalScoreElement = document.getElementById("total-score");
const scoreHistory = document.getElementById("score-history");
const rollDiceBtn = document.getElementById("roll-dice-btn");
const keepScoreBtn = document.getElementById("keep-score-btn");
const rulesContainer = document.querySelector(".rules-container");
const rulesBtn = document.getElementById("rules-btn");

let diceValuesArr = [];
let isModalShowing = false;
let score = 0;
let round = 1;
let rolls = 0;

rollDiceBtn.addEventListener("click", () => {
    // Generate five random numbers between 1 and 6
    diceValuesArr = Array.from({ length: 5 }, () => Math.floor(Math.random() * 6) + 1);

    // Update the dice elements to display the generated numbers
    listOfAllDice.forEach((dieElement, index) => {
        dieElement.textContent = diceValuesArr[index]; // Display the corresponding number
    });
});

const updateStats = () => {
    rollsElement.textContent = rolls;
    roundElement.textContent = round;
};

rollDiceBtn.addEventListener("click", () => {
    if (rolls === 3) {
        alert("You have made three rolls this round. Please select a score.");
    } else {
        rolls++;
        rollDice();
        updateStats()
    }
});

rulesBtn.addEventListener("click", () => {
    isModalShowing = !isModalShowing;
    rulesContainer.style.display = isModalShowing ? "block" : "none";
    rulesBtn.textContent = isModalShowing ? "Hide rules" : "Show rules";
})
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

const updateRadioOption = (index, score) => {
    // Enable the score input at the specified index
    scoreInputs[index].disabled = false;

    // Set the value of the input to the given score
    scoreInputs[index].value = score;

    // Display the score in the corresponding score span element
    scoreSpans[index].textContent = `, score = ${score}`;
};

const updateScore = (selectedValue, achieved) => {
    score += parseInt(selectedValue);
    totalScoreElement.textContent = score;

    scoreHistory.innerHTML += `<li>${achieved} : ${selectedValue}</li>`;
};

const getHighestDuplicates = (arr) => {
    const counts = {};

    for (const num of arr) {
        if (counts[num]) {
            counts[num]++;
        } else {
            counts[num] = 1;
        }
    }

    let highestCount = 0;

    for (const num of arr) {
        const count = counts[num];
        if (count >= 3 && count > highestCount) {
            highestCount = count;
        }
        if (count >= 4 && count > highestCount) {
            highestCount = count;
        }
    }

    const sumOfAllDice = arr.reduce((a, b) => a + b, 0);

    if (highestCount >= 4) {
        updateRadioOption(1, sumOfAllDice);
    }

    if (highestCount >= 3) {
        updateRadioOption(0, sumOfAllDice);
    }

    updateRadioOption(5, 0);
};

const detectFullHouse = (arr) => {
    const counts = {};

    for (const num of arr) {
        counts[num] = counts[num] ? counts[num] + 1 : 1;
    }

    const hasThreeOfAKind = Object.values(counts).includes(3);
    const hasPair = Object.values(counts).includes(2);

    if (hasThreeOfAKind && hasPair) {
        updateRadioOption(2, 25);
    }

    updateRadioOption(5, 0);
};

const resetRadioOptions = () => {
    scoreInputs.forEach((input) => {
        input.disabled = true;
        input.checked = false;
    });

    scoreSpans.forEach((span) => {
        span.textContent = "";
    });
};

const resetGame = () => {
    diceValuesArr = [0, 0, 0, 0, 0];
    score = 0;
    round = 1;
    rolls = 0;

    listOfAllDice.forEach((dice, index) => {
        dice.textContent = diceValuesArr[index];
    });

    totalScoreElement.textContent = score;
    scoreHistory.innerHTML = "";

    rollsElement.textContent = rolls;
    roundElement.textContent = round;

    resetRadioOptions();
};

const checkForStraights = (diceValuesArr) => {
    const uniqueSorted = [...new Set(diceValuesArr)].sort((a, b) => a - b);

    const hasConsecutive = (arr, length) => {
        for (let i = 0; i <= arr.length - length; i++) {
            if (arr.slice(i, i + length).every((val, idx, subArr) => idx === 0 || val === subArr[idx - 1] + 1)) {
                return true;
            }
        }
        return false;
    };

    if (uniqueSorted.length >= 5 && hasConsecutive(uniqueSorted, 5)) {
        // Large Straight
        updateRadioOption(4, 40); // Assuming index 4 corresponds to Large Straight
        // Also enable Small Straight (30 points)
        updateRadioOption(3, 30); // Assuming index 3 corresponds to Small Straight
    }
    // Check for small straight (4 consecutive numbers)
    else if (uniqueSorted.length >= 4 && hasConsecutive(uniqueSorted, 4)) {
        updateRadioOption(3, 30); // Small Straight
    }
    else {
        updateRadioOption(scoreInputs.length - 1, 0);
    }
};




rollDiceBtn.addEventListener("click", () => {
    if (rolls === 3) {
        alert("You have made three rolls this round. Please select a score.");
    } else {
        rolls++;
        resetRadioOptions();
        rollDice();
        updateStats()
        getHighestDuplicates(diceValuesArr);
        detectFullHouse(diceValuesArr);
        checkForStraights(diceValuesArr);
    }
});

rulesBtn.addEventListener("click", () => {
    isModalShowing = !isModalShowing;
    rulesContainer.style.display = isModalShowing ? "block" : "none";
    rulesBtn.textContent = isModalShowing ? "Hide rules" : "Show rules";
});

keepScoreBtn.addEventListener("click", () => {
    let selectedValue;
    let achieved;

    for (const radioButton of scoreInputs) {
        if (radioButton.checked) {
            selectedValue = radioButton.value;
            achieved = radioButton.id;
            break;
        }
    }

    if (selectedValue) {
        rolls = 0;
        round++;
        updateStats();
        resetRadioOptions();
        updateScore(selectedValue, achieved);
        if (round > 6) {
            setTimeout(() => {
                alert(`Game Over! Your total score is ${score}`);
                resetGame();
            }, 500);

        }
    } else {
        alert("Please select an option or roll the dice");
    }
});
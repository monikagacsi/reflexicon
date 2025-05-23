const wordInput = document.getElementById('wordInput');
const checkPalindromeButton = document.getElementById('checkPalindrome');
const originalWordDisplay = document.getElementById('original-word-display');
const mirroredWordDisplay = document.getElementById('mirrored-word-display');
const resultsText = document.getElementById('results-text');

function cleanString(str) {
    return str.toLowerCase().replace(/[^\p{L}]/gu, '');
}


function isPalindrome(inputString) {
    const cleaned = cleanString(inputString);
    if (cleaned.length === 0) {
        return false;
    }
    const reversed = cleaned.split('').reverse().join('');
    return cleaned === reversed;
}

async function isSemordnilap(originalInput) {
    const cleanedOriginal = cleanString(originalInput);
    if (cleanedOriginal.length === 0) {
        return false;
    }

    const reversedCleaned = cleanedOriginal.split('').reverse().join('');
    if (reversedCleaned === cleanedOriginal) {
        return false;
    }

    const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${reversedCleaned}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json(); 
        if (Array.isArray(data) && data.length > 0) {
            return true;
        } else if (data.title === "No Definitions Found") {
            return false;
        } else {
            console.error("Unexpected API response for dictionary check:", data);
            return false;
        }
    } catch (error) {
        console.error("Error fetching dictionary data for semordnilap check:", error);
        return false;
    }
}

checkPalindromeButton.addEventListener('click', async () => { 
    const userInput = wordInput.value.trim();


    originalWordDisplay.textContent = "";
    mirroredWordDisplay.textContent = "";
    resultsText.textContent = "";
    resultsText.style.color = "#e0e0e0";

    if (userInput === "") {
        resultsText.textContent = "Please type something to check!";
        resultsText.style.color = "#ffcc00";
        return;
    }


    const cleanedForMeaningCheck = cleanString(userInput);
    if (cleanedForMeaningCheck.length === 0) {
        resultsText.textContent = `"${userInput}" contains no recognizable letters. Please enter words!`;
        resultsText.style.color = "#f44336";
        return;
    }

    originalWordDisplay.textContent = userInput;
    const cleanedVersion = cleanString(userInput);
    const mirroredVersion = cleanedVersion.split('').reverse().join('');
    mirroredWordDisplay.textContent = mirroredVersion; 


    if (isPalindrome(userInput)) {
        resultsText.textContent = `"${userInput}" is a palindrome :)`;
        resultsText.style.color = "#8bc34a";
    } else {
        resultsText.textContent = "Checking dictionary for semordnilap...";
        resultsText.style.color = "#4dd0e1"; 
        const isUserSemordnilap = await isSemordnilap(userInput);
        if (isUserSemordnilap) {
            resultsText.textContent = `"${userInput}" is a semordnilap ;) (It mirrors to "${mirroredVersion}")`;
            resultsText.style.color = "#4dd0e1";
        } else {
            resultsText.textContent = `"${userInput}" is neither a palindrome nor a semordnilap :(`;
            resultsText.style.color = "#f44336"; 
        }
    }
});

wordInput.addEventListener('input', () => {
    resultsText.textContent = "";
    originalWordDisplay.textContent = "";
    mirroredWordDisplay.textContent = "";
    resultsText.style.color = "#e0e0e0"; 
});
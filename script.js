import questions from "./questions.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyCwG1Cmjs1QN_B-WS44T0A6DDicPvjme-A",
    authDomain: "quiz-6242a.firebaseapp.com",
    projectId: "quiz-6242a",
    storageBucket: "quiz-6242a.appspot.com",
    messagingSenderId: "814424129055",
    appId: "1:814424129055:web:12528d6acfc5967cff5f2a",
    measurementId: "G-92031KPK18"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Team Name Management
let teamName = "";

// DOM Elements
const teamModal = document.getElementById('team-modal');
const saveTeamNameBtn = document.getElementById('save-team-name');
const teamNameInput = document.getElementById('team-name-input');
const teamNameDisplay = document.getElementById('team-name-display');
const editTeamNameBtn = document.getElementById('edit-team-name');

// Show modal on page load
window.onload = () => {
    teamModal.style.display = 'block';
};

// Save team name
saveTeamNameBtn.addEventListener('click', () => {
    const inputName = teamNameInput.value.trim();
    if (inputName === "") {
        alert("Team name cannot be empty!");
        return;
    }
    teamName = inputName;
    teamNameDisplay.textContent = teamName;
    teamModal.style.display = 'none';
});

// Edit team name
editTeamNameBtn.addEventListener('click', () => {
    teamNameInput.value = teamName;
    teamModal.style.display = 'block';
});

// Handle modal click outside content to close
window.onclick = function(event) {
    if (event.target == teamModal) {
        // Optionally, prevent closing without entering a team name
        // teamModal.style.display = "none";
    }
};

// Handle category selection and load questions
let selectedCategory = "FOOD AND CUISINES";  // Default category

document.getElementById("start-quiz").addEventListener("click", function() {
    selectedCategory = document.getElementById("category").value; // Get the selected category
    loadQuiz();
    startTimer(); // Start the timer after the quiz is loaded
});

function loadQuiz() {
    const quizContainer = document.getElementById("quiz-container");
    quizContainer.style.display = "block"; // Show quiz section
    document.getElementById("timer").style.display = "block"; // Show timer

    // Load questions based on selected category
    const categoryQuestions = questions[selectedCategory];
    quizContainer.innerHTML = ""; // Clear previous content

    let questionsHTML = categoryQuestions.map((q, index) => `
        <div class="question-container" id="question${index + 1}">
            <h3>${q.question}</h3>
            <input type="text" name="q${index + 1}" id="q${index + 1}" placeholder="Type your answer here"><br>
        </div>
    `).join(''); // Join the array into a single string

    quizContainer.innerHTML += questionsHTML; // Add all questions at once

    // Add submit button
    quizContainer.innerHTML += `<button type="button" onclick="submitQuiz()">Submit Quiz</button>`;
}

// Timer function
let timeLeft = 25 * 60; // 25 minutes in seconds
let timerElement = document.getElementById('timer');
let timerInterval;

function startTimer() {
    timeLeft = 25 * 60; // Reset timer
    clearInterval(timerInterval); // Clear previous timer
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;

    if (seconds < 10) seconds = "0" + seconds;
    
    timerElement.textContent = `${minutes}:${seconds}`;
    timeLeft--;

    if (timeLeft < 0) {
        clearInterval(timerInterval);
        alert("Time's up!");
        submitQuiz();
    }
}

// Quiz submission
function submitQuiz() {
    clearInterval(timerInterval); // Stop the timer when the quiz is submitted or time is up

    let score = 0;
    const categoryQuestions = questions[selectedCategory];

    categoryQuestions.forEach((q, index) => {
        let userAnswer = document.getElementById(`q${index+1}`).value.trim();
        
        // Compare user's answer (case insensitive)
        if (userAnswer.toLowerCase() === q.answer.toLowerCase()) {
            score++;
        }
    });

    let resultElement = document.getElementById('result');
    resultElement.textContent = `You scored ${score} out of ${categoryQuestions.length}.`;

    // Save score to Firestore
    if (teamName === "") {
        alert("Team name is missing!");
        return;
    }

    db.collection("scores").add({
        teamName: teamName,
        score: score,
        category: selectedCategory,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        console.log("Score successfully written!");
    })
    .catch((error) => {
        console.error("Error writing score: ", error);
    });
}

window.submitQuiz = submitQuiz;

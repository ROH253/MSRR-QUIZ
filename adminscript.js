import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCwG1Cmjs1QN_B-WS44T0A6DDicPvjme-A",
    authDomain: "quiz-6242a.firebaseapp.com",
    projectId: "quiz-6242a",
    storageBucket: "quiz-6242a.appspot.com",
    messagingSenderId: "814424129055",
    appId: "1:814424129055:web:12528d6acfc5967cff5f2a",
    measurementId: "G-92031KPK18"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let scoresArray = []; 
const correctPassword = "rohini"; 

async function fetchScores() {
    const scoresRef = collection(db, "scores");
    const querySnapshot = await getDocs(scoresRef);
    const scoresBody = document.getElementById('scores-body');

    scoresBody.innerHTML = "";

    scoresArray = []; 

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const id = doc.id; 

        scoresArray.push({
            id: id,
            teamName: data.teamName,
            score: data.score,
            category: data.category,
            timestamp: data.timestamp ? new Date(data.timestamp.seconds * 1000) : 'N/A'
        });

        const row = `
            <tr>
                <td>${data.teamName}</td>
                <td>${data.score}</td>
                <td>${data.category}</td>
                <td>${data.timestamp ? new Date(data.timestamp.seconds * 1000).toLocaleString() : 'N/A'}</td>
                <td><span class="delete-btn" onclick="confirmDelete('${id}')">Delete</span></td> <!-- Delete button -->
            </tr>
        `;
        scoresBody.innerHTML += row;
    });
}

window.confirmDelete = async function(id) {
    const password = prompt("Enter the password to confirm deletion:");

    if (password === correctPassword) {
        await deleteDoc(doc(db, "scores", id)); 
        alert("Score deleted successfully.");
        fetchScores(); 
    } else {
        alert("Incorrect password. Please try again.");
    }
}

window.sortTable = function(column) {
    const scoresBody = document.getElementById('scores-body');
    const ascending = scoresBody.getAttribute('data-sort') === 'asc';
    

    scoresArray.sort((a, b) => {
        if (column === 'score') {
            return ascending ? a.score - b.score : b.score - a.score;
        } else if (column === 'timestamp') {
            return ascending ? a.timestamp - b.timestamp : b.timestamp - a.timestamp;
        } else {
            return ascending ? a[column].localeCompare(b[column]) : b[column].localeCompare(a[column]);
        }
    });

    populateTable();
    scoresBody.setAttribute('data-sort', ascending ? 'desc' : 'asc');
}

function capitalizeWords(str) {
    return str.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}
 
function populateTable() {
    const scoresBody = document.getElementById('scores-body');
    scoresBody.innerHTML = "";

    scoresArray.forEach(score => {
        const row = `
            <tr>    
                <td>${capitalizeWords(score.teamName)}</td> 
                <td>${score.score}</td>
                <td>${score.category}</td>
                <td>${score.timestamp ? score.timestamp.toLocaleString() : 'N/A'}</td>
                <td><span class="delete-btn" onclick="confirmDelete('${score.id}')">Delete</span></td> <!-- Delete button -->
            </tr>
        `;
        scoresBody.innerHTML += row;
    });
}

window.onload = fetchScores;

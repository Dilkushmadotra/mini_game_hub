// --- Sample Questions ---
const questions = [
    // Easy
    { question: "What is the capital of India?", options: ["Mumbai", "Delhi", "Kolkata", "Chennai"], answer: "Delhi", difficulty: "easy" },
    { question: "Which currency is used in India?", options: ["Dollar", "Euro", "Yen", "Rupee"], answer: "Rupee", difficulty: "easy" },
    { question: "Which river is considered holy in India?", options: ["Yamuna", "Ganga", "Krishna", "Cauvery"], answer: "Ganga", difficulty: "easy" },
    { question: "What is the national animal of India?", options: ["Elephant", "Tiger", "Lion", "Peacock"], answer: "Tiger", difficulty: "easy" },
    { question: "Which festival is known as the festival of lights?", options: ["Holi", "Navratri", "Diwali", "Eid"], answer: "Diwali", difficulty: "easy" },
  
    // Medium
    { question: "Who was the first Prime Minister of India?", options: ["Gandhi", "Nehru", "Rajaji", "Patel"], answer: "Nehru", difficulty: "medium" },
    { question: "In which year did India gain independence?", options: ["1945", "1946", "1947", "1950"], answer: "1947", difficulty: "medium" },
    { question: "Which Indian city is called the 'Pink City'?", options: ["Udaipur", "Jaipur", "Jodhpur", "Agra"], answer: "Jaipur", difficulty: "medium" },
    { question: "What is the national sport of India?", options: ["Cricket", "Hockey", "Kabaddi", "Badminton"], answer: "Hockey", difficulty: "medium" },
    { question: "Which state is famous for its backwaters?", options: ["Tamil Nadu", "Kerala", "Goa", "Maharashtra"], answer: "Kerala", difficulty: "medium" },
  
    // Hard
    { question: "Who wrote the Indian national anthem?", options: ["Gandhi", "Tagore", "Tilak", "Vivekananda"], answer: "Tagore", difficulty: "hard" },
    { question: "Where is Bhabha Atomic Research Centre located?", options: ["Chennai", "Hyderabad", "Mumbai", "Delhi"], answer: "Mumbai", difficulty: "hard" },
    { question: "What is the name of the first Indian satellite?", options: ["Aryabhata", "Chandrayaan", "INSAT", "Mangalyaan"], answer: "Aryabhata", difficulty: "hard" },
    { question: "Which Indian mathematician invented zero?", options: ["Aryabhata", "Ramanujan", "Bhaskaracharya", "Panini"], answer: "Aryabhata", difficulty: "hard" },
    { question: "In which year was the Indian Constitution adopted?", options: ["1947", "1949", "1950", "1952"], answer: "1949", difficulty: "hard" }
  ];
  
  const roundSize = 8;
  let currentIndex = 0;
  let score = 0;
  let highScore = parseInt(localStorage.getItem("highScore")) || 0;
  let currentQuestions = [];
  let savedState = JSON.parse(localStorage.getItem("quizState")) || null;
  
  const questionContainer = document.getElementById("question-container");
  const scoreDisplay = document.getElementById("score");
  const highScoreDisplay = document.getElementById("high-score");
  const nextBtn = document.getElementById("next-btn");
  const saveBtn = document.getElementById("save-btn");
  const restartBtn = document.getElementById("restart-btn");
  const progress = document.getElementById("progress");
  
  function getQuestionsByRound(index) {
    const round = Math.floor(index / roundSize);
    let difficulty = "easy";
    if (round >= 2) difficulty = "hard";
    else if (round === 1) difficulty = "medium";
    return questions.filter(q => q.difficulty === difficulty).slice(index % roundSize, (index % roundSize) + roundSize);
  }
  
  function showQuestions() {
    questionContainer.innerHTML = "";
    currentQuestions = getQuestionsByRound(currentIndex);
    currentQuestions.forEach((q, i) => {
      const div = document.createElement("div");
      div.classList.add("question");
      div.innerHTML = `
        <p><strong>Q${currentIndex + i + 1}:</strong> ${q.question}</p>
        ${q.options.map(opt => `
          <label>
            <input type="radio" name="q${i}" value="${opt}">
            ${opt}
          </label>
        `).join("")}
      `;
      questionContainer.appendChild(div);
    });
  
    // Update progress bar
    progress.style.width = `${(currentIndex / questions.length) * 100}%`;
  }
  
  function calculateScoreAndShowAnswers() {
    currentQuestions.forEach((q, i) => {
      const options = document.getElementsByName(`q${i}`);
      options.forEach(opt => {
        opt.disabled = true;
        const label = opt.parentElement;
        if (opt.value === q.answer) {
          label.style.color = "green";
          label.style.fontWeight = "bold";
        }
        if (opt.checked && opt.value !== q.answer) {
          label.style.color = "red";
        }
      });
  
      const selected = Array.from(options).find(opt => opt.checked);
      if (selected && selected.value === q.answer) {
        if (q.difficulty === "easy") score += 10;
        if (q.difficulty === "medium") score += 20;
        if (q.difficulty === "hard") score += 30;
      }
    });
  }
  
  function updateScoreDisplay() {
    scoreDisplay.textContent = score;
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
    }
    highScoreDisplay.textContent = highScore;
  }
  
  nextBtn.addEventListener("click", () => {
    calculateScoreAndShowAnswers();
    updateScoreDisplay();
  
    setTimeout(() => {
      currentIndex += roundSize;
      if (currentIndex >= questions.length) {
        alert("Quiz completed!");
        return;
      }
      showQuestions();
    }, 1500);
  });
  
  restartBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to restart the quiz?")) {
      currentIndex = 0;
      score = 0;
      localStorage.removeItem("quizState");
      showQuestions();
      updateScoreDisplay();
    }
  });
  
  saveBtn.addEventListener("click", () => {
    const state = {
      currentIndex,
      score
    };
    localStorage.setItem("quizState", JSON.stringify(state));
    alert("Quiz progress saved!");
  });
  
  function initQuiz() {
    if (savedState) {
      currentIndex = savedState.currentIndex;
      score = savedState.score;
    }
    updateScoreDisplay();
    showQuestions();
  }
  
  initQuiz();
  
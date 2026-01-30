import { supabase } from "./supabase.js";

const params = new URLSearchParams(window.location.search);
const interviewType = params.get("type");

const questionTextEl = document.getElementById("question-text");
const answerInput = document.getElementById("answer-input");
const submitBtn = document.getElementById("submit-answer");
const timerEl = document.getElementById("timer");

const feedbackBox = document.getElementById("feedback-box");
const feedbackText = document.getElementById("feedback-text");
const nextBtn = document.getElementById("next-question-btn");
const copyBtn = document.getElementById("copy-feedback-btn");

let currentQuestion = "";
let currentQuestionId = null;
let timerInterval;

// Load question
async function loadQuestion() {
  if (!interviewType) {
    window.location.href = "dashboard.html";
    return;
  }

  questionTextEl.textContent = "Loading question...";
  clearInterval(timerInterval);
  if (timerEl) timerEl.textContent = "00:00";

  try {
    const { data, error } = await supabase
      .from("questions")
      .select("*") // Fetch all questions to pick a random one
      .eq("type", interviewType);

    if (error) throw error;
    if (!data || data.length === 0) {
      questionTextEl.textContent = "No questions found. Did you run the SQL script in Supabase?";
      return;
    }

    // Pick a random question from the list
    const randomQuestion = data[Math.floor(Math.random() * data.length)];
    currentQuestion = randomQuestion.question;
    currentQuestionId = randomQuestion.id;
    questionTextEl.textContent = currentQuestion;
    startTimer();
  } catch (error) {
    console.error("Error loading question:", error);
    questionTextEl.textContent = "Failed to load question. Please try again.";
  }
}

function startTimer() {
  let seconds = 0;
  if (timerEl) {
    timerInterval = setInterval(() => {
      seconds++;
      const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
      const secs = (seconds % 60).toString().padStart(2, "0");
      timerEl.textContent = `${mins}:${secs}`;
    }, 1000);
  }
}

// Call AI
async function getAIFeedback(question, answer) {
  const apiKey = localStorage.getItem("groq_api_key");
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are an interview evaluator. You must start your response with 'Score: X/10', where X is the score. Then provide strengths and improvements.",
        },
        {
          role: "user",
          content: `Question: ${question}\nAnswer: ${answer}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const errorMessage = errorData?.error?.message || response.statusText;
    throw new Error(`AI API Error (${response.status}): ${errorMessage}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// Submit answer
submitBtn.addEventListener("click", async () => {
  const answer = answerInput.value.trim();
  if (!answer) return alert("Write an answer first");

  const apiKey = localStorage.getItem("groq_api_key");
  if (!apiKey) {
    if (confirm("Missing API Key! You need to save your Groq API Key in Settings first. Go there now?")) {
      window.location.href = "settings.html";
    }
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Evaluating...";
  clearInterval(timerInterval);

  try {
    const feedback = await getAIFeedback(currentQuestion, answer);

    // Render Markdown (Bold, Lists, etc.)
    feedbackText.innerHTML = marked.parse(feedback);
    feedbackBox.classList.remove("hidden");

    const { data } = await supabase.auth.getUser();
    const user = data?.user;

    if (user) {
      const { error } = await supabase.from("user_progress").insert([
        {
          user_id: user.id,
          question_id: currentQuestionId,
          answer: answer,
          feedback: feedback,
        },
      ]);
      if (error) {
        console.error("Error saving progress:", error);
        alert("Failed to save progress: " + error.message);
      }
    } else {
      console.warn("User not logged in; progress not saved.");
    }
  } catch (error) {
    console.error(error);
    alert(`Error: ${error.message}`);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit Answer";
  }
});

// Handle Next Question
nextBtn.addEventListener("click", () => {
  feedbackBox.classList.add("hidden"); // Hide feedback
  answerInput.value = ""; // Clear previous answer
  loadQuestion(); // Load new question
});

// Handle Copy Feedback
if (copyBtn) {
  copyBtn.addEventListener("click", () => {
    const textToCopy = feedbackText.innerText;
    navigator.clipboard.writeText(textToCopy).then(() => {
      const originalText = copyBtn.innerHTML;
      copyBtn.innerHTML = `<span class="text-green-400">Copied!</span>`;
      setTimeout(() => {
        copyBtn.innerHTML = originalText;
      }, 2000);
    });
  });
}

loadQuestion();

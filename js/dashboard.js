import { supabase } from "./supabase.js";

import { supabase } from "./supabase.js";

const cardsContainer = document.getElementById("cards");

const topics = [
  {
    id: "technical",
    title: "Technical Interview",
    desc: "Practice coding questions on algorithms, data structures, and language specifics.",
    icon: "💻",
  },
  {
    id: "behavioral",
    title: "Behavioral Interview",
    desc: "Prepare for HR rounds with questions about your experience and soft skills.",
    icon: "🤝",
  },
  {
    id: "system",
    title: "System Design",
    desc: "Learn to architect scalable systems and discuss high-level design trade-offs.",
    icon: "🏗️",
  },
];

if (cardsContainer) {
  cardsContainer.innerHTML = topics.map(topic => `
    <div onclick="window.location.href='chat.html?type=${topic.id}'" class="bg-gray-900 border border-gray-800 p-6 rounded-xl cursor-pointer hover:bg-gray-800 transition shadow-lg group">
      <div class="text-4xl mb-4 group-hover:scale-110 transition transform duration-200">${topic.icon}</div>
      <h3 class="text-xl font-bold mb-2 text-white">${topic.title}</h3>
      <p class="text-gray-400 text-sm">${topic.desc}</p>
    </div>
  `).join("");
}

// ---------------- STATS LOGIC ----------------
async function loadStats() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // Fetch user progress
  const { data: progress, error } = await supabase
    .from("user_progress")
    .select("feedback, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error || !progress) return;

  // 1. Questions Attempted
  const count = progress.length;
  const countEl = document.getElementById("stats-count");
  if (countEl) countEl.textContent = count;

  if (count > 0) {
    // 2. Last Practice Date
    const lastDate = new Date(progress[progress.length - 1].created_at).toLocaleDateString();
    const lastEl = document.getElementById("stats-last");
    if (lastEl) lastEl.textContent = lastDate;

    // 3. Average Score
    let totalScore = 0;
    let scoredCount = 0;

    progress.forEach((p) => {
      const match = p.feedback && p.feedback.match(/Score\D*(\d+)/i);
      if (match && match[1]) {
        totalScore += parseInt(match[1]);
        scoredCount++;
      }
    });

    if (scoredCount > 0) {
      const avg = (totalScore / scoredCount).toFixed(1);
      const scoreEl = document.getElementById("stats-score");
      if (scoreEl) scoreEl.textContent = avg + "/10";
    }
  }
}

loadStats();

// ---------------- STATS LOGIC ----------------
async function loadStats() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // Fetch user progress
  const { data: progress, error } = await supabase
    .from("user_progress")
    .select("feedback, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true }); // Sort by date to get the latest last

  if (error || !progress) return;

  // 1. Questions Attempted
  const count = progress.length;
  const countEl = document.getElementById("stats-count");
  if (countEl) countEl.textContent = count;

  if (count > 0) {
    // 2. Last Practice Date
    const lastDate = new Date(progress[progress.length - 1].created_at).toLocaleDateString();
    const lastEl = document.getElementById("stats-last");
    if (lastEl) lastEl.textContent = lastDate;

    // 3. Average Score
    let totalScore = 0;
    let scoredCount = 0;

    progress.forEach((p) => {
      // Regex looks for "Score", ignores non-digits (like **: ), and captures the number
      const match = p.feedback && p.feedback.match(/Score\D*(\d+)/i);
      if (match && match[1]) {
        totalScore += parseInt(match[1]);
        scoredCount++;
      }
    });

    if (scoredCount > 0) {
      const avg = (totalScore / scoredCount).toFixed(1);
      const scoreEl = document.getElementById("stats-score");
      if (scoreEl) scoreEl.textContent = avg + "/10";
    }
  }
}

loadStats();
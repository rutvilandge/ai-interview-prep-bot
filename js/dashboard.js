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
    .select(`
      created_at,
      feedback,
      answer,
      questions ( question, type )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false }); // Newest first

  if (error || !progress) return;

  // 1. Questions Attempted
  const count = progress.length;
  const countEl = document.getElementById("stats-count");
  if (countEl) countEl.textContent = count;

  if (count > 0) {
    // 2. Last Practice Date
    const lastDate = new Date(progress[0].created_at).toLocaleDateString();
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

  // 5. Render Chart
  const ctx = document.getElementById('progressChart');
  if (ctx && progress.length > 0) {
    // Get last 10 attempts, reverse to show oldest -> newest
    const recentProgress = [...progress].slice(0, 10).reverse();
    
    const labels = recentProgress.map(p => 
      new Date(p.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    );
    
    const scores = recentProgress.map(p => {
      const match = p.feedback && p.feedback.match(/Score\D*(\d+)/i);
      return match ? parseInt(match[1]) : 0;
    });

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Score',
          data: scores,
          borderColor: '#818cf8', // Indigo-400
          backgroundColor: 'rgba(129, 140, 248, 0.1)',
          borderWidth: 2,
          tension: 0.4, // Smooth curves
          pointBackgroundColor: '#fff',
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 10,
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
            ticks: { color: '#9ca3af' }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#9ca3af' }
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  }

  // 4. Render History List
  const historyList = document.getElementById("history-list");
  if (historyList) {
    if (count === 0) {
      historyList.innerHTML = `<p class="text-gray-500">No interviews completed yet.</p>`;
    } else {
      historyList.innerHTML = progress.map(item => {
        const questionText = item.questions?.question || "Unknown Question";
        const type = item.questions?.type || "General";
        const date = new Date(item.created_at).toLocaleDateString();
        
        // Extract score for color coding
        const scoreMatch = item.feedback && item.feedback.match(/Score\D*(\d+)/i);
        const score = scoreMatch ? parseInt(scoreMatch[1]) : 0;
        const scoreColor = score >= 7 ? "text-green-400" : (score >= 4 ? "text-yellow-400" : "text-red-400");

        return `
          <div class="bg-white/5 border border-white/10 p-5 rounded-xl hover:bg-white/10 transition">
            <div class="flex justify-between items-start gap-4">
              <div>
                <span class="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1 block">${type}</span>
                <h4 class="text-white font-medium mb-2">${questionText}</h4>
                <p class="text-gray-400 text-sm line-clamp-2 italic">"${item.answer}"</p>
              </div>
              <div class="text-right shrink-0">
                <div class="text-2xl font-bold ${scoreColor}">${score}/10</div>
                <div class="text-xs text-gray-500 mt-1">${date}</div>
              </div>
            </div>
          </div>
        `;
      }).join("");
    }
  }
}

loadStats();
# Interview Prep AI 🤖

An AI-powered interview preparation platform that helps users practice Technical, Behavioral, and System Design interviews.
live demo:# AI Interview Prep Bot 🤖

## ✨ Features

- Practice multiple interview types: Technical, Behavioral, System Design
- Real-time AI feedback using Groq (LLaMA)
- Secure authentication with Supabase
- Clean and responsive UI
- User answer evaluation and improvement suggestions

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | HTML, CSS, JavaScript |
| Backend / AI | Groq API |
| Auth & Database | Supabase |
| Deployment | Vercel |

---

## ⚙️ How It Works

1. User signs up or logs in using Supabase.
2. Selects an interview category (Technical / Behavioral / System Design).
3. Answers interview questions through the UI.
4. The answer is sent to the backend/AI for evaluation.
5. The AI provides feedback and suggestions, shown to the user.

---

## 🚀 Local Setup (if you share the repo)

To run this project locally:

1. Clone the repository

```bash
git clone https://github.com/<your-username>/<your-repo-name>.git


## Features

- **Real-time AI Feedback**: Powered by Groq (Llama 3) to grade answers instantly.
- **Three Interview Modes**: Technical, Behavioral, and System Design.
- **Progress Tracking**: Dashboard with stats on questions attempted and average scores.
- **Authentication**: Secure login and signup via Supabase.
- **Modern UI**: Built with Tailwind CSS and Glassmorphism design.

## Tech Stack

- **Frontend**: HTML, Tailwind CSS, JavaScript (Modules)
- **Backend/Auth**: Supabase
- **AI Model**: Groq API (Llama 3)

## Setup

1. Clone the repository.
2. Open `index.html` with a local server (e.g., Live Server in VS Code).
3. Update Supabase keys in `js/supabase.js`.

## Deployment

This project is deployed on Vercel.

---

Created by Rutvi Landge.
```

### 2. Important: Security Warning ⚠️

Before you push to GitHub, please be aware:
*   **Supabase Keys:** Your `SUPABASE_URL` and `SUPABASE_ANON_KEY` (in `js/supabase.js`) are generally safe to be public in client-side apps.
*   **Groq API Key:** Your `GROQ_API_KEY` (in `js/chat.js`) is **sensitive**. By pushing it to GitHub, it will be visible to the public. GitHub might detect this and alert you.
   *   *For this portfolio project:* It is acceptable to push it to get the demo working, but be aware that if you share the repo publicly, others could use your AI credits. You can regenerate the key in the Groq console later if needed.

### 3. Push to GitHub

Open your terminal (Command Prompt or Git Bash) in your project folder `c:\Users\Rutvi\ai-interview-prep-bot\` and run these commands one by one:

1.  **Initialize Git:**
   ```bash
   git init
   ```

2.  **Add files:**
   ```bash
   git add .
   ```

3.  **Commit your changes:**
   ```bash
   git commit -m "Initial commit - Interview Prep AI"
   ```

4.  **Create a Repository on GitHub:**
   *   Go to github.com/new.
   *   Name it `ai-interview-prep`.
   *   Click **Create repository**.

5.  **Connect and Push:**
   *   Copy the commands shown on GitHub under "…or push an existing repository from the command line". They will look like this (replace `YOUR-USERNAME` with your actual GitHub username):
   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/ai-interview-prep.git
   git branch -M main
   git push -u origin main
   ```

### 4. Deploy to Vercel

1.  Go to vercel.com and log in (you can use your GitHub account).
2.  Click **"Add New..."** > **"Project"**.
3.  You should see your new `ai-interview-prep` repository in the list. Click **Import**.
4.  **Configure Project:**
   *   **Framework Preset:** Select "Other" (since it's plain HTML/JS).
   *   **Root Directory:** Leave as `./`.
5.  Click **Deploy**.

Vercel will build your site in a few seconds and give you a live URL (e.g., `https://ai-interview-prep.vercel.app`) that you can share with friends!

<!--
[PROMPT_SUGGESTION]How do I update my website on Vercel after I make changes to the code?[/PROMPT_SUGGESTION]
[PROMPT_SUGGESTION]How do I hide my API keys using Environment Variables on Vercel?[/PROMPT_SUGGESTION]

import { supabase } from "./supabase.js";

const passwordForm = document.getElementById("password-form");
const newPasswordInput = document.getElementById("new-password");
const saveBtn = document.getElementById("save-btn");

// API Key Logic
const apiForm = document.getElementById("api-key-form");
const groqKeyInput = document.getElementById("groq-key");

// Load existing key
const savedKey = localStorage.getItem("groq_api_key");
if (savedKey && groqKeyInput) groqKeyInput.value = savedKey;

if (apiForm) {
  apiForm.addEventListener("submit", (e) => {
    e.preventDefault();
    localStorage.setItem("groq_api_key", groqKeyInput.value.trim());
    alert("API Key saved successfully!");
  });
}

if (passwordForm) {
  passwordForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const newPassword = newPasswordInput.value;

    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    saveBtn.disabled = true;
    saveBtn.textContent = "Updating...";

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      alert("Error updating password: " + error.message);
    } else {
      alert("Password updated successfully!");
      newPasswordInput.value = "";
    }

    saveBtn.disabled = false;
    saveBtn.textContent = "Update Password";
  });
}
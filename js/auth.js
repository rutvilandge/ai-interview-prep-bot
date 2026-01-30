// js/auth.js
import { supabase } from "./supabase.js";

// Elements (works only if they exist on page)
const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const logoutBtn = document.getElementById("logout-btn");
const submitBtn = document.getElementById("submit-btn");

// Helper to handle auth errors clearly
function handleAuthError(error) {
  if (error.message.includes("Email not confirmed")) {
    alert("Please check your email inbox to verify your account.");
  } else if (error.message.includes("Email logins are disabled")) {
    alert("Email login is disabled in Supabase. Go to Auth > Providers > Email and enable 'Enable Email provider'.");
  } else if (error.message.includes("Signups not allowed")) {
    console.warn("Enable signups here: https://supabase.com/dashboard/project/nhoroexjsuiiznypbiuu/settings/auth");
    alert("Signups are disabled. Open Console (F12) for the direct link to Supabase settings.");
  } else if (error.message.includes("Invalid API Key")) {
    alert("Invalid Supabase API Key! Please open 'js/supabase.js' and paste your 'anon' key starting with 'eyJ'.");
  } else {
    alert(error.message);
  }
}

// Helper to toggle loading state
function setLoading(isLoading) {
  if (!submitBtn) return;
  if (isLoading) {
    submitBtn.disabled = true;
    submitBtn.textContent = "Processing...";
  } else {
    submitBtn.disabled = false;
    // Restore text based on current mode
    const isSignup = loginForm && loginForm.dataset.type === "signup";
    submitBtn.textContent = isSignup ? "Sign Up" : "Login";
  }
}

// ---------------- SIGN UP ----------------
async function signUp(email, password) {
  setLoading(true);
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  setLoading(false);

  if (error) {
    handleAuthError(error);
  } else if (data.session) {
    // If email confirmation is disabled, log them in immediately
    window.location.href = "dashboard.html";
  } else {
    alert("Signup successful! Please check your email to verify.");
  }
}

// ---------------- LOGIN ----------------
async function login(email, password) {
  setLoading(true);
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    setLoading(false);
    handleAuthError(error);
  } else {
    window.location.href = "dashboard.html";
  }
}

// ---------------- LOGOUT ----------------
async function logout() {
  if (logoutBtn) {
    logoutBtn.disabled = true;
    logoutBtn.textContent = "Logging out...";
  }
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    window.location.href = "login.html";
  }
}

// ---------------- FORM HANDLER ----------------
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = emailInput.value;
    const password = passwordInput.value;

    // Change this flag if you want separate signup page later
    const isSignup = loginForm.dataset.type === "signup";

    if (isSignup) {
      signUp(email, password);
    } else {
      login(email, password);
    }
  });
}

// ---------------- PROTECT PAGES ----------------
async function checkAuth() {
  const { data } = await supabase.auth.getSession();
  const session = data?.session;

  const protectedPages = ["dashboard.html", "chat.html", "settings.html"];
  const isProtected = protectedPages.some((page) => window.location.href.includes(page));
  const isLoginPage = window.location.href.includes("login.html");

  if (isProtected && !session) {
    // Not logged in, trying to access protected page -> Go to Login
    window.location.href = "login.html";
  }
}

checkAuth();

// ---------------- LOGOUT BUTTON ----------------
if (logoutBtn) {
  logoutBtn.addEventListener("click", logout);
}

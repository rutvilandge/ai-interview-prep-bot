import { supabase } from "./supabase.js";

const passwordForm = document.getElementById("password-form");
const newPasswordInput = document.getElementById("new-password");
const saveBtn = document.getElementById("save-btn");
const deleteBtn = document.getElementById("delete-account-btn");

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

// Delete Account Logic
if (deleteBtn) {
  deleteBtn.addEventListener("click", async () => {
    if (confirm("Are you sure you want to delete your account? This will delete all your progress and cannot be undone.")) {
      deleteBtn.disabled = true;
      deleteBtn.textContent = "Deleting...";

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Delete user progress
        await supabase.from("user_progress").delete().eq("user_id", user.id);
        
        // Sign out
        await supabase.auth.signOut();
        window.location.href = "index.html";
      }
    }
  });
}
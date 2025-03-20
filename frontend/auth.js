const BASE_URL = "http://localhost:3000/api";

const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fullname = document.getElementById("fullname").value.trim();
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!fullname || !username || !email || !password) {
      alert("Please fill in all fields.");
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/users/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullname, username, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Signup successful! Please login.");
        window.location.href = "login.html";
      } else {
        alert(data.error || "Signup failed!");
      }
    } catch (error) {
      alert("Error signing up. Please try again later.");
      console.error(error);
    }
  });
}
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    if (!email || !password) {
      alert("Please fill in both fields.");
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        window.location.href = "index.html";
      } else {
        alert(data.error || "Login failed!");
      }
    } catch (error) {
      alert("Error logging in. Please try again later.");
      console.error(error);
    }
  });
}

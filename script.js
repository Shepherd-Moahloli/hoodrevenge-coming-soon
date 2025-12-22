// Countdown and audio functionality
const targetDate = new Date("2025-12-31T23:59:59Z");
document.getElementById("year").textContent = new Date().getFullYear();

let audioContext;
let tickToggle = false;
let tickInterval = null;

function initAudio() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    startContinuousTicking();
  }
}

function playTickSound() {
  if (!audioContext) return;
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  const filterNode = audioContext.createBiquadFilter();

  oscillator.connect(filterNode);
  filterNode.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.type = "square";
  if (tickToggle) {
    oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      150,
      audioContext.currentTime + 0.02
    );
  } else {
    oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      110,
      audioContext.currentTime + 0.02
    );
  }

  tickToggle = !tickToggle;
  filterNode.type = "lowpass";
  filterNode.frequency.setValueAtTime(1200, audioContext.currentTime);
  filterNode.Q.setValueAtTime(2, audioContext.currentTime);

  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(
    0.0175,
    audioContext.currentTime + 0.005
  );
  gainNode.gain.exponentialRampToValueAtTime(
    0.0015,
    audioContext.currentTime + 0.08
  );

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.08);
}

function startContinuousTicking() {
  if (tickInterval) clearInterval(tickInterval);
  tickInterval = setInterval(playTickSound, 1000);
}

document.addEventListener("click", initAudio, { once: true });
document.addEventListener("keydown", initAudio, { once: true });
document.addEventListener("touchstart", initAudio, { once: true });

function pad(n) {
  return String(n).padStart(2, "0");
}

function updateCountdown() {
  const now = new Date();
  const diff = targetDate - now;
  if (diff <= 0) {
    document.getElementById("days").textContent = "00";
    document.getElementById("hours").textContent = "00";
    document.getElementById("mins").textContent = "00";
    document.getElementById("secs").textContent = "00";
    return;
  }
  const secs = Math.floor(diff / 1000) % 60;
  const mins = Math.floor(diff / 60000) % 60;
  const hours = Math.floor(diff / 3600000) % 24;
  const days = Math.floor(diff / 86400000);

  document.getElementById("days").textContent = pad(days);
  document.getElementById("hours").textContent = pad(hours);
  document.getElementById("mins").textContent = pad(mins);
  document.getElementById("secs").textContent = pad(secs);
}

updateCountdown();
setInterval(updateCountdown, 1000);

// Form submission function
function subscribe(e) {
  e.preventDefault();

  const form = document.getElementById("subscribe-form");
  const emailInput = document.getElementById("email");
  const submitBtn = form.querySelector(".btn");
  const messageDiv = document.getElementById("form-message");
  const email = emailInput.value.trim();
  const originalText = submitBtn.textContent;

  // Clear states
  if (messageDiv) {
    messageDiv.textContent = "";
    messageDiv.className = "form-message";
    messageDiv.style.opacity = "0";
  }
  emailInput.style.borderColor = "";
  emailInput.style.boxShadow = "";

  // Validate
  if (!email) {
    showError(
      emailInput,
      submitBtn,
      messageDiv,
      "Please enter your email address",
      originalText
    );
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showError(
      emailInput,
      submitBtn,
      messageDiv,
      "Please enter a valid email address",
      originalText
    );
    return;
  }

  // Submit
  submitBtn.textContent = "Sending...";
  submitBtn.disabled = true;
  emailInput.disabled = true;

  // Create form data manually to ensure email field is properly included
  const formData = new FormData();
  formData.append("email", email);
  formData.append("_subject", "New HoodRevenge Subscriber");
  formData.append("_captcha", "false");
  formData.append("_template", "table");
  formData.append("_replyto", email);
  formData.append("source", "HoodRevenge Coming Soon Page");

  fetch(form.action, {
    method: "POST",
    body: formData,
    headers: {
      Accept: "application/json",
    },
  })
    .then(async (response) => {
      if (response.ok) {
        showSuccess(emailInput, submitBtn, messageDiv, originalText);
      } else {
        // Handle Formspree validation errors
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = {};
        }

        if (response.status === 422 && errorData.errors) {
          // Formspree validation error - show the specific error
          const errorMsg = errorData.errors.map((e) => e.message).join(", ");
          showError(emailInput, submitBtn, messageDiv, errorMsg, originalText);
        } else {
          // Other errors
          showError(
            emailInput,
            submitBtn,
            messageDiv,
            "Something went wrong. Please try again.",
            originalText
          );
        }
      }
    })
    .catch((error) => {
      console.error("Network error:", error);
      showError(
        emailInput,
        submitBtn,
        messageDiv,
        "Network error. Please check your connection.",
        originalText
      );
    });
}

function showError(emailInput, submitBtn, messageDiv, message, originalText) {
  emailInput.style.borderColor = "#dc2626";
  emailInput.style.boxShadow = "0 0 0 3px rgba(220, 38, 38, 0.1)";

  if (messageDiv) {
    messageDiv.textContent = message;
    messageDiv.className = "form-message error";
    messageDiv.style.opacity = "1";
    messageDiv.style.transform = "translateY(0)";
  }

  submitBtn.textContent = "Try Again";
  submitBtn.style.background = "#dc2626";
  submitBtn.disabled = false;
  emailInput.disabled = false;

  setTimeout(() => {
    emailInput.style.borderColor = "";
    emailInput.style.boxShadow = "";
    submitBtn.textContent = originalText;
    submitBtn.style.background = "";
    if (messageDiv) {
      messageDiv.textContent = "";
      messageDiv.className = "form-message";
      messageDiv.style.opacity = "0";
    }
  }, 5000);
}

function showSuccess(emailInput, submitBtn, messageDiv, originalText) {
  emailInput.value = "";
  emailInput.style.borderColor = "#10b981";
  emailInput.style.boxShadow = "0 0 0 3px rgba(16, 185, 129, 0.1)";

  if (messageDiv) {
    messageDiv.textContent = "Thanks! You're subscribed! 🎉";
    messageDiv.className = "form-message success";
    messageDiv.style.opacity = "1";
    messageDiv.style.transform = "translateY(0)";
  }

  submitBtn.textContent = "✓ Subscribed";
  submitBtn.style.background = "#10b981";
  submitBtn.disabled = false;
  emailInput.disabled = false;

  setTimeout(() => {
    emailInput.style.borderColor = "";
    emailInput.style.boxShadow = "";
    submitBtn.textContent = originalText;
    submitBtn.style.background = "";
    if (messageDiv) {
      messageDiv.textContent = "";
      messageDiv.className = "form-message";
      messageDiv.style.opacity = "0";
    }
  }, 4000);
}

// Simple countdown + subscribe behavior
// Edit targetDate to the launch date/time you want (UTC)
const targetDate = new Date("2025-12-31T23:59:59Z"); // December 31st, 2025 - New Year's Eve

// update year in footer
document.getElementById("year").textContent = new Date().getFullYear();

// Create audio context for tick sound
let audioContext;
let previousSeconds = null;
let tickToggle = false; // For alternating tick-tock sound
let tickInterval = null; // For continuous ticking

// Initialize audio context (user interaction required)
function initAudio() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    startContinuousTicking(); // Start the clock ticking loop
  }
}

// Generate tick sound using Web Audio API
function playTickSound() {
  if (!audioContext) return;

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  const filterNode = audioContext.createBiquadFilter();

  oscillator.connect(filterNode);
  filterNode.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // Alternate between TICK (higher) and TOCK (lower) sounds
  oscillator.type = "square";
  if (tickToggle) {
    // TICK - higher pitch
    oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      150,
      audioContext.currentTime + 0.02
    );
  } else {
    // TOCK - lower pitch
    oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      110,
      audioContext.currentTime + 0.02
    );
  }

  // Toggle for next time
  tickToggle = !tickToggle;

  // Add filter for more realistic clock sound
  filterNode.type = "lowpass";
  filterNode.frequency.setValueAtTime(1200, audioContext.currentTime);
  filterNode.Q.setValueAtTime(2, audioContext.currentTime);

  // Sharp attack and quick decay like a real clock mechanism
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(
    0.0175,
    audioContext.currentTime + 0.005
  ); // Quick attack (even lower volume)
  gainNode.gain.exponentialRampToValueAtTime(
    0.0015,
    audioContext.currentTime + 0.08
  ); // Decay

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.08);
}

// Start continuous ticking like an old-fashioned clock
function startContinuousTicking() {
  if (tickInterval) clearInterval(tickInterval);

  // Tick every 1000ms (1 second) like a real clock
  tickInterval = setInterval(() => {
    playTickSound();
  }, 1000);
}

// Enable audio on first user interaction
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

  // No need to play tick sound here anymore - continuous loop handles it

  document.getElementById("days").textContent = pad(days);
  document.getElementById("hours").textContent = pad(hours);
  document.getElementById("mins").textContent = pad(mins);
  document.getElementById("secs").textContent = pad(secs);
}

// Run countdown every second
updateCountdown();
setInterval(updateCountdown, 1000);

// Subscribe form: Uses Formspree for reliable email delivery with enhanced error handling
function subscribe(e) {
  alert("🚀 Form submitted!"); // Simple test to see if function is called
  console.log("🚀 Subscribe function called!");
  e.preventDefault();

  const form = document.getElementById("subscribe-form");
  const emailInput = document.getElementById("email");
  const submitBtn = form.querySelector(".btn");
  const messageDiv = document.getElementById("form-message");
  const email = emailInput.value.trim();

  console.log("📧 Email value:", email);
  console.log("📦 Message div exists:", !!messageDiv);

  // Simple test - force show error message
  if (messageDiv) {
    messageDiv.innerHTML =
      '<span style="color: red; background: rgba(220,38,38,0.1); border: 1px solid red; padding: 10px; border-radius: 5px; display: block;">❌ TEST ERROR MESSAGE</span>';
  }

  // Clear any existing error states
  emailInput.classList.remove("error");
  emailInput.style.borderColor = "";

  // Validate email format - show RED error message under form if invalid
  if (!email) {
    console.log("❌ Email is empty - showing error");
    showError(
      emailInput,
      submitBtn,
      messageDiv,
      "Please enter your email address"
    );
    return;
  }

  // Enhanced email validation - show RED error message under form for wrong format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.log("❌ Email format invalid - showing error");
    showError(
      emailInput,
      submitBtn,
      messageDiv,
      "Please enter a valid email address"
    );
    return;
  }

  console.log("✅ Email validation passed - proceeding with submission");

  // If email is valid, proceed with submission
  const originalText = submitBtn.textContent;
  submitBtn.textContent = "Sending...";
  submitBtn.disabled = true;
  emailInput.disabled = true;

  // Send to Formspree
  fetch(form.action, {
    method: "POST",
    body: new FormData(form),
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        // Success
        showSuccess(emailInput, submitBtn, messageDiv, originalText);
      } else {
        // Server error
        throw new Error(
          `Server responded with ${response.status}: ${response.statusText}`
        );
      }
    })
    .catch((error) => {
      // Network or other errors
      console.error("Form submission error:", error);

      let errorMessage = "Something went wrong. Please try again.";

      // Specific error messages based on error type
      if (error.message.includes("Failed to fetch")) {
        errorMessage = "Network error. Please check your connection.";
      } else if (error.message.includes("500")) {
        errorMessage = "Server error. Please try again in a moment.";
      } else if (error.message.includes("400")) {
        errorMessage = "Invalid request. Please check your email.";
      }

      showError(emailInput, submitBtn, messageDiv, errorMessage, originalText);
    });
}

// Function to show error messages
function showError(
  emailInput,
  submitBtn,
  messageDiv,
  message,
  originalText = "Notify Me"
) {
  console.log("showError called with:", { message, messageDiv: !!messageDiv });

  // Style the input as error
  emailInput.style.borderColor = "#dc2626";
  emailInput.style.boxShadow = "0 0 0 3px rgba(220, 38, 38, 0.1)";

  // Show error message below form
  if (messageDiv) {
    messageDiv.textContent = message;
    messageDiv.className = "form-message error";
    messageDiv.style.display = "block";
    messageDiv.style.opacity = "1";
    messageDiv.style.transform = "translateY(0)";
    console.log("Error message set:", message);
    console.log("Message div classes:", messageDiv.className);
    console.log("Message div text:", messageDiv.textContent);
  } else {
    console.error("Message div not found!");
    // Fallback: show in placeholder
    emailInput.placeholder = message;
    emailInput.style.color = "#dc2626";
  }

  // Update button
  submitBtn.textContent = "Try Again";
  submitBtn.style.background = "#dc2626";
  submitBtn.disabled = false;
  emailInput.disabled = false;

  // Reset after 5 seconds
  setTimeout(() => {
    emailInput.style.borderColor = "";
    emailInput.style.boxShadow = "";
    emailInput.style.color = "";
    submitBtn.textContent = originalText;
    submitBtn.style.background = "";

    if (messageDiv) {
      messageDiv.textContent = "";
      messageDiv.className = "form-message";
      messageDiv.style.opacity = "";
      messageDiv.style.transform = "";
    } else {
      emailInput.placeholder = "Enter your email to get updates";
    }
  }, 5000);
}

// Function to show success messages
function showSuccess(emailInput, submitBtn, messageDiv, originalText) {
  emailInput.value = "";
  emailInput.style.borderColor = "#10b981";
  emailInput.style.boxShadow = "0 0 0 3px rgba(16, 185, 129, 0.1)";

  // Show success message below form
  if (messageDiv) {
    messageDiv.textContent = "Thanks! You're subscribed! 🎉";
    messageDiv.className = "form-message success";
    messageDiv.style.display = "block";
    messageDiv.style.opacity = "1";
    messageDiv.style.transform = "translateY(0)";
  }

  submitBtn.textContent = "✓ Subscribed";
  submitBtn.style.background = "#10b981";

  // Reset after 5 seconds
  setTimeout(() => {
    emailInput.style.borderColor = "";
    emailInput.style.boxShadow = "";
    submitBtn.textContent = originalText;
    submitBtn.style.background = "";
    submitBtn.disabled = false;
    emailInput.disabled = false;
    if (messageDiv) {
      messageDiv.textContent = "";
      messageDiv.className = "form-message";
      messageDiv.style.opacity = "";
      messageDiv.style.transform = "";
    }
  }, 5000);
}

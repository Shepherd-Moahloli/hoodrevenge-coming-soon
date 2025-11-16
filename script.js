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

// Subscribe form: simple mailto fallback.
// You can replace this with an AJAX call to your backend or a service like Mailchimp/Formspree.
function subscribe(e) {
  e.preventDefault();
  const emailInput = document.getElementById("email");
  const email = emailInput.value.trim();
  if (!email) return;
  // Open user's mail client with a prefilled email (fallback)
  const subject = encodeURIComponent("Subscribe: Coming Soon updates");
  const body = encodeURIComponent(
    `Please subscribe me to updates.\n\nEmail: ${email}`
  );
  window.location.href = `mailto:info@hoodrevenge.com?subject=${subject}&body=${body}`;
  // Optionally clear form and give subtle feedback
  emailInput.value = "";
  emailInput.placeholder = "Thanks — check your inbox!";
  setTimeout(
    () => (emailInput.placeholder = "Enter your email to get updates"),
    4000
  );
}

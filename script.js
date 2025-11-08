// Simple countdown + subscribe behavior
// Edit targetDate to the launch date/time you want (UTC)
const targetDate = new Date("2025-12-31T23:59:59Z"); // December 31st, 2025 - New Year's Eve

// update year in footer
document.getElementById("year").textContent = new Date().getFullYear();

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

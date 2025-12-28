/* filepath: js/main.js */
function scrollToProducts() {
  document.getElementById("products-section").scrollIntoView({
    behavior: "smooth",
  });
}

function redirectToShop() {
  window.location.href = "shop.html";
}

// Enhanced cursor-following zoom effect
document.addEventListener("DOMContentLoaded", function () {
  const productImages = document.querySelectorAll(".product-img");

  productImages.forEach((img) => {
    // Create zoom overlay
    const zoomOverlay = document.createElement("div");
    zoomOverlay.className = "zoom-overlay";
    document.body.appendChild(zoomOverlay);

    img.addEventListener("mouseenter", function (e) {
      zoomOverlay.classList.add("active");
      zoomOverlay.style.backgroundImage = `url(${this.src})`;
      zoomOverlay.style.backgroundSize = "400%"; // Higher zoom level
    });

    img.addEventListener("mousemove", function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Fix the background position calculation
      const xPercent = (x / rect.width) * 100;
      const yPercent = (y / rect.height) * 100;

      // Correct background positioning - this was the issue!
      zoomOverlay.style.backgroundPosition = `${xPercent}% ${yPercent}%`;

      // Position the zoom overlay circle to follow cursor
      zoomOverlay.style.left = `${e.clientX}px`;
      zoomOverlay.style.top = `${e.clientY}px`;
    });

    img.addEventListener("mouseleave", function () {
      zoomOverlay.classList.remove("active");
    });
  });
});

// Precise video overlay scroll detection with logo swap
window.addEventListener("scroll", function () {
  const navbar = document.querySelector(".navbar");
  const videoOverlay = document.querySelector(".video-overlay");
  const logo = document.querySelector(".logo img");

  if (videoOverlay) {
    const overlayRect = videoOverlay.getBoundingClientRect();
    const overlayBottom = overlayRect.bottom;

    if (overlayBottom < 100) {
      navbar.classList.add("scrolled");
      if (logo) {
        logo.src = "images/hood-logo-black.png";
      }
    } else {
      navbar.classList.remove("scrolled");
      if (logo) {
        logo.src = "images/hood-logo.png";
      }
    }
  } else {
    if (window.scrollY > 600) {
      navbar.classList.add("scrolled");
      if (logo) {
        logo.src = "images/hood-logo-black.png";
      }
    } else {
      navbar.classList.remove("scrolled");
      if (logo) {
        logo.src = "images/hood-logo.png";
      }
    }
  }
});

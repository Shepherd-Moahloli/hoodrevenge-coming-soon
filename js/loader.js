// 🚀 HOODREVENGE LOGO SPINNING LOADER SYSTEM

console.log("🔄 HoodRevenge Loader.js loaded");

// Create loader HTML with actual logo
function createLoader(text = "Loading HoodRevenge...") {
  return `
    <div class="loader-overlay" id="pageLoader">
      <div class="loader-container">
        <div class="loader-logo">
          <img src="images/hood-logo-black.png" alt="HoodRevenge Logo" onerror="this.style.display='none';">
        </div>
        <div class="dots-loader">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
        <div class="progress-bar"></div>
        <div class="loader-text">${text}</div>
      </div>
    </div>
  `;
}

// Show loader with custom text
function showLoader(text = "Loading...") {
  // Remove existing loader if any
  const existingLoader = document.getElementById("pageLoader");
  if (existingLoader) {
    existingLoader.remove();
  }

  // Add new loader
  document.body.insertAdjacentHTML("afterbegin", createLoader(text));
  console.log("🔄 HoodRevenge loader shown:", text);
}

// Hide loader smoothly
function hideLoader() {
  const loader = document.getElementById("pageLoader");
  if (loader) {
    loader.classList.add("loader-hidden");

    setTimeout(() => {
      if (loader.parentNode) {
        loader.parentNode.removeChild(loader);
        console.log("✅ HoodRevenge loader hidden and removed");
      }
    }, 500);
  }
}

// Initialize loader on page load
document.addEventListener("DOMContentLoaded", function () {
  console.log("🚀 HoodRevenge page loading started");

  // Show loader immediately with page-specific text
  const pageTitle = document.title;
  let loaderText = "Loading HoodRevenge...";

  if (pageTitle.includes("Cart")) {
    loaderText = "Loading your cart...";
  } else if (pageTitle.includes("Checkout")) {
    loaderText = "Loading checkout...";
  } else if (pageTitle.includes("Cancelled")) {
    loaderText = "Loading page...";
  } else if (pageTitle.includes("Streetwear")) {
    loaderText = "Loading collection...";
  }

  showLoader(loaderText);

  // Hide loader when everything is loaded
  window.addEventListener("load", function () {
    console.log("✅ HoodRevenge page fully loaded");

    setTimeout(() => {
      hideLoader();
    }, 1200); // Show loader for 1.2 seconds for smooth UX
  });
});

// Show loader on navigation with smart text
function setupNavigationLoader() {
  document.querySelectorAll("a[href]").forEach((link) => {
    // Only add to internal links
    if (
      link.hostname === window.location.hostname ||
      link.href.startsWith("/") ||
      link.href.startsWith("./")
    ) {
      link.addEventListener("click", function (e) {
        // Don't show loader for anchor links or external links
        if (
          !this.href.includes("#") &&
          !this.href.includes("mailto:") &&
          !this.href.includes("tel:") &&
          !this.href.includes("whatsapp:") &&
          !this.href.includes("wa.me")
        ) {
          // Smart loader text based on destination
          let navText = "Loading page...";
          if (this.href.includes("cart")) {
            navText = "Opening cart...";
          } else if (this.href.includes("checkout")) {
            navText = "Going to checkout...";
          } else if (this.href.includes("shop")) {
            navText = "Loading shop...";
          }

          console.log(
            "🔄 HoodRevenge navigation loader triggered for:",
            this.href,
          );
          showLoader(navText);
        }
      });
    }
  });
}

// Initialize navigation loader after DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(setupNavigationLoader, 100);
});

// Global functions
window.showLoader = showLoader;
window.hideLoader = hideLoader;

// Add some extra polish - preload the logo
window.addEventListener("load", function () {
  const logoPreload = new Image();
  logoPreload.src = "images/hood-logo.png";
  console.log("🎨 HoodRevenge logo preloaded for faster loading");
});

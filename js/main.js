/* filepath: js/main.js */
// Updated product catalog with new image sequences
const PRODUCT_CATALOG = {
  1: {
    id: 1,
    name: "Tie-Dye Hoodie - Blue Design",
    price: 650,
    images: {
      main: "images/Artboard 1 copy 8.jpg",
      back: "images/Artboard 1 copy 8-1.jpg",
      closeup: "images/Artboard 1 copy 8-2.jpg",
    },
  },
  2: {
    id: 2,
    name: "Tie-Dye Hoodie - Design 2",
    price: 650,
    images: {
      main: "images/Artboard 1 copy 3.jpg",
      back: "images/Artboard 1 copy 4.jpg",
      closeup: "images/Artboard 1 copy 5.jpg",
    },
  },
  3: {
    id: 3,
    name: "Tie-Dye Hoodie - Design 3",
    price: 650,
    images: {
      main: "images/Artboard 1 copy 6.jpg",
      back: "images/Artboard 1 copy 6-1.jpg",
      closeup: "images/Artboard 1 copy 6-2.jpg",
    },
  },
  4: {
    id: 4,
    name: "Tie-Dye Hoodie - Green/Yellow",
    price: 650,
    images: {
      main: "images/Artboard 1.jpg",
      back: "images/Artboard 1 copy.jpg",
      closeup: "images/Artboard 1 copy 2.jpg",
    },
  },
  5: {
    id: 5,
    name: "Tie-Dye Hoodie - Blue Highlighted Design",
    price: 650,
    images: {
      main: "images/Artboard 1 copy 7.jpg",
      back: "images/Artboard 1 copy 7-1.jpg",
      closeup: "images/Artboard 1 copy 7-2.jpg",
    },
  },
  6: {
    id: 6,
    name: "Tie-Dye Hoodie - Design 6",
    price: 650,
    images: {
      main: "images/Artboard 1 copy 6.jpg",
      back: "images/Artboard 1 copy 6-1.jpg",
      closeup: "images/Artboard 1 copy 6-2.jpg",
    },
  },
};

function scrollToProducts() {
  const productsSection = document.getElementById("products-section");
  if (productsSection) {
    productsSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}

function redirectToShop() {
  window.location.href = "shop.html";
}

// GLOBAL addToCart function
window.addToCart = function (id, name, price, images, size = "M") {
  console.log("🔥 ADD TO CART CALLED", { id, name, price, images, size });

  const cartData = JSON.parse(localStorage.getItem("hoodrevenge-cart") || "[]");

  const existingItem = cartData.find(
    (item) => item.id == id && item.size === size,
  );

  if (existingItem) {
    existingItem.quantity += 1;
    console.log("Updated existing item quantity:", existingItem.quantity);
  } else {
    cartData.push({
      id: parseInt(id),
      name: name,
      price: price,
      images: images,
      size: size,
      quantity: 1,
    });
    console.log("Added new item to cart");
  }

  localStorage.setItem("hoodrevenge-cart", JSON.stringify(cartData));
  updateCartCount();
  showAddToCartMessage(name);
};

// DOMContentLoaded event listener
document.addEventListener("DOMContentLoaded", function () {
  console.log("🚀 Main.js DOMContentLoaded fired");

  // Initialize navbar
  initNavbar();

  // Initialize product image switching
  initializeProductImageSwitching();

  // Initialize cart count
  updateCartCount();
});

function initNavbar() {
  const navbar = document.querySelector(".navbar");
  const logo = document.querySelector(".logo img");
  const navLinks = document.querySelectorAll(".nav-menu a");
  const cartLink = document.querySelector(".cart-link");

  // Set initial navbar state based on page background
  if (
    document.body.classList.contains("white-bg") ||
    window.location.pathname.includes("cart.html") ||
    window.location.pathname.includes("checkout.html")
  ) {
    // White background pages
    navbar.style.background = "rgba(255, 255, 255, 0.95)";
    navbar.style.backdropFilter = "blur(15px)";
    navbar.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.1)";

    if (logo) {
      logo.src = "images/hood-logo-black.png";
    }

    navLinks.forEach((link) => {
      link.style.color = "#2c2c2c";
    });
  }

  // Cart link hover effects
  if (cartLink) {
    cartLink.addEventListener("mouseenter", function () {
      this.style.background = "#2c2c2c";
      this.style.color = "#ffffff !important";
    });

    cartLink.addEventListener("mouseleave", function () {
      this.style.background = "none";
      this.style.color = "#2c2c2c !important";
    });
  }

  // Scroll behavior
  window.addEventListener("scroll", function () {
    if (window.scrollY > 100) {
      navbar.classList.add("scrolled");
      navbar.style.background = "rgba(255, 255, 255, 0.98)";
      navbar.style.backdropFilter = "blur(20px)";
      navbar.style.boxShadow = "0 4px 30px rgba(0, 0, 0, 0.15)";

      if (logo) {
        logo.src = "images/hood-logo-black.png";
      }

      navLinks.forEach((link) => {
        link.style.color = "#2c2c2c";
      });
    } else {
      navbar.classList.remove("scrolled");

      if (!document.body.classList.contains("white-bg")) {
        navbar.style.background = "rgba(255, 255, 255, 0.1)";
        navbar.style.backdropFilter = "blur(15px)";
        navbar.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.1)";

        if (logo) {
          logo.src = "images/hood-logo.png";
        }

        navLinks.forEach((link) => {
          link.style.color = "#ffffff";
        });
      }
    }
  });
}

function initializeProductImageSwitching() {
  console.log("🔄 Setting up image switching and zoom effects...");

  // Add click handlers for all image control buttons
  document.querySelectorAll(".product-card").forEach((card) => {
    const productId = parseInt(card.dataset.id);
    const mainImage = card.querySelector(".product-main-image");
    const imageButtons = card.querySelectorAll(".image-btn");
    const imageContainer = card.querySelector(".product-image-container");

    // Get the correct images from PRODUCT_CATALOG
    const productImages = PRODUCT_CATALOG[productId]?.images;

    if (!productImages) {
      console.log(`❌ No images found for product ${productId}`);
      return;
    }

    console.log(`✅ Setting up Product ${productId}:`, productImages);

    // Initialize zoom effect for this product
    createZoomEffect(imageContainer, mainImage);

    // Image switching buttons
    imageButtons.forEach((button) => {
      button.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        // Remove active class from all buttons in this product
        imageButtons.forEach((btn) => btn.classList.remove("active"));

        // Add active class to clicked button
        this.classList.add("active");

        // Get the image type and update the main image
        const imageType = this.dataset.image;
        const newImageSrc = productImages[imageType];

        console.log(
          `🔄 Switching Product ${productId} to ${imageType}: ${newImageSrc}`,
        );

        if (newImageSrc && mainImage) {
          // Add fade effect
          mainImage.style.opacity = "0.5";
          mainImage.src = newImageSrc;

          // Update zoom result image too
          const zoomResultImg =
            imageContainer.querySelector(".zoom-result img");
          if (zoomResultImg) {
            zoomResultImg.src = newImageSrc;
          }

          // Restore opacity after image loads
          mainImage.onload = function () {
            this.style.opacity = "1";
          };
        }
      });
    });
  });
}

// REPLACE your createZoomEffect function with this FIXED version:
function createZoomEffect(container, mainImage) {
  // Skip zoom on mobile devices completely
  const isMobile = window.innerWidth <= 768 || "ontouchstart" in window;

  if (isMobile) {
    console.log("📱 Skipping zoom on mobile device");
    return;
  }

  // Skip if zoom already exists
  if (container.querySelector(".zoom-circle")) {
    console.log("Zoom effect already exists for this container");
    return;
  }

  console.log("🔍 Creating zoom effect...");

  // Create circular zoom window that follows mouse - PROPERLY CONTAINED
  const zoomCircle = document.createElement("div");
  zoomCircle.className = "zoom-circle";
  zoomCircle.style.cssText = `
    position: absolute;
    width: 100px;
    height: 100px;
    border: 3px solid #ffffff;
    border-radius: 50%;
    box-shadow: 
      0 0 0 2px rgba(44, 44, 44, 0.9),
      0 6px 20px rgba(0, 0, 0, 0.4);
    pointer-events: none;
    z-index: 100;
    transform: translate(-50%, -50%);
    opacity: 0;
    transition: opacity 0.2s ease;
    overflow: hidden;
    background: transparent;
  `;

  // Create zoomed image inside the circle
  const zoomImg = document.createElement("img");
  zoomImg.src = mainImage.src;
  zoomImg.alt = mainImage.alt;
  zoomImg.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: auto;
    height: auto;
    object-fit: none;
    pointer-events: none;
    transform-origin: 0 0;
  `;
  zoomCircle.appendChild(zoomImg);

  // Add "ZOOM" label above the circle
  const zoomLabel = document.createElement("div");
  zoomLabel.textContent = "ZOOM";
  zoomLabel.style.cssText = `
    position: absolute;
    top: -35px;
    left: 50%;
    transform: translateX(-50%);
    background: #2c2c2c;
    color: #ffffff;
    padding: 4px 10px;
    border-radius: 8px;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 1px;
    white-space: nowrap;
    z-index: 101;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
  `;
  zoomCircle.appendChild(zoomLabel);

  container.appendChild(zoomCircle);

  // 🔥 FIXED: Mouse move handler with PROPER BOUNDARIES
  function handleMouseMove(e) {
    const rect = container.getBoundingClientRect();
    const imageRect = mainImage.getBoundingClientRect();

    // Get mouse position relative to container
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 🎯 CRITICAL FIX: Keep lens INSIDE image boundaries only
    const circleRadius = 50; // Half of lens width (100px / 2)
    const imageWidth = imageRect.width;
    const imageHeight = imageRect.height;

    // Clamp position to stay within IMAGE bounds (not container bounds)
    const clampedX = Math.max(
      circleRadius,
      Math.min(imageWidth - circleRadius, x),
    );
    const clampedY = Math.max(
      circleRadius,
      Math.min(imageHeight - circleRadius, y),
    );

    // 🚫 BOUNDARY CHECK: Only show lens if mouse is over the IMAGE
    const mouseOverImage =
      x >= 0 && x <= imageWidth && y >= 0 && y <= imageHeight;

    if (!mouseOverImage) {
      zoomCircle.style.opacity = "0";
      return;
    }

    // Position zoom circle at clamped coordinates
    zoomCircle.style.left = clampedX + "px";
    zoomCircle.style.top = clampedY + "px";
    zoomCircle.style.opacity = "1";

    // Calculate zoom positioning
    const zoomFactor = 2.5; // Slightly higher zoom

    // Set zoomed image size
    zoomImg.style.width = imageWidth * zoomFactor + "px";
    zoomImg.style.height = imageHeight * zoomFactor + "px";

    // Position zoomed image
    const offsetX = clampedX * zoomFactor - circleRadius;
    const offsetY = clampedY * zoomFactor - circleRadius;

    zoomImg.style.transform = `translate(-${offsetX}px, -${offsetY}px)`;
  }

  // 🔥 FIXED: Mouse enter handler
  function handleMouseEnter(e) {
    const rect = container.getBoundingClientRect();
    const imageRect = mainImage.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Only activate if mouse is over the actual image
    if (x >= 0 && x <= imageRect.width && y >= 0 && y <= imageRect.height) {
      container.style.cursor = "none";
      handleMouseMove(e);
    }
  }

  // 🔥 FIXED: Mouse leave handler
  function handleMouseLeave(e) {
    zoomCircle.style.opacity = "0";
    container.style.cursor = "default";
  }

  // Add event listeners with improved detection
  container.addEventListener("mouseenter", handleMouseEnter);
  container.addEventListener("mousemove", handleMouseMove);
  container.addEventListener("mouseleave", handleMouseLeave);

  // 🎯 ADDITIONAL: Hide zoom when mouse moves to buttons area
  const imageControlBtns =
    container.parentElement.querySelector(".image-controls");
  if (imageControlBtns) {
    imageControlBtns.addEventListener("mouseenter", function () {
      zoomCircle.style.opacity = "0";
      container.style.cursor = "default";
    });
  }

  // Update zoom image when main image changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "attributes" && mutation.attributeName === "src") {
        zoomImg.src = mainImage.src;
        console.log("🔄 Updated zoom image:", mainImage.src);
      }
    });
  });

  observer.observe(mainImage, {
    attributes: true,
    attributeFilter: ["src"],
  });

  console.log("✅ Zoom effect created with PROPER boundaries");
}

// Utility functions
function updateCartCount() {
  const cartData = JSON.parse(localStorage.getItem("hoodrevenge-cart") || "[]");
  const count = cartData.reduce(
    (total, item) => total + (item.quantity || 1),
    0,
  );

  // Update both desktop and mobile cart counts
  const cartCountElements = document.querySelectorAll(
    "#cart-count, #mobile-cart-count",
  );
  cartCountElements.forEach((element) => {
    if (element) {
      element.textContent = count;
    }
  });

  console.log("Updated cart count to:", count);
}

function showAddToCartMessage(productName) {
  // Find product in PRODUCT_CATALOG (not the old products array)
  const product = Object.values(PRODUCT_CATALOG).find(
    (p) => p.name === productName,
  );
  const productImage = product
    ? product.images.main
    : "images/default-product.jpg";

  const notification = document.createElement("div");
  notification.innerHTML = `
    <div style="display: flex; align-items: center; gap: 15px;">
      <img src="${productImage}" alt="${productName}" style="
        width: 60px; 
        height: 60px; 
        border-radius: 10px; 
        object-fit: cover;
        border: 2px solid #ffffff;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">
      <div>
        <strong>${productName}</strong> (Size M) added to cart!
        <br><small>Premium South African Streetwear</small>
      </div>
    </div>
  `;
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: #2c2c2c;
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 15px;
    z-index: 10000;
    box-shadow: 0 8px 30px rgba(0,0,0,0.4);
    transform: translateX(400px);
    transition: transform 0.3s ease;
    min-width: 320px;
  `;

  document.body.appendChild(notification);
  setTimeout(() => (notification.style.transform = "translateX(0)"), 100);
  setTimeout(() => {
    notification.style.transform = "translateX(400px)";
    setTimeout(() => document.body.removeChild(notification), 300);
  }, 4000);
}

// Export functions for use in other files
window.scrollToProducts = scrollToProducts;
window.updateCartCount = updateCartCount;

// FIXED zoom styles - removed white background
const zoomStyles = `
  .product-image-container {
    position: relative;
    overflow: visible !important;
    border-radius: 12px;
  }
  
  .product-image-container:hover {
    z-index: 1000;
  }
  
  .product-main-image {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 12px;
    transition: opacity 0.2s ease;
  }

  .zoom-circle {
    background: transparent !important;
    backdrop-filter: none !important;
  }

  .zoom-circle img {
    border-radius: 0 !important;
  }
  
  @media (max-width: 768px) {
    .zoom-circle {
      width: 120px !important;
      height: 120px !important;
    }
  }
  
  @media (max-width: 480px) {
    .zoom-circle {
      display: none !important;
    }
    
    .product-image-container {
      cursor: pointer !important;
    }
  }
`;

// Inject styles
if (!document.getElementById("zoom-styles")) {
  const styleSheet = document.createElement("style");
  styleSheet.id = "zoom-styles";
  styleSheet.textContent = zoomStyles;
  document.head.appendChild(styleSheet);
}

// ========== MOBILE MENU FUNCTIONS ==========

// Mobile Menu Toggle Function - WITH COLOR FORCING
function toggleMobileMenu() {
  const mobileMenuOverlay = document.getElementById("mobileMenuOverlay");
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
  const body = document.body;
  const navbarLogo = document.querySelector(".navbar .logo img");
  const hamburgerSpans = document.querySelectorAll(".hamburger-icon span");

  // Toggle active classes
  mobileMenuOverlay.classList.toggle("active");
  mobileMenuToggle.classList.toggle("active");

  // Prevent/allow body scrolling
  if (mobileMenuOverlay.classList.contains("active")) {
    body.classList.add("mobile-menu-open");

    // 🔥 FORCE BLACK colors when menu opens
    if (navbarLogo) {
      navbarLogo.style.filter = "brightness(0)";
    }
    hamburgerSpans.forEach((span) => {
      span.style.background = "#2c2c2c";
    });
  } else {
    body.classList.remove("mobile-menu-open");

    // 🔥 RESTORE original colors when menu closes
    if (navbarLogo) {
      navbarLogo.style.filter = ""; // Reset to original
    }
    // Re-sync hamburger color with current scroll state
    syncHamburgerColor();
  }

  console.log("🍔 Mobile menu toggled with color sync");
}

// Update cart count in mobile menu too
function updateCartCount() {
  const cartData = JSON.parse(localStorage.getItem("hoodrevenge-cart") || "[]");
  const count = cartData.reduce(
    (total, item) => total + (item.quantity || 1),
    0,
  );

  // Update both desktop and mobile cart counts
  const cartCountElements = document.querySelectorAll(
    "#cart-count, #mobile-cart-count",
  );
  cartCountElements.forEach((element) => {
    if (element) {
      element.textContent = count;
    }
  });

  console.log("Updated cart count to:", count);
}

// Close mobile menu when clicking outside
document.addEventListener("DOMContentLoaded", function () {
  const mobileMenuOverlay = document.getElementById("mobileMenuOverlay");

  if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener("click", function (e) {
      if (e.target === mobileMenuOverlay) {
        toggleMobileMenu();
      }
    });
  }
});

// Close mobile menu on escape key press
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    const mobileMenuOverlay = document.getElementById("mobileMenuOverlay");
    if (mobileMenuOverlay && mobileMenuOverlay.classList.contains("active")) {
      toggleMobileMenu();
    }
  }
});

// Make toggleMobileMenu globally accessible
window.toggleMobileMenu = toggleMobileMenu;

// ========== HAMBURGER ICON COLOR SYNC ==========

// Function to sync hamburger color with logo - SIMPLE CORRECT LOGIC
function syncHamburgerColor() {
  const navbar = document.querySelector(".navbar");
  const hamburgerSpans = document.querySelectorAll(".hamburger-icon span");

  if (navbar && hamburgerSpans.length > 0) {
    // 🎯 SIMPLE LOGIC: Match hamburger color to logo color
    if (navbar.classList.contains("scrolled")) {
      // 🔥 BLACK hamburger when scrolled (BLACK logo shown)
      hamburgerSpans.forEach((span) => {
        span.style.background = "#2c2c2c";
      });
    } else {
      // 🔥 WHITE hamburger when not scrolled (WHITE logo shown)
      hamburgerSpans.forEach((span) => {
        span.style.background = "#ffffff";
      });
    }
  }
}

// Update the existing scroll event listener to include hamburger sync
document.addEventListener("scroll", function () {
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    // Sync hamburger color with navbar state
    syncHamburgerColor();
  }
});

// Initial sync on page load
document.addEventListener("DOMContentLoaded", function () {
  syncHamburgerColor();
});

// ========== END HAMBURGER COLOR SYNC ==========

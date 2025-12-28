/* filepath: js/main.js */
function scrollToProducts() {
  document.getElementById("products-section").scrollIntoView({
    behavior: "smooth",
  });
}

function redirectToShop() {
  window.location.href = "shop.html";
}

// Single DOMContentLoaded event listener
document.addEventListener("DOMContentLoaded", function () {
  console.log("🚀 Main.js DOMContentLoaded fired"); // DEBUG LINE

  // Enhanced cursor-following zoom effect
  const productImages = document.querySelectorAll(".product-img");

  productImages.forEach((img) => {
    // Create zoom overlay
    const zoomOverlay = document.createElement("div");
    zoomOverlay.className = "zoom-overlay";
    document.body.appendChild(zoomOverlay);

    img.addEventListener("mouseenter", function (e) {
      zoomOverlay.classList.add("active");
      zoomOverlay.style.backgroundImage = `url(${this.src})`;
      zoomOverlay.style.backgroundSize = "400%";
    });

    img.addEventListener("mousemove", function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const xPercent = (x / rect.width) * 100;
      const yPercent = (y / rect.height) * 100;

      zoomOverlay.style.backgroundPosition = `${xPercent}% ${yPercent}%`;
      zoomOverlay.style.left = `${e.clientX}px`;
      zoomOverlay.style.top = `${e.clientY}px`;
    });

    img.addEventListener("mouseleave", function () {
      zoomOverlay.classList.remove("active");
    });
  });

  // Cart Management System - Only run on shop page
  if (document.querySelector(".products-grid")) {
    console.log("🛒 Cart system initializing"); // DEBUG LINE

    function addToCart(productCard, index) {
      console.log("🔥 ADD TO CART FUNCTION CALLED");

      const productName = productCard
        .querySelector(".product-info h3")
        .textContent.trim();
      const priceElement = productCard.querySelector(".price");
      const productImage = productCard.querySelector(".product-img").src;

      // Extract price properly for South African Rands
      let productPrice = 650; // Default price in Rands
      if (priceElement) {
        const priceText = priceElement.textContent.trim();
        console.log("Price text:", priceText);

        // Remove R and any other characters, convert to number
        const cleanPrice = priceText.replace(/[^0-9.]/g, "");
        const parsedPrice = parseFloat(cleanPrice);
        if (!isNaN(parsedPrice) && parsedPrice > 0) {
          productPrice = parsedPrice;
        }
      }

      console.log("Final price in Rands:", productPrice);

      // Create unique product ID with default size
      const productId = productName.toLowerCase().replace(/\s+/g, "-");

      const product = {
        id: productId,
        name: productName,
        price: productPrice,
        image: productImage,
        size: "M", // Default size when adding to cart
      };

      console.log("Product to add:", product);

      // Get existing cart
      let cart = JSON.parse(localStorage.getItem("hoodrevenge-cart") || "[]");
      console.log("Current cart before adding:", cart);

      // Check if item already exists with same size
      const existingItem = cart.find(
        (item) => item.id === productId && item.size === product.size
      );

      if (existingItem) {
        existingItem.quantity += 1;
        console.log("Updated existing item quantity:", existingItem.quantity);
      } else {
        cart.push({ ...product, quantity: 1 });
        console.log("Added new item to cart");
      }

      // Save cart
      localStorage.setItem("hoodrevenge-cart", JSON.stringify(cart));
      console.log("Cart after saving:", cart);

      // Update cart count
      updateCartCount();

      // Show notification with product image and size
      showNotification(productName, productImage, product.size);
    }

    function updateCartCount() {
      const cart = JSON.parse(localStorage.getItem("hoodrevenge-cart") || "[]");
      const count = cart.reduce((total, item) => total + item.quantity, 0);
      const cartCountElement = document.getElementById("cart-count");
      if (cartCountElement) {
        cartCountElement.textContent = count;
      }
      console.log("Updated cart count to:", count);
    }

    // Update notification function to show size
    function showNotification(productName, productImage, size) {
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
            <strong>${productName}</strong> (Size ${size}) added to cart!
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
        backdrop-filter: blur(10px);
      `;

      document.body.appendChild(notification);
      setTimeout(() => (notification.style.transform = "translateX(0)"), 100);
      setTimeout(() => {
        notification.style.transform = "translateX(400px)";
        setTimeout(() => document.body.removeChild(notification), 300);
      }, 4000);
    }

    // Add event listeners to cart buttons
    const addToCartButtons = document.querySelectorAll(".add-to-cart");
    console.log(`Found ${addToCartButtons.length} add-to-cart buttons`); // DEBUG LINE

    addToCartButtons.forEach((button, index) => {
      // Remove any existing listeners first
      button.removeEventListener("click", button.cartHandler);

      // Create new handler
      button.cartHandler = function (e) {
        e.preventDefault();
        console.log(`🛒 Cart button ${index} clicked`); // DEBUG LINE

        const productCard = this.closest(".product-card");
        addToCart(productCard, index);
      };

      // Add the new listener
      button.addEventListener("click", button.cartHandler);
    });

    // Update cart count on page load
    updateCartCount();
  }
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

/* filepath: js/main.js */
function scrollToProducts() {
  document.getElementById("products-section").scrollIntoView({
    behavior: "smooth",
  });
}

function redirectToShop() {
  window.location.href = "shop.html";
}

// GLOBAL addToCart function - MOVE THIS OUTSIDE THE CONDITIONAL
window.addToCart = function (id, name, price, images, size = "M") {
  console.log("🔥 ADD TO CART CALLED", { id, name, price, images, size });

  const cartData = JSON.parse(localStorage.getItem("hoodrevenge-cart") || "[]");

  const existingItem = cartData.find(
    (item) => item.id == id && item.size === size
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
    console.log("Added new item to cart:", {
      id: parseInt(id),
      name: name,
      price: price,
      images: images,
      size: size,
      quantity: 1,
    });
  }

  localStorage.setItem("hoodrevenge-cart", JSON.stringify(cartData));
  updateCartCount();
  showAddToCartMessage(name);
};

// DOMContentLoaded event listener
document.addEventListener("DOMContentLoaded", function () {
  console.log("🚀 Main.js DOMContentLoaded fired");

  // Enhanced cursor-following zoom effect
  const productImages = document.querySelectorAll(".product-main-image");

  productImages.forEach((img) => {
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
    console.log("🛒 Cart system initializing");
  }

  // Initialize cart count
  updateCartCount();
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

// Product data array
const products = [
  {
    id: 1,
    name: "Tie-Dye Hoodie - Green/Yellow",
    price: 650,
    images: {
      main: "images/Artboard 1.jpg",
      back: "images/Artboard 1 copy.jpg",
      closeup: "images/Artboard 1 copy 2.jpg",
    },
  },
  {
    id: 2,
    name: "Tie-Dye Hoodie - Design 2",
    price: 650,
    images: {
      main: "images/Artboard 1 copy 3.jpg",
      back: "images/Artboard 1 copy 4.jpg",
      closeup: "images/Artboard 1 copy 5.jpg",
    },
  },
  {
    id: 3,
    name: "Tie-Dye Hoodie - Design 3",
    price: 650,
    images: {
      main: "images/Artboard 1 copy 6.jpg",
      back: "images/Artboard 1 copy 6-1.jpg",
      closeup: "images/Artboard 1 copy 6-2.jpg",
    },
  },
];

// Image switching functionality
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("image-btn")) {
    const productCard = e.target.closest(".product-card");
    const productId = productCard.dataset.id;
    const product = products.find((p) => p.id == productId);
    const imageType = e.target.dataset.image;

    if (product && product.images[imageType]) {
      const mainImage = productCard.querySelector(".product-main-image");
      mainImage.src = product.images[imageType];

      productCard
        .querySelectorAll(".image-btn")
        .forEach((btn) => btn.classList.remove("active"));
      e.target.classList.add("active");
    }
  }
});

// Utility functions
function updateCartCount() {
  const cartData = JSON.parse(localStorage.getItem("hoodrevenge-cart") || "[]"); // Changed from 'cart' to 'cartData'
  const count = cartData.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );

  const cartCountElements = document.querySelectorAll("#cart-count");
  cartCountElements.forEach((element) => {
    element.textContent = count;
  });

  console.log("Updated cart count to:", count);
}

function showAddToCartMessage(productName) {
  const product = products.find((p) => p.name === productName);
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

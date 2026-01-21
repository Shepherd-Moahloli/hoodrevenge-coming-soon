console.log("🚀 CART.JS LOADED AT:", new Date().toISOString());
console.log("File timestamp:", Date.now());

// DEFINE FUNCTIONS OUTSIDE DOMContentLoaded - This is the key!
window.testRemove = function () {
  alert("Test function works! Time: " + Date.now());
  console.log("Test remove function called!");
};

window.removeItem = function (productId) {
  console.log("🗑️ Removing item with ID:", productId);

  const removeButton = event.target;
  removeButton.disabled = true;
  removeButton.textContent = "Removing...";

  let cart = JSON.parse(localStorage.getItem("hoodrevenge-cart") || "[]");
  console.log("Cart before removal:", cart);

  cart = cart.filter((item) => String(item.id) !== String(productId));

  console.log("Cart after removal:", cart);
  localStorage.setItem("hoodrevenge-cart", JSON.stringify(cart));

  showRemoveNotification();

  // CHANGE THIS LINE - use location.reload() instead of displayCart()
  setTimeout(() => {
    location.reload(); // This will refresh the whole page and show updated cart
  }, 500);
};

// Add this notification function
function showRemoveNotification() {
  const notification = document.createElement("div");
  notification.innerHTML = "✅ Item removed from cart";
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
    padding: 1rem 2rem;
    border-radius: 10px;
    z-index: 10000;
    font-weight: bold;
    animation: slideIn 0.3s ease;
  `;

  document.body.appendChild(notification);
  setTimeout(() => {
    document.body.removeChild(notification);
  }, 2000);
}

window.removeFromCart = function (productId, size) {
  alert(`REMOVING: Product ${productId}, Size ${size}`);
  console.log(`🗑️ Remove from cart: ID ${productId}, Size ${size}`);

  let cart = JSON.parse(localStorage.getItem("hoodrevenge-cart") || "[]");
  const numericProductId = parseInt(productId);

  console.log("Before removal:", cart.length, "items");

  cart = cart.filter((item) => {
    const itemId = parseInt(item.id);
    const keepItem = !(itemId === numericProductId && item.size === size);

    if (!keepItem) {
      console.log(`🎯 Found item to remove:`, item);
    }

    return keepItem;
  });

  console.log("After removal:", cart.length, "items");

  localStorage.setItem("hoodrevenge-cart", JSON.stringify(cart));

  // Reload to update display
  location.reload();
};

window.updateQuantity = function (productId, size, newQuantity) {
  console.log(
    `🔄 Update quantity: ID ${productId}, Size ${size}, New quantity: ${newQuantity}`,
  );

  let cart = JSON.parse(localStorage.getItem("hoodrevenge-cart") || "[]");
  const item = cart.find((item) => item.id == productId && item.size === size);

  if (item) {
    if (newQuantity <= 0) {
      removeFromCart(productId, size);
    } else {
      item.quantity = newQuantity;
      localStorage.setItem("hoodrevenge-cart", JSON.stringify(cart));
      location.reload();
    }
  }
};

window.updateSize = function (productId, oldSize, newSize) {
  console.log(`👕 Update size: ID ${productId}, from ${oldSize} to ${newSize}`);

  let cart = JSON.parse(localStorage.getItem("hoodrevenge-cart") || "[]");
  const item = cart.find(
    (item) => item.id == productId && item.size === oldSize,
  );

  if (item) {
    item.size = newSize;
    localStorage.setItem("hoodrevenge-cart", JSON.stringify(cart));
    location.reload();
  }
};

console.log("✅ Functions defined:", {
  testRemove: typeof window.testRemove,
  removeFromCart: typeof window.removeFromCart,
  updateQuantity: typeof window.updateQuantity,
  updateSize: typeof window.updateSize,
});

// NOW the DOMContentLoaded for page setup
document.addEventListener("DOMContentLoaded", function () {
  console.log("🛒 Cart page loaded");

  // 🔥 MAKE THESE FUNCTIONS GLOBAL AND ACCESSIBLE
  window.displayCartItems = displayCartItems;
  window.updateCartSummary = updateCartSummary;
  window.updateCartTotal = updateCartSummary; // Alias for updateCartSummary

  displayCartItems();
  updateCartSummary();

  function displayCartItems() {
    const cart = JSON.parse(localStorage.getItem("hoodrevenge-cart") || "[]");
    const cartItemsContainer = document.getElementById("cart-items");
    const emptyCartMessage = document.getElementById("empty-cart");

    console.log("📦 Cart data loaded:", cart);

    if (!cartItemsContainer) {
      console.log("❌ Cart container not found");
      return;
    }

    if (cart.length === 0) {
      if (emptyCartMessage) emptyCartMessage.style.display = "block";
      if (cartItemsContainer) cartItemsContainer.style.display = "none";
      return;
    }

    if (emptyCartMessage) emptyCartMessage.style.display = "none";
    if (cartItemsContainer) cartItemsContainer.style.display = "block";

    // 🔥 FIXED: Updated cart item HTML with working buttons
    cartItemsContainer.innerHTML = cart
      .map(
        (item) => `
      <div class="cart-item" data-id="${item.id}" data-size="${item.size}">
        <div class="cart-item-image">
          <img src="${item.images?.main || "images/default-product.jpg"}" 
               alt="${item.name}" 
               onerror="this.src='images/Artboard 1 copy 8.jpg'">
        </div>
        <div class="cart-item-details">
          <h3 class="cart-item-name">${item.name}</h3>
          <p class="cart-item-description">Premium South African Streetwear</p>
          <p class="cart-item-price">R${item.price.toFixed(2)}</p>
          <p class="cart-item-size">SIZE: 
            <select onchange="updateItemSize(${item.id}, '${item.size}', this.value)">
              <option value="M" ${item.size === "M" ? "selected" : ""}>M</option>
            </select>
          </p>
          
          <!-- 🔥 WORKING QUANTITY CONTROLS -->
          <div class="quantity-controls">
            <button class="quantity-btn minus" onclick="window.decreaseQuantity(${item.id}, '${item.size}'); console.log('Minus clicked for ${item.id}');">
              <span>-</span>
            </button>
            <span class="quantity-display">${item.quantity || 1}</span>
            <button class="quantity-btn plus" onclick="window.increaseQuantity(${item.id}, '${item.size}'); console.log('Plus clicked for ${item.id}');">
              <span>+</span>
            </button>
          </div>
          
          <button class="remove-btn" onclick="window.removeFromCart(${item.id}, '${item.size}'); console.log('Remove clicked for ${item.id}');">
            REMOVE
          </button>
        </div>
        <div class="cart-item-total">
          <span class="item-total">R${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
        </div>
      </div>
    `,
      )
      .join("");

    console.log("✅ Cart items rendered");
  }

  function updateCartSummary() {
    const cart = JSON.parse(localStorage.getItem("hoodrevenge-cart") || "[]");

    const subtotal = cart.reduce((total, item) => {
      const price = item.price || 650;
      return total + price * item.quantity;
    }, 0);

    const vat = subtotal * 0.15;
    const shipping = 0;
    const total = subtotal + vat + shipping;

    const subtotalElement = document.getElementById("cart-subtotal");
    const vatElement = document.getElementById("cart-vat");
    const totalElement = document.getElementById("cart-total");

    if (subtotalElement)
      subtotalElement.textContent = `R${subtotal.toFixed(2)}`;
    if (vatElement) vatElement.textContent = `R${vat.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `R${total.toFixed(2)}`;

    console.log("💰 Cart summary updated - Total:", total.toFixed(2));
  }

  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("hoodrevenge-cart") || "[]");
    const count = cart.reduce((total, item) => total + (item.quantity || 1), 0);

    const cartCountElements = document.querySelectorAll(
      "#cart-count, .cart-count",
    );
    cartCountElements.forEach((element) => {
      element.textContent = count;
    });

    console.log(`🔢 Cart count updated to: ${count}`);
  }

  // Make updateCartCount global too
  window.updateCartCount = updateCartCount;
  updateCartCount();
});

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
    price: 450, // 🔥 CHANGED: from 650 to 450
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

function addToCart(productId, productName, price, images, size = "M") {
  // USE THE SAME KEY AS THE REST OF THE FILE!
  let cart = JSON.parse(localStorage.getItem("hoodrevenge-cart") || "[]");

  // Check if product with same ID and size already exists
  const existingItemIndex = cart.findIndex(
    (item) => item.id === productId && item.size === size,
  );

  if (existingItemIndex > -1) {
    // Increase quantity
    cart[existingItemIndex].quantity += 1;
  } else {
    // Add new item - USE PRODUCT_CATALOG for correct images
    const productData = PRODUCT_CATALOG[productId];
    const correctImages = productData ? productData.images : images;

    cart.push({
      id: productId,
      name: productName,
      price: price,
      images: correctImages, // Use the correct images from catalog
      size: size,
      quantity: 1,
    });
  }

  // USE THE SAME KEY!
  localStorage.setItem("hoodrevenge-cart", JSON.stringify(cart));
  updateCartCount();

  // Show success message
  showAddToCartMessage(productName);
}

// ALSO UPDATE these functions to use the same key:
function removeFromCart(productId, size) {
  let cart = JSON.parse(localStorage.getItem("hoodrevenge-cart") || "[]");
  cart = cart.filter((item) => !(item.id === productId && item.size === size));
  localStorage.setItem("hoodrevenge-cart", JSON.stringify(cart));

  if (typeof loadCartItems === "function") {
    loadCartItems();
  }
  updateCartCount();
}

function updateQuantity(productId, size, newQuantity) {
  let cart = JSON.parse(localStorage.getItem("hoodrevenge-cart") || "[]");

  const itemIndex = cart.findIndex(
    (item) => item.id === productId && item.size === size,
  );

  if (itemIndex > -1) {
    if (newQuantity <= 0) {
      cart.splice(itemIndex, 1);
    } else {
      cart[itemIndex].quantity = newQuantity;
    }

    localStorage.setItem("hoodrevenge-cart", JSON.stringify(cart));

    if (typeof loadCartItems === "function") {
      loadCartItems();
    }
    updateCartCount();
  }
}

function getCartTotal() {
  const cart = JSON.parse(localStorage.getItem("hoodrevenge-cart") || "[]");
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

function getCartItemCount() {
  const cart = JSON.parse(localStorage.getItem("hoodrevenge-cart") || "[]");
  return cart.reduce((count, item) => count + item.quantity, 0);
}

// UPDATE the updateCartCount function too:
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("hoodrevenge-cart") || "[]");
  const count = cart.reduce((total, item) => total + (item.quantity || 1), 0);

  const cartCountElements = document.querySelectorAll("#cart-count");
  cartCountElements.forEach((element) => {
    element.textContent = count;
  });

  console.log(`🔢 Cart count updated to: ${count}`);
}

// ADD this to your existing cart.js
function proceedToCheckout() {
  const cart = JSON.parse(localStorage.getItem("hoodrevenge-cart") || "[]");

  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  // Store cart for checkout page
  localStorage.setItem("checkout-cart", JSON.stringify(cart));

  // Redirect to checkout
  window.location.href = "checkout.html";
}

// 🔥 FIXED: showCartNotification function - with better image detection
function showCartNotification(product) {
  console.log("🔍 Showing notification for:", product);

  // Remove existing notification
  const existingNotification = document.querySelector(".cart-notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  // 🔥 SMART IMAGE DETECTION: Try multiple methods to get the right image
  let thumbnailSrc = "";

  // Method 1: Get from the visible product image on the page
  const visibleImage = document.querySelector(".product-main-image");
  if (
    visibleImage &&
    visibleImage.src &&
    !visibleImage.src.includes("undefined")
  ) {
    thumbnailSrc = visibleImage.src;
    console.log("✅ Using visible page image:", thumbnailSrc);
  }
  // Method 2: Use product catalog
  else if (product.images && product.images.main) {
    thumbnailSrc = product.images.main;
    console.log("✅ Using catalog image:", thumbnailSrc);
  }
  // Method 3: Use catalog by product ID
  else if (PRODUCT_CATALOG[product.id]) {
    thumbnailSrc = PRODUCT_CATALOG[product.id].images.main;
    console.log("✅ Using catalog by ID:", thumbnailSrc);
  }
  // Method 4: Fallback based on product ID
  else {
    const fallbackImages = {
      1: "images/Artboard 1 copy 8.jpg",
      2: "images/Artboard 1 copy 3.jpg",
      3: "images/Artboard 1 copy 6.jpg",
      4: "images/Artboard 1.jpg",
      5: "images/Artboard 1 copy 7.jpg",
    };
    thumbnailSrc = fallbackImages[product.id] || "images/Artboard 1 copy 8.jpg";
    console.log("⚠️ Using fallback image:", thumbnailSrc);
  }

  console.log("🎯 Final thumbnail source:", thumbnailSrc);

  const notification = document.createElement("div");
  notification.className = "cart-notification";

  notification.innerHTML = `
    <div class="notification-content">
      <div class="notification-thumbnail">
        <img src="${thumbnailSrc}" 
             alt="${product.name}" 
             class="notification-image"
             onload="console.log('✅ Thumbnail loaded successfully:', this.src)"
             onerror="console.log('❌ Failed to load:', this.src); this.src='images/Artboard 1 copy 8.jpg';">
      </div>
      <div class="notification-text">
        <h4>${product.name} (Size ${product.size})</h4>
        <p>added to cart!</p>
        <small>Premium South African Streetwear</small>
      </div>
    </div>
  `;

  document.body.appendChild(notification);

  // Show with animation
  setTimeout(() => notification.classList.add("show"), 100);

  // Hide after 3 seconds
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// 🔥 UPDATED: addToCart function with better logging
function addToCart(id, name, price, images, size) {
  console.log("🛒 addToCart called with:", { id, name, price, images, size });

  // Create product object with proper structure
  const product = {
    id: id,
    name: name,
    price: price,
    images: images, // This should be the object with main, back, closeup
    size: size,
    quantity: 1,
  };

  console.log("📦 Product object created:", product);

  // Get existing cart
  let cart = JSON.parse(localStorage.getItem("hoodrevenge-cart") || "[]");

  // Check if product already exists
  const existingItem = cart.find(
    (item) => item.id === id && item.size === size,
  );

  if (existingItem) {
    existingItem.quantity += 1;
    console.log("➕ Updated existing item quantity");
  } else {
    cart.push(product);
    console.log("🆕 Added new item to cart");
  }

  // Save cart
  localStorage.setItem("hoodrevenge-cart", JSON.stringify(cart));

  // Update cart count
  updateCartCount();

  // 🔥 SHOW NOTIFICATION: with the product object that has images
  showCartNotification(product);

  console.log("✅ Cart updated, notification shown");
}

// 🔥 ENSURE: addToCart function passes images correctly
function addToCart(id, name, price, images, size) {
  console.log("🛒 addToCart called with images:", images);

  const product = {
    id: id,
    name: name,
    price: price,
    images: images, // Should be {main: 'path', back: 'path', closeup: 'path'}
    size: size,
    quantity: 1,
  };

  console.log("📦 Product object created with images:", product.images);

  // Get existing cart
  let cart = JSON.parse(localStorage.getItem("hoodrevenge-cart") || "[]");

  // Check if product already exists
  const existingItem = cart.find(
    (item) => item.id === id && item.size === size,
  );

  if (existingItem) {
    existingItem.quantity += 1;
    console.log("➕ Updated existing item quantity");
  } else {
    cart.push(product);
    console.log("🆕 Added new item to cart");
  }

  // Save cart
  localStorage.setItem("hoodrevenge-cart", JSON.stringify(cart));

  // Update cart count
  updateCartCount();

  // 🔥 SHOW NOTIFICATION: with the product object that has images
  showCartNotification(product);

  console.log("✅ Cart updated, notification shown");
}

// 🔥 EVEN BETTER: Get image from the clicked product
function showCartNotification(product) {
  console.log("🔍 Showing notification for product:", product);

  // Remove existing notifications
  const existingNotification = document.querySelector(".cart-notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  // 🔥 SMART: Find the image from the product that was just added
  let thumbnailSrc = "";

  // Find the current product image on the page
  const currentProductImage = document.querySelector(
    '.product-main-image, .hero-main img, img[alt*="REVAMP"]',
  );
  if (currentProductImage && currentProductImage.src) {
    thumbnailSrc = currentProductImage.src;
    console.log("✅ Using current product image:", thumbnailSrc);
  } else {
    // Use catalog images
    const catalogProduct = PRODUCT_CATALOG[product.id];
    thumbnailSrc =
      catalogProduct?.images?.main || "images/Artboard 1 copy 8.jpg";
    console.log("✅ Using catalog image:", thumbnailSrc);
  }

  console.log("🎯 Final thumbnail source:", thumbnailSrc);

  const notification = document.createElement("div");
  notification.className = "cart-notification";

  notification.innerHTML = `
    <div class="notification-content">
      <div class="notification-thumbnail">
        <img src="${thumbnailSrc}" 
             alt="${product.name}" 
             class="notification-image"
             onload="console.log('✅ Thumbnail loaded:', this.src)"
             onerror="console.log('❌ Failed to load:', this.src)">
      </div>
      <div class="notification-text">
        <h4>${product.name} (Size ${product.size})</h4>
        <p>added to cart!</p>
        <small>Premium South African Streetwear</small>
      </div>
    </div>
  `;

  document.body.appendChild(notification);
  setTimeout(() => notification.classList.add("show"), 100);
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// 🔥 IMPROVED QUANTITY FUNCTIONS - Replace the existing ones

// Increase quantity function
window.increaseQuantity = function (productId, size) {
  console.log("🔼 INCREASE QUANTITY CLICKED:", productId, size);

  const cartData = JSON.parse(localStorage.getItem("hoodrevenge-cart") || "[]");
  const item = cartData.find(
    (item) => item.id == productId && item.size === size,
  );

  if (item) {
    item.quantity += 1;
    console.log("✅ Increased quantity to:", item.quantity);

    // Save to localStorage
    localStorage.setItem("hoodrevenge-cart", JSON.stringify(cartData));

    // Update the display
    if (window.displayCartItems) {
      window.displayCartItems();
    }
    if (window.updateCartSummary) {
      window.updateCartSummary();
    }
    if (window.updateCartCount) {
      window.updateCartCount();
    }

    console.log("🔄 Page updated after increase");
  } else {
    console.log("❌ Item not found for increase");
  }
};

// Decrease quantity function
window.decreaseQuantity = function (productId, size) {
  console.log("🔽 DECREASE QUANTITY CLICKED:", productId, size);

  const cartData = JSON.parse(localStorage.getItem("hoodrevenge-cart") || "[]");
  const itemIndex = cartData.findIndex(
    (item) => item.id == productId && item.size === size,
  );

  if (itemIndex !== -1) {
    const item = cartData[itemIndex];

    if (item.quantity > 1) {
      item.quantity -= 1;
      console.log("✅ Decreased quantity to:", item.quantity);
    } else {
      // Remove item if quantity becomes 0
      cartData.splice(itemIndex, 1);
      console.log("🗑️ Removed item from cart (quantity was 1)");
    }

    // Save to localStorage
    localStorage.setItem("hoodrevenge-cart", JSON.stringify(cartData));

    // Update the display
    if (window.displayCartItems) {
      window.displayCartItems();
    }
    if (window.updateCartSummary) {
      window.updateCartSummary();
    }
    if (window.updateCartCount) {
      window.updateCartCount();
    }

    console.log("🔄 Page updated after decrease");
  } else {
    console.log("❌ Item not found for decrease");
  }
};

// Enhanced remove function
window.removeFromCart = function (productId, size) {
  console.log("🗑️ REMOVE CLICKED:", productId, size);

  const cartData = JSON.parse(localStorage.getItem("hoodrevenge-cart") || "[]");
  const updatedCart = cartData.filter(
    (item) => !(item.id == productId && item.size === size),
  );

  localStorage.setItem("hoodrevenge-cart", JSON.stringify(updatedCart));

  // Update the display
  if (window.displayCartItems) {
    window.displayCartItems();
  }
  if (window.updateCartSummary) {
    window.updateCartSummary();
  }
  if (window.updateCartCount) {
    window.updateCartCount();
  }

  console.log("✅ Item removed and page updated");
};

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
    `🔄 Update quantity: ID ${productId}, Size ${size}, New quantity: ${newQuantity}`
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
    (item) => item.id == productId && item.size === oldSize
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

  displayCartItems();
  updateCartSummary();

  function displayCartItems() {
    const cart = JSON.parse(localStorage.getItem("hoodrevenge-cart") || "[]");
    const cartItemsContainer = document.getElementById("cart-items");
    const emptyCartMessage = document.getElementById("empty-cart");

    console.log("Cart data loaded:", cart);

    if (!cartItemsContainer) {
      console.log("Cart container not found");
      return;
    }

    if (cart.length === 0) {
      if (emptyCartMessage) emptyCartMessage.style.display = "block";
      if (cartItemsContainer) cartItemsContainer.style.display = "none";
      return;
    }

    if (emptyCartMessage) emptyCartMessage.style.display = "none";
    if (cartItemsContainer) cartItemsContainer.style.display = "block";

    cartItemsContainer.innerHTML = cart
      .map((item) => {
        let imageUrl = "images/Artboard 1.jpg";

        if (
          item.images &&
          item.images.main &&
          item.images.main !== "undefined"
        ) {
          imageUrl = item.images.main;
        }

        const price = item.price || 650;
        const size = item.size || "M";

        return `
          <div class="cart-item" data-id="${item.id}" data-size="${size}">
            <div class="item-image">
              <img src="${imageUrl}" alt="${item.name}" class="item-img" />
            </div>
            <div class="item-details">
              <h3 class="item-name">${item.name}</h3>
              <p class="item-price">R${price}</p>
              <div class="size-selection">
                <label>Size:</label>
                <select class="size-dropdown" onchange="updateSize(${
                  item.id
                }, '${size}', this.value)">
                  <option value="XS" ${
                    size === "XS" ? "selected" : ""
                  }>XS</option>
                  <option value="S" ${size === "S" ? "selected" : ""}>S</option>
                  <option value="M" ${size === "M" ? "selected" : ""}>M</option>
                  <option value="L" ${size === "L" ? "selected" : ""}>L</option>
                  <option value="XL" ${
                    size === "XL" ? "selected" : ""
                  }>XL</option>
                  <option value="XXL" ${
                    size === "XXL" ? "selected" : ""
                  }>XXL</option>
                </select>
              </div>
            </div>
            <div class="item-actions">
              <div class="quantity-controls">
                <button class="quantity-btn" onclick="updateQuantity(${
                  item.id
                }, '${size}', ${item.quantity - 1})">−</button>
                <span class="quantity-display">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${
                  item.id
                }, '${size}', ${item.quantity + 1})">+</button>
              </div>
              <div class="item-total">R${(price * item.quantity).toFixed(
                2
              )}</div>
              <button class="remove-item" onclick="removeFromCart(${
                item.id
              }, '${size}')">REMOVE</button>
            </div>
          </div>
        `;
      })
      .join("");
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
  }

  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("hoodrevenge-cart") || "[]");
    const count = cart.reduce((total, item) => total + (item.quantity || 1), 0);

    const cartCountElements = document.querySelectorAll("#cart-count");
    cartCountElements.forEach((element) => {
      element.textContent = count;
    });

    console.log(`🔢 Cart count updated to: ${count}`);
  }

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

function addToCart(productId, productName, price, images, size = "M") {
  // USE THE SAME KEY AS THE REST OF THE FILE!
  let cart = JSON.parse(localStorage.getItem("hoodrevenge-cart") || "[]");

  // Check if product with same ID and size already exists
  const existingItemIndex = cart.findIndex(
    (item) => item.id === productId && item.size === size
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
    (item) => item.id === productId && item.size === size
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

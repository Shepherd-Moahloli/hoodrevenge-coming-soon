let cart = JSON.parse(localStorage.getItem("hoodrevenge-cart")) || [];

// Update cart count on page load
document.addEventListener("DOMContentLoaded", function () {
  updateCartCount();
});

// Add to cart functionality
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("add-to-cart")) {
    const id = e.target.dataset.id;
    const name = e.target.dataset.name;
    const price = parseFloat(e.target.dataset.price);

    addToCart(id, name, price);
    e.target.textContent = "Added!";
    setTimeout(() => {
      e.target.textContent = "Add to Cart";
    }, 1000);
  }
});

function addToCart(id, name, price) {
  const existingItem = cart.find((item) => item.id === id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: id,
      name: name,
      price: price,
      quantity: 1,
    });
  }

  localStorage.setItem("hoodrevenge-cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const countElement = document.getElementById("cart-count");
  if (countElement) {
    countElement.textContent = cartCount;
  }
}

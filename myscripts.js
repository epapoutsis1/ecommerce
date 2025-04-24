let cartCount = 0;

function addToCart() {
    cartCount++;
    updateCartCounter();
    animateCartIcon();
}

function updateCartCounter() {
    const cartCounter = document.getElementById('cart-counter');
    if (cartCounter) {
        cartCounter.textContent = cartCount;
    }
}

function animateCartIcon() {
    const cartIcon = document.getElementById('cart-icon');
    if (cartIcon) {
        cartIcon.classList.add('cart-animate');
        // Remove the animation class after it completes
        setTimeout(() => {
            cartIcon.classList.remove('cart-animate');
        }, 500); // Match the animation duration
    }
}

function showCheckoutPopup() {
    const modal = document.getElementById('checkout-modal');
    if (modal) {
        modal.style.display = 'flex'; // Show the modal
    }
}

function closeCheckoutPopup() {
    const modal = document.getElementById('checkout-modal');
    if (modal) {
        modal.style.display = 'none'; // Hide the modal
    }
}

function confirmCheckout() {
    alert('Proceeding to checkout...');
    closeCheckoutPopup(); // Close the modal after confirmation
}

document.querySelectorAll('.product-card button').forEach(btn => {
    btn.addEventListener('click', () => {
      alert("Added to cart!");
      // Later: integrate with a cart array or localStorage
    });
  });

  const products = [
    { name: "Sneakers", price: 59.99, image: "sneakers.jpg" },
    { name: "Backpack", price: 39.99, image: "backpack.jpg" }
  ];
  
  const container = document.getElementById('product-container');
  products.forEach(p => {
    container.innerHTML += `
      <div class="watch-card">
        <img src="${p.image}" alt="${p.name}">
        <h2>${p.name}</h2>
        <p>$${p.price}</p>
        <button>Add to Cart</button>
      </div>
    `;
  });
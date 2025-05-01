
let cartCount = 0;

function addToCart() {
    cartCount++; // Increment the cart count
    updateCartCounter();
}

function updateCartCounter() {
    const cartCounter = document.getElementById('cart-counter');
    if (cartCounter) {
        cartCounter.textContent = cartCount; // Update the counter in the navbar
    }
}

// Attach event listeners to all "Add to Cart" buttons
document.querySelectorAll('.btn-primary').forEach(button => {
    button.addEventListener('click', addToCart);
});

let currentProductIndex = 0;

function showProduct(index) {
    const track = document.querySelector('.carousel-track');
    const totalProducts = document.querySelectorAll('.product-card').length;

    if (!track) return;

    // Wrap around if index is out of bounds
    if (index >= totalProducts) {
        currentProductIndex = 0; // Go back to the first product
    } else if (index < 0) {
        currentProductIndex = totalProducts - 1; // Go to the last product
    } else {
        currentProductIndex = index;
    }

    // Move the carousel
    const offset = -currentProductIndex * 100; // 100% for each product
    track.style.transform = `translateX(${offset}%)`;
}

function nextProduct() {
    showProduct(currentProductIndex + 1); // Move to the next product
}

function prevProduct() {
    showProduct(currentProductIndex - 1); // Move to the previous product
}

// Add event listeners for navigation buttons
document.querySelector('.carousel-btn.next').addEventListener('click', nextProduct);
document.querySelector('.carousel-btn.prev').addEventListener('click', prevProduct);


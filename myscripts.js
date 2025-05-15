let currentProductIndex = 1; // Start at the first real product

function setupCarousel() {
    const track = document.querySelector('.carousel-track');
    const products = document.querySelectorAll('.product-card');

    if (!track || products.length === 0) return;

    // Clone the first and last product cards
    const firstClone = products[0].cloneNode(true);
    const lastClone = products[products.length - 1].cloneNode(true);

    // Add clones to the track
    track.appendChild(firstClone);
    track.insertBefore(lastClone, products[0]);

    // Adjust the track's initial position
    track.style.transform = `translateX(-${100}%)`;
}

function showProduct(index) {
    const track = document.querySelector('.carousel-track');
    const products = document.querySelectorAll('.product-card');
    const totalProducts = products.length; // Includes clones

    if (!track) return;

    // Move the carousel
    const offset = -index * 100; // 100% for each product
    track.style.transition = 'transform 0.5s ease-in-out';
    track.style.transform = `translateX(${offset}%)`;

    // Handle infinite scrolling
    track.addEventListener('transitionend', () => {
        if (index === 0) {
            // If at the cloned last product, jump to the real last product
            track.style.transition = 'none';
            track.style.transform = `translateX(-${(totalProducts - 1) * 100}%)`;
            currentProductIndex = totalProducts - 1;
        } else if (index === totalProducts - 1) {
            // If at the cloned first product, jump to the real first product
            track.style.transition = 'none';
            track.style.transform = `translateX(-${100}%)`;
            currentProductIndex = 1;
        }
    }, { once: true }); // Ensure the event listener is only triggered once
}

function nextProduct() {
    const products = document.querySelectorAll('.product-card');
    const totalProducts = products.length; // Includes clones

    currentProductIndex++;
    if (currentProductIndex >= totalProducts) {
        currentProductIndex = 1; // Reset to the real first product
    }
    showProduct(currentProductIndex);
}

function prevProduct() {
    const products = document.querySelectorAll('.product-card');
    const totalProducts = products.length; // Includes clones

    currentProductIndex--;
    if (currentProductIndex < 0) {
        currentProductIndex = totalProducts - 1; // Reset to the real last product
    }
    showProduct(currentProductIndex);
}

// Initialize the carousel
setupCarousel();

// Add event listeners for navigation buttons
document.querySelector('.carousel-btn.next').addEventListener('click', nextProduct);
document.querySelector('.carousel-btn.prev').addEventListener('click', prevProduct);
// Sample product categories for search
const productCategories = ["watches", "shoes", "bags", "electronics", "clothing"];

function handleSearch(event) {
    event.preventDefault(); // Prevent form submission

    const searchInput = document.getElementById("search-input").value.trim().toLowerCase();

    // Perform basic spell check and find the closest match
    const matchedCategory = findClosestMatch(searchInput, productCategories);

    if (matchedCategory) {
        // Redirect to the search results page with the query as a parameter
        window.location.href = `search-results.html?query=${matchedCategory}`;
    } else {
        alert("No matching products found. Please try again.");
    }
}

// Attach event listener to the search form
document.getElementById("search-form").addEventListener("submit", handleSearch);

// Function to find the closest match using Levenshtein distance
function findClosestMatch(query, categories) {
    let closestMatch = null;
    let smallestDistance = Infinity;

    categories.forEach(category => {
        const distance = levenshteinDistance(query, category);
        if (distance < smallestDistance) {
            smallestDistance = distance;
            closestMatch = category;
        }
    });

    // Return the closest match if the distance is within a reasonable threshold
    return smallestDistance <= 3 ? closestMatch : null;
}

// Levenshtein distance algorithm for spell checking
function levenshteinDistance(a, b) {
    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // Substitution
                    matrix[i][j - 1] + 1,     // Insertion
                    matrix[i - 1][j] + 1      // Deletion
                );
            }
        }
    }

    return matrix[b.length][a.length];
}

let cart = []; // Array to store cart items

function addToCart(productName) {
    if (!cart.includes(productName)) {
        cart.push(productName);
        alert(`${productName} has been added to your cart.`);
        updateCartCounter();
    } else {
        alert(`${productName} is already in your cart.`);
    }
}

function removeFromCart(productName) {
    const index = cart.indexOf(productName);
    if (index !== -1) {
        cart.splice(index, 1);
        alert(`${productName} has been removed from your cart.`);
        updateCartCounter();
    } else {
        alert(`${productName} is not in your cart.`);
    }
}

function updateCartCounter() {
    const cartCounter = document.getElementById("cart-counter");
    cartCounter.textContent = cart.length; // Update the cart counter
}
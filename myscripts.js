
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


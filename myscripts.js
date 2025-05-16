let currentProductIndex = 1; // Start at the first real product

function isMobile() {
    return window.innerWidth <= 900;
}

// Desktop: Setup infinite loop carousel with clones
function setupCarousel() {
    const track = document.querySelector('.carousel-track');
    if (!track) return;

    // Remove previous clones
    track.querySelectorAll('.clone').forEach(node => node.remove());

    if (isMobile()) {
        // On mobile: no clones, no transform, no transition
        track.style.transition = 'none';
        track.style.transform = 'none';
        return;
    }

    // Get original product cards (not clones)
    let products = Array.from(track.children).filter(el => !el.classList.contains('clone'));

    // Clone first and last for infinite loop
    if (products.length > 1) {
        const firstClone = products[0].cloneNode(true);
        const lastClone = products[products.length - 1].cloneNode(true);
        firstClone.classList.add('clone');
        lastClone.classList.add('clone');
        track.appendChild(firstClone);
        track.insertBefore(lastClone, products[0]);
    }

    // Now select all cards including clones
    currentProductIndex = 1;
    track.style.transition = 'none';
    track.style.transform = `translateX(-100%)`;
    void track.offsetWidth; // Force reflow
    track.style.transition = 'transform 0.5s ease-in-out';
}

function showProduct(index) {
    if (isMobile()) return; // No JS scroll on mobile

    const track = document.querySelector('.carousel-track');
    const products = track.querySelectorAll('.product-card');
    const totalProducts = products.length;

    if (!track) return;

    const offset = -index * 100;
    track.style.transition = 'transform 0.5s ease-in-out';
    track.style.transform = `translateX(${offset}%)`;

    track.addEventListener('transitionend', function handler() {
        if (index === 0) {
            track.style.transition = 'none';
            track.style.transform = `translateX(-${(totalProducts - 2) * 100}%)`;
            currentProductIndex = totalProducts - 2;
        } else if (index === totalProducts - 1) {
            track.style.transition = 'none';
            track.style.transform = `translateX(-100%)`;
            currentProductIndex = 1;
        }
        track.removeEventListener('transitionend', handler);
    });
}

function nextProduct() {
    if (isMobile()) return;
    const track = document.querySelector('.carousel-track');
    const products = track.querySelectorAll('.product-card');
    const totalProducts = products.length;
    currentProductIndex++;
    if (currentProductIndex >= totalProducts) {
        currentProductIndex = 1;
    }
    showProduct(currentProductIndex);
}

function prevProduct() {
    if (isMobile()) return;
    const track = document.querySelector('.carousel-track');
    const products = track.querySelectorAll('.product-card');
    const totalProducts = products.length;
    currentProductIndex--;
    if (currentProductIndex < 0) {
        currentProductIndex = totalProducts - 1;
    }
    showProduct(currentProductIndex);
}

// For mobile: native swipe only, no arrow buttons, no clones, no loop
function scrollCarouselBy(direction) {
    const carousel = document.querySelector('.product-carousel');
    const cards = document.querySelectorAll('.carousel-track .product-card');
    if (!carousel || !cards.length) return;

    // Find the card closest to the left edge
    let closestIndex = 0;
    let minDiff = Infinity;
    const carouselRect = carousel.getBoundingClientRect();
    cards.forEach((card, i) => {
        const diff = Math.abs(card.getBoundingClientRect().left - carouselRect.left);
        if (diff < minDiff) {
            minDiff = diff;
            closestIndex = i;
        }
    });

    let newIndex = closestIndex + direction;
    if (newIndex < 0) newIndex = 0;
    if (newIndex > cards.length - 1) newIndex = cards.length - 1;

    const card = cards[newIndex];
    const left = card.offsetLeft - (carousel.offsetWidth - card.offsetWidth) / 2;
    carousel.scrollTo({ left, behavior: 'smooth' });
}

// Attach correct event listeners based on device
function setupCarouselEvents() {
    const nextBtn = document.querySelector('.carousel-btn.next');
    const prevBtn = document.querySelector('.carousel-btn.prev');

    if (nextBtn) nextBtn.onclick = null;
    if (prevBtn) prevBtn.onclick = null;

    if (isMobile()) {
        // Swipe only: hide buttons via CSS, but if you want tap-to-scroll, uncomment below:
        // if (nextBtn) nextBtn.onclick = () => scrollCarouselBy(1);
        // if (prevBtn) prevBtn.onclick = () => scrollCarouselBy(-1);
    } else {
        if (nextBtn) nextBtn.onclick = nextProduct;
        if (prevBtn) prevBtn.onclick = prevProduct;
    }
}

// Initialize the carousel and events on load and resize
window.addEventListener('DOMContentLoaded', () => {
    setupCarousel();
    setupCarouselEvents();
    if (!isMobile()) showProduct(currentProductIndex);
});
window.addEventListener('resize', () => {
    setupCarousel();
    setupCarouselEvents();
    if (!isMobile()) showProduct(currentProductIndex);
});

// --- Search and Cart Logic (unchanged) ---

const productCategories = ["watches", "shoes", "bags", "electronics", "clothing"];

function handleSearch(event) {
    event.preventDefault();
    const searchInput = document.getElementById("search-input").value.trim().toLowerCase();
    const matchedCategory = findClosestMatch(searchInput, productCategories);

    if (matchedCategory) {
        window.location.href = `search-results.html?query=${matchedCategory}`;
    } else {
        alert("No matching products found. Please try again.");
    }
}

document.getElementById("search-form").addEventListener("submit", handleSearch);

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
    return smallestDistance <= 3 ? closestMatch : null;
}

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
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }
    return matrix[b.length][a.length];
}

let cart = [];

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
    cartCounter.textContent = cart.length;
}
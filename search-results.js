// Sample product data
const products = [
    { name: "Luxury Watch", category: "watches", price: "$299", image: "watch.jpg" },
    { name: "Running Shoes", category: "shoes", price: "$99", image: "shoes1.png" },
    { name: "Leather Bag", category: "bags", price: "$199", image: "bag1.png" },
    { name: "Smartphone", category: "electronics", price: "$699", image: "phone1.png" },
    { name: "T-Shirt", category: "clothing", price: "$29", image: "shirt1.png" }
];

// Get the query parameter from the URL
const urlParams = new URLSearchParams(window.location.search);
const query = urlParams.get("query");

// Filter products based on the query
const filteredProducts = products.filter(product => product.category === query);

// Display the results
const resultsContainer = document.getElementById("results-container");

if (filteredProducts.length > 0) {
    filteredProducts.forEach(product => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");

        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h2>${product.name}</h2>
            <p>${product.price}</p>
            <button class="btn-primary" onclick="addToCart()">Add to Cart</button>
        `;

        resultsContainer.appendChild(productCard);
    });
} else {
    resultsContainer.innerHTML = "<p>No products found for your search.</p>";
}
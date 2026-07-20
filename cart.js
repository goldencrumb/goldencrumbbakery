// Keep track of cart items
let cart = {};

// 1. Render Products to the Screen safely (preventing XSS)
function renderProducts() {
    const productList = document.getElementById('product-list');
    
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        // Build the inner HTML structure safely
        card.innerHTML = `
            <img src="images/${product.image}" alt="${product.name}" onerror="this.src='images/placeholder.jpeg'">
            <div class="card-content">
                <h3 class="product-title"></h3>
                <p class="product-weight"></p>
                <div class="price">₹${product.price}</div>
                <div class="quantity-selector">
                    <button class="qty-btn minus" onclick="updateCart(${product.id}, -1)">-</button>
                    <span class="qty-count" id="qty-${product.id}">0</span>
                    <button class="qty-btn plus" onclick="updateCart(${product.id}, 1)">+</button>
                </div>
            </div>
        `;
        
        // Securely inject text content to prevent XSS vulnerabilities
        card.querySelector('.product-title').textContent = product.name;
        card.querySelector('.product-weight').textContent = product.weight;
        
        productList.appendChild(card);
    });
}

// 2. Handle Cart Updates
function updateCart(productId, change) {
    if (!cart[productId]) {
        cart[productId] = 0;
    }
    
    cart[productId] += change;
    
    // Prevent negative quantities
    if (cart[productId] < 0) {
        cart[productId] = 0;
    }
    
    // Update the number shown on the product card
    document.getElementById(`qty-${productId}`).textContent = cart[productId];
    
    // Update the bottom sticky bar
    updateCartUI();
}

// 3. Update the Bottom Sticky Bar
function updateCartUI() {
    let totalItems = 0;
    let totalPrice = 0;
    
    for (const [id, quantity] of Object.entries(cart)) {
        if (quantity > 0) {
            const product = products.find(p => p.id == id);
            totalItems += quantity;
            totalPrice += (product.price * quantity);
        }
    }
    
    const cartBar = document.getElementById('cartBar');
    document.getElementById('cartSummary').textContent = `${totalItems} item${totalItems !== 1 ? 's' : ''} selected`;
    document.getElementById('cartTotal').textContent = `₹${totalPrice}`;
    
    // Show or hide the cart bar
    if (totalItems > 0) {
        cartBar.classList.add('active');
    } else {
        cartBar.classList.remove('active');
    }
}

// 4. Secure WhatsApp Checkout (Tamper-Proof Method)
document.getElementById('whatsappCheckout').addEventListener('click', () => {
    // Replace this with your actual business WhatsApp number (include country code, no + or spaces)
    const phoneNumber = "919876543210"; 
    
    let orderDetails = "Hi Golden Crumb, I would like to place an order from your website:\n\n";
    
    for (const [id, quantity] of Object.entries(cart)) {
        if (quantity > 0) {
            const product = products.find(p => p.id == id);
            // Notice we do NOT include the price here to prevent browser console tampering
            orderDetails += `- ${quantity} x ${product.name} (${product.weight})\n`;
        }
    }
    
    orderDetails += "\nPlease confirm availability and share the final bill & UPI details.";
    
    // Create the WhatsApp link
    const encodedMessage = encodeURIComponent(orderDetails);
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // Open WhatsApp in a new tab
    window.open(whatsappURL, '_blank');
});

// Initialize the page by rendering the products
window.onload = renderProducts;
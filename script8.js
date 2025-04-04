document.addEventListener('DOMContentLoaded', function() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const buyNowItem = JSON.parse(localStorage.getItem('buyNowItem'));
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    localStorage.setItem('cartCount', cartCount);
    const cartLink = document.getElementById('cart-link');
    cartLink.innerHTML = `CART <span class="cart-count">${cartCount}</span>`;

    const productPreview = document.querySelector('.product-preview');
    productPreview.innerHTML = '';

    const isBuyNowCheckout = window.location.search.includes('buyNow=true');
    let subtotal = 0;

    if (isBuyNowCheckout && buyNowItem) {
        // Handle Buy Now Item
        const priceValue = parseFloat(buyNowItem.price.replace(/[^\d.]/g, ''));
        subtotal = priceValue;

        productPreview.innerHTML = `
            <div class="product-details">
                <img src="${buyNowItem.img}" alt="${buyNowItem.name}">
                <div class="item-info">
                    <h3>${buyNowItem.name}</h3>
                    <p class="product-price">₱${priceValue.toFixed(2)}</p>
                    <p class="quantity">Quantity: 1</p>
                    <p class="item-total">Item Total: ₱${priceValue.toFixed(2)}</p>
                </div>
            </div>
        `;
    } else {
        // Handle Cart Items
        if (cart.length === 0) {
            productPreview.innerHTML = `
                <div class="empty-cart">
                    <img src="EmptyCart.png" alt="Empty Cart" style="width: 150px;">
                    <h3>Your cart is empty</h3>
                    <a href="index2.html" class="shop-now-btn">Shop Now</a>
                </div>
            `;
            document.querySelector('.order-total').style.display = 'none';
            return;
        }

        cart.forEach(item => {
            const priceValue = parseFloat(item.price.replace(/[^\d.]/g, ''));
            const itemTotal = priceValue * item.quantity;
            subtotal += itemTotal;

            const itemElement = document.createElement('div');
            itemElement.className = 'product-details';
            itemElement.innerHTML = `
                <img src="${item.img}" alt="${item.name}">
                <div class="item-info">
                    <h3>${item.name}</h3>
                    <p class="product-price">₱${priceValue.toFixed(2)}</p>
                    <p class="quantity">Quantity: ${item.quantity}</p>
                    <p class="item-total">Item Total: ₱${itemTotal.toFixed(2)}</p>
                </div>
            `;
            productPreview.appendChild(itemElement);
        });
    }

    document.getElementById('subtotal').textContent = `₱${subtotal.toFixed(2)}`;

    // Check if voucher was applied
    const voucherApplied = localStorage.getItem("voucherApplied") === "true";
    let finalTotal = subtotal;
    let usedVoucher = localStorage.getItem("usedVoucher");

    if (voucherApplied) {
        const discountPercent = parseInt(localStorage.getItem("discountPercent") || "0");
        const discountAmount = subtotal * (discountPercent / 100);
        finalTotal = subtotal - discountAmount;

        // Show discount row
        document.getElementById("discount-row").style.display = "flex";
        document.getElementById("discount-amount").textContent = `-₱${discountAmount.toFixed(2)}`;
        
        // Update total
        document.getElementById('total').textContent = `₱${finalTotal.toFixed(2)}`;
    } else {
        // If no discount, total equals subtotal
        document.getElementById('total').textContent = `₱${subtotal.toFixed(2)}`;
        finalTotal = subtotal;
    }


    document.querySelector('.place-order-btn').addEventListener('click', function(e) {
        e.preventDefault();

        // Validate required fields
        const requiredFields = ['name', 'email', 'phone', 'address'];
        const isValid = requiredFields.every(field => {
            const input = document.getElementById(field);
            return input.value.trim() !== '';
        });

        if (!isValid) {
            alert('Please fill in all required fields');
            return;
        }

        // Validate email format
        const emailInput = document.getElementById('email');
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(emailInput.value)) {
            alert('Please enter a valid email address');
            emailInput.focus();
            return;
        }

        // Validate phone number format (11 digits)
        const phoneInput = document.getElementById('phone');
        const phoneRegex = /^[0-9]{11}$/;
        if (!phoneRegex.test(phoneInput.value)) {
            alert('Please enter a valid 11-digit phone number');
            phoneInput.focus();
            return;
        }

        const purchaseHistory = JSON.parse(localStorage.getItem('purchaseHistory')) || [];
        const purchaseDetails = {
            date: new Date().toISOString(),
            items: isBuyNowCheckout ? [buyNowItem] : cart,
            total: finalTotal, // Use finalTotal which accounts for discounts
            subtotal: subtotal,
            discount: voucherApplied ? (subtotal * parseInt(localStorage.getItem("discountPercent") || "0") / 100) : 0,
            orderStatus: 'Processing',
            voucherUsed: voucherApplied ? usedVoucher : null,
            customerInfo: {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                paymentMethod: document.querySelector('input[name="payment"]:checked').value
            }
        };
        purchaseHistory.push(purchaseDetails);
        localStorage.setItem('purchaseHistory', JSON.stringify(purchaseHistory));
        localStorage.setItem('lastOrderDetails', JSON.stringify(purchaseDetails));

        if (isBuyNowCheckout) {
            localStorage.removeItem('buyNowItem');
        } else {
            localStorage.removeItem('cart');
        }

        // Create success notification with View Receipt button
        const overlay = document.createElement('div');
        overlay.className = 'success-overlay';

        const notification = document.createElement('div');
        notification.className = 'purchase-success';
        notification.innerHTML = `
            <div class="success-icon"></div>
            <h3>Payment Successful!</h3>
            <p>Thank you for shopping with Class Craft</p>
            <div class="notification-buttons">
                <button class="view-receipt-btn" onclick="showReceiptModal()">
                    View Receipt
                    <span class="btn-icon">🧾</span>
                </button>
                <button class="continue-shopping-btn" onclick="window.location.href='index2.html'">
                    Continue Shopping
                    <span class="btn-icon">→</span>
                </button>
            </div>
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(notification);
        
        // Don't automatically redirect, let user choose to view receipt or continue shopping
    });
});

// Receipt Modal Function
function showReceiptModal() {
    const modal = document.getElementById('receipt-modal');
    if (!modal) return; // Guard clause in case modal doesn't exist
    
    modal.style.display = 'block';
    
    // Get the last order details from localStorage
    const orderDetails = JSON.parse(localStorage.getItem('lastOrderDetails'));
    if (!orderDetails) return;
    
    // Set date
    const orderDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    document.getElementById('receipt-date').textContent = `Date: ${orderDate}`;
    
    // Set shipping information
    document.getElementById('receipt-name').textContent = `Name: ${orderDetails.customerInfo.name}`;
    document.getElementById('receipt-email').textContent = `Email: ${orderDetails.customerInfo.email}`;
    document.getElementById('receipt-phone').textContent = `Phone: ${orderDetails.customerInfo.phone}`;
    document.getElementById('receipt-address').textContent = `Address: ${orderDetails.customerInfo.address}`;
    
    // Set payment method
    document.getElementById('receipt-payment-method').textContent = 
        orderDetails.customerInfo.paymentMethod === 'cod' ? 'Cash on Delivery' : 'GCash';
    
    // Set items
    const itemsList = document.getElementById('receipt-items-list');
    itemsList.innerHTML = '';
    
    orderDetails.items.forEach(item => {
        const priceValue = parseFloat(item.price.replace(/[^\d.]/g, ''));
        const itemTotal = priceValue * (item.quantity || 1);
        
        const itemElement = document.createElement('div');
        itemElement.className = 'receipt-item';
        itemElement.innerHTML = `
            <div class="receipt-item-left">
                <img src="${item.img}" alt="${item.name}">
                <div>
                    <p>${item.name}</p>
                    <p class="item-quantity">Qty: ${item.quantity || 1} x ₱${priceValue.toFixed(2)}</p>
                </div>
            </div>
            <div class="receipt-item-right">
                <p>₱${itemTotal.toFixed(2)}</p>
            </div>
        `;
        itemsList.appendChild(itemElement);
    });
    
    // Set totals
    document.getElementById('receipt-subtotal').textContent = `₱${orderDetails.subtotal.toFixed(2)}`;
    
    if (orderDetails.discount > 0) {
        document.getElementById('receipt-discount-row').style.display = 'flex';
        document.getElementById('receipt-discount').textContent = `-₱${orderDetails.discount.toFixed(2)}`;
    } else {
        document.getElementById('receipt-discount-row').style.display = 'none';
    }
    document.getElementById('receipt-total').textContent = `₱${orderDetails.total.toFixed(2)}`;
    
    // Print receipt functionality
    document.getElementById('print-receipt-btn').addEventListener('click', function() {
        printReceipt();
    });
}

// Function to print receipt directly
function printReceipt() {
    window.print();
}

function closeReceiptModal() {
    const modal = document.getElementById('receipt-modal');
    if (modal) {
        modal.style.display = 'none';
        
        // Redirect to shop after closing receipt
        window.location.href = 'index2.html';
    }
}
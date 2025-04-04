document.addEventListener("DOMContentLoaded", function () {
    // Add check all functionality
    const checkAllBox = document.getElementById('check-all');
    if (checkAllBox) {
        checkAllBox.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.cart-item-checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
                checkbox.closest('.cart-item').classList.toggle('unchecked', !this.checked);
            });
            updateTotal();
        });
    }

    // Update cart display
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    localStorage.setItem("cartCount", cartCount);
    const cartLink = document.getElementById('cart-link');
    cartLink.innerHTML = `CART <span class="cart-count">${cartCount}</span>`;

    // Update selected products in checkout form
    const selectedProducts = document.getElementById('selected-products');
    if (selectedProducts) {
        let total = 0;
        selectedProducts.innerHTML = '<h3>Selected Products:</h3>';

        cart.forEach((item, index) => {
            const productCheckbox = document.createElement('div');
            productCheckbox.className = 'product-checkbox';
            const itemPrice = parseFloat(item.price.replace('₱', ''));
            const itemTotal = itemPrice * item.quantity;

            productCheckbox.innerHTML = `
                <input type="checkbox" id="product-${index}" name="product[]" checked>
                <label for="product-${index}">
                    <span class="product-name">${item.name}</span>
                    <span class="product-details">₱${itemPrice.toFixed(2)} × ${item.quantity} = ₱${itemTotal.toFixed(2)}</span>
                </label>
            `;
            selectedProducts.appendChild(productCheckbox);

            const checkbox = productCheckbox.querySelector(`#product-${index}`);
            checkbox.addEventListener('change', function() {
                updateTotal();
                this.closest('.product-checkbox').classList.toggle('unchecked');
            });

            if(checkbox.checked) {
                total += itemTotal;
            }
        });

        // Add total display div if not exists
        let totalDisplay = document.getElementById('products-total');
        if (!totalDisplay) {
            totalDisplay = document.createElement('div');
            totalDisplay.id = 'products-total';
            totalDisplay.className = 'total-display';
            selectedProducts.appendChild(totalDisplay);
        }
        totalDisplay.textContent = `Total: ₱${total.toFixed(2)}`;
    }

    function updateTotal() {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        let total = 0;
        const checkedProducts = document.querySelectorAll('.product-checkbox input:checked');

        checkedProducts.forEach(checkbox => {
            const productId = checkbox.id.split('-')[1];
            const item = cart[productId];
            const itemPrice = parseFloat(item.price.replace('₱', ''));
            total += itemPrice * item.quantity;
        });

        document.getElementById('subtotal-amount').textContent = `₱${total.toFixed(2)}`;
        document.getElementById('total-amount').textContent = `₱${total.toFixed(2)}`;
        document.getElementById('total-price').textContent = total.toFixed(2);
    }

    // Check if user is logged in
    let user = JSON.parse(localStorage.getItem("loggedInUser"));
    const dashboardLink = document.querySelector("#dashboard-link");
    const dashboardPic = document.getElementById("dashboard-pic");

    if (user) {
        let firstName = user.name.split(" ")[0];
        dashboardLink.textContent = `Hi, ${firstName}`;
        dashboardLink.href = "dashboard.html";

        if (user.profilePic) {
            dashboardPic.src = user.profilePic;
        }
    }

    // Display cart items and total here
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartContainer = document.getElementById('cart-items');
    let total = 0;

    let subtotal = 0;
    cartItems.forEach((item, index) => {
        const itemPrice = parseFloat(item.price.replace('₱', ''));
        const itemTotal = itemPrice * item.quantity;
        subtotal += itemTotal;
        total = subtotal;
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <div class="cart-item-content">
                <img src="${item.img}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p class="item-price">₱${itemPrice.toFixed(2)}</p>
                    <div class="quantity-controls">
                        <button onclick="updateQuantity(${index}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${index}, 1)">+</button>
                    </div>
                    <button class="remove-btn" onclick="removeItem(${index})">Remove Item</button>
                </div>
                <div class="cart-item-total">
                    <p>Total: ₱${itemTotal.toFixed(2)}</p>
                </div>
            </div>
        `;
        cartContainer.appendChild(itemElement);
    });

    document.getElementById('total-price').textContent = subtotal.toFixed(2);
    document.getElementById('total').textContent = `₱${total.toFixed(2)}`;

    function removeItem(index) {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const itemName = cart[index].name;

        if (confirm(`Are you sure you want to remove "${itemName}" from your cart?`)) {
            cart.splice(index, 1);
            localStorage.setItem("cart", JSON.stringify(cart));

            // Animate removal
            const itemElement = document.querySelectorAll('.cart-item')[index];
            itemElement.style.transition = 'all 0.3s ease';
            itemElement.style.transform = 'translateX(100%)';
            itemElement.style.opacity = '0';

            setTimeout(() => {
                updateCartUI();
            }, 300);
        }
    }

    function updateQuantity(index, change) {
      let cartItems = JSON.parse(localStorage.getItem('cartItems'));
      cartItems[index].quantity += change;
      if (cartItems[index].quantity <= 0) {
        cartItems.splice(index, 1);
      }
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      location.reload();
    }

    function updateCartUI() {
        const cartContainer = document.getElementById('cart-items');
        cartContainer.innerHTML = ''; // Clear existing cart items

        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        let subtotal = 0;
        cartItems.forEach((item, index) => {
            const itemPrice = parseFloat(item.price.replace('₱', ''));
            const itemTotal = itemPrice * item.quantity;
            subtotal += itemTotal;
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <div class="cart-item-content">
                    <img src="${item.img}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h3>${item.name}</h3>
                        <p class="item-price">₱${itemPrice.toFixed(2)}</p>
                        <div class="quantity-controls">
                            <button onclick="updateQuantity(${index}, -1)">-</button>
                            <button class="remove-btn" onclick="removeItem(${index})">×</button>
                            <span>${item.quantity}</span>
                            <button onclick="updateQuantity(${index}, 1)">+</button>
                        </div>
                    </div>
                    <div class="cart-item-total">
                        <p>Total: ₱${itemTotal.toFixed(2)}</p>
                    </div>
                </div>
            `;
            cartContainer.appendChild(itemElement);
        });

        document.getElementById('total-price').textContent = subtotal.toFixed(2);
        document.getElementById('total').textContent = `₱${subtotal.toFixed(2)}`;
    }
});
// Notification system
function showCustomNotification(options) {
    // Default options
    const defaultOptions = {
        title: '',
        message: 'Notification',
        type: 'default', // default, success, error, warning, info
        duration: 5000,
        position: 'top-center', // top-center, top-right, top-left, bottom-center, bottom-right, bottom-left
        closable: true,
        icon: '🔔',
        progressBar: true,
        onClose: null
    };

    // Merge default options with provided options
    const settings = {...defaultOptions, ...options};

    // Create notification container if it doesn't exist
    let notificationContainer = document.querySelector('.notification-container');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        notificationContainer.style.position = 'fixed';
        notificationContainer.style.zIndex = '9999';
        document.body.appendChild(notificationContainer);
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `custom-notification ${settings.type}`;
    
    // Set icons based on type
    let icon = settings.icon;
    if (settings.type === 'success') icon = '✓';
    else if (settings.type === 'error') icon = '✕';
    else if (settings.type === 'warning') icon = '⚠';
    else if (settings.type === 'info') icon = 'ℹ';

    // Create notification content
    notification.innerHTML = `
        <div class="notification-icon-wrapper">
            <span class="notification-icon">${icon}</span>
        </div>
        <div class="notification-content">
            ${settings.title ? `<h4 class="notification-title">${settings.title}</h4>` : ''}
            <p class="notification-message">${settings.message}</p>
        </div>
        ${settings.closable ? `<span class="notification-close">&times;</span>` : ''}
        ${settings.progressBar ? `<div class="notification-progress"></div>` : ''}
    `;

    // Add notification to container
    notificationContainer.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
        
        // Add progress bar animation if enabled
        if (settings.progressBar) {
            const progressBar = notification.querySelector('.notification-progress');
            progressBar.style.animation = `progress ${settings.duration / 1000}s linear forwards`;
        }
    }, 10);

    // Set up close behavior
    const closeNotification = () => {
        notification.classList.remove('show');
        
        // Call onClose callback if provided
        if (typeof settings.onClose === 'function') {
            settings.onClose();
        }
        
        // Remove element after animation completes
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            
            // Remove container if it's empty
            if (notificationContainer.children.length === 0) {
                document.body.removeChild(notificationContainer);
            }
        }, 400);
    };

    // Set up close button event listener
    if (settings.closable) {
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', closeNotification);
    }

    // Auto close after duration
    if (settings.duration > 0) {
        setTimeout(closeNotification, settings.duration);
    }

    // Close on click away
    notification.addEventListener('click', (e) => {
        if (e.target.closest('.notification-close')) return;
        closeNotification();
    });

    // Return notification element and close function
    return {
        element: notification,
        close: closeNotification
    };
}

// Example usage:
// showCustomNotification({
//     title: 'Success!',
//     message: 'Your item has been added to cart.',
//     type: 'success',
//     duration: 5000
// });

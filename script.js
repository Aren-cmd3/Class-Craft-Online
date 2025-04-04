// Notification function
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === 'success' ? '✅' : '❌'}</span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => notification.classList.add('show'), 100);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

document.addEventListener('DOMContentLoaded', function() {
    // Check login status and update UI
    let user = JSON.parse(localStorage.getItem("loggedInUser"));
    const cartContainer = document.getElementById('cart-container');
    const loginNavLink = document.querySelector("#dashboard-link");
    const dashboardPic = document.getElementById("dashboard-pic");
    const featuresSection = document.getElementById("features-section");

    if (user) {
        cartContainer.style.display = 'block';
        const firstName = user.name.split(' ')[0];

        // Update profile picture and link
        dashboardPic.src = user.profilePic || 'default-avatar.png';
        loginNavLink.href = 'dashboard.html';
        loginNavLink.textContent = `Hi, ${firstName}`;

    // Update purchase feed
    function updatePurchaseFeed() {
        const purchaseFeed = document.getElementById('purchase-feed');
        const purchaseHistory = JSON.parse(localStorage.getItem('purchaseHistory')) || [];

        if (purchaseHistory.length === 0) {
            purchaseFeed.innerHTML = '<p>No recent purchases</p>';
            return;
        }

        const recentPurchases = purchaseHistory.slice(0, 5); // Show only 5 most recent
        purchaseFeed.innerHTML = recentPurchases.map(purchase => `
            <div class="purchase-item">
                <img src="${purchase.items[0].img}" alt="${purchase.items[0].name}">
                <div class="purchase-info">
                    <div class="buyer-name">${user ? user.name.split(' ')[0] : 'Anonymous'}</div>
                    <strong>${purchase.items[0].name}${purchase.items.length > 1 ? ` + ${purchase.items.length - 1} more items` : ''}</strong>
                    <div>Total: ₱${purchase.total.toFixed(2)}</div>
                    <div class="purchase-time">${new Date(purchase.date).toLocaleString()}</div>
                </div>
            </div>
        `).join('');
    }

    // Update feed every 30 seconds
    updatePurchaseFeed();
    setInterval(updatePurchaseFeed, 30000);

    // Scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in, .slide-in').forEach((el) => observer.observe(el));
    // Update login buttons and cart
        document.querySelectorAll(".login-btn").forEach(button => {
            button.textContent = `Hi, ${firstName}`;
            button.onclick = () => window.location.href = "dashboard.html";
        });
    } else {
        // Set default login state
        document.querySelectorAll(".login-btn, #dashboard-link").forEach(button => {
            button.textContent = "Login";
            button.onclick = () => window.location.href = "index3.html";
        });
    }

    // Update cart count
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    localStorage.setItem('cartCount', cartCount);
    const cartLink = document.getElementById('cart-link');
    cartLink.innerHTML = `CART <span class="cart-count">${cartCount}</span>`;

    // Shop button and navigation handlers
    const shopButton = document.querySelector(".shop-btn");
    if (shopButton) {
        shopButton.addEventListener("click", () => {
            window.location.href = "index2.html";
        });
    }

    // Protect cart access
    document.querySelector('a[href="index4.html"]').addEventListener("click", function(e) {
        if (!user) {
            e.preventDefault();
            alert("Please login first to access cart!");
            window.location.href = "index3.html";
        }
    });
});
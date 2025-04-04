document.addEventListener("DOMContentLoaded", function() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    localStorage.setItem('cartCount', cartCount);
    const cartLink = document.getElementById('cart-link');
    cartLink.innerHTML = `CART <span class="cart-count">${cartCount}</span>`;
    let user = JSON.parse(localStorage.getItem("loggedInUser"));
    let addressList = JSON.parse(localStorage.getItem("addresses")) || [];

    if (!user) {
        window.location.href = "index3.html"; 
        return;
    }

    // Calculate order statistics
    const purchaseHistory = JSON.parse(localStorage.getItem('purchaseHistory')) || [];
    const totalOrders = purchaseHistory.length;
    const totalSpent = purchaseHistory.reduce((sum, purchase) => sum + purchase.total, 0);

    // Update stats display and add click events
    const statsCards = document.querySelectorAll('.stat-card');

    // Total Orders
    document.querySelectorAll('.stat-card .stat-number')[0].textContent = totalOrders;
    statsCards[0].addEventListener('click', () => showHistoryModal());

    // Total Spent
    document.querySelectorAll('.stat-card .stat-number')[1].textContent = `₱${totalSpent.toFixed(2)}`;
    statsCards[1].addEventListener('click', () => showHistoryModal());
    
    // Update order status cards
    const orderStatuses = {
        'Processing': 0,
        'In Transit': 0,
        'Delivered': 0,
        'Cancelled': 0
    };
    
    // Count orders by status
    purchaseHistory.forEach(order => {
        if (orderStatuses.hasOwnProperty(order.orderStatus)) {
            orderStatuses[order.orderStatus]++;
        }
    });
    
    // Update status cards with counts
    document.querySelector('.to-ship .status-number').textContent = orderStatuses['Processing'] || 0;
    document.querySelector('.to-receive .status-number').textContent = orderStatuses['In Transit'] || 0;
    document.querySelector('.to-complete .status-number').textContent = orderStatuses['Delivered'] || 0;
    document.querySelector('.cancelled .status-number').textContent = orderStatuses['Cancelled'] || 0;

    function showHistoryModal() {
        document.getElementById('history-modal').style.display = 'block';
    }

    function closeHistoryModal() {
        document.getElementById('history-modal').style.display = 'none';
    }

    window.closeHistoryModal = closeHistoryModal;

    // Calculate total reward points from purchase history
    const totalRewardPoints = purchaseHistory.reduce((total, purchase) => {
        return total + (purchase.total * 0.001); // 0.1% reward points per purchase
    }, 0);

    // Update reward points display
    document.querySelectorAll('.stat-number')[2].textContent = totalRewardPoints.toFixed(2);

    // Orders functionality removed

    // Display purchase history
    const purchaseList = document.getElementById('purchase-history-list');
    purchaseHistory.reverse().forEach(purchase => {
        purchase.items.forEach(item => {
            const purchaseDate = new Date(purchase.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            const purchaseItem = document.createElement('div');
            purchaseItem.className = 'purchase-item';
            const itemPrice = parseFloat(item.price.replace('₱', ''));
            const itemTotal = itemPrice * item.quantity;
            purchaseItem.innerHTML = `
                <img src="${item.img}" alt="${item.name}" style="width: 100px; height: 100px; object-fit: cover;">
                <div class="purchase-details">
                    <h3>${item.name}</h3>
                    <p class="purchase-date">${purchaseDate}</p>
                    <p class="purchase-price">Price: ₱${itemPrice.toFixed(2)}</p>
                    <p>Quantity: ${item.quantity}</p>
                    <p class="item-total">Total: ₱${itemTotal.toFixed(2)}</p>
                    <p class="order-status">Status: ${purchase.orderStatus}</p>
                </div>
            `;
            purchaseList.appendChild(purchaseItem);
        });
    });
    document.querySelectorAll('.stat-number')[2].textContent = `${(user.rewardPoints || 0).toFixed(2)}`;

    let firstName = user.name.split(" ")[0];
    let fullName = user.name;
    let email = user.email;

    // Update user information display
    document.getElementById("user-name").textContent = `Welcome, ${firstName}!`;

    // Add user details section
    const userInfoSection = document.createElement('div');
    userInfoSection.className = 'user-info';
    userInfoSection.innerHTML = `
        <p><strong>Full Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Birthday:</strong> ${user.birthday || 'Not provided'}</p>
        <p><strong>Account Status:</strong> Active</p>
        <p><strong>Member Since:</strong> ${new Date().toLocaleDateString()}</p>
    `;

    document.querySelector('.profile-section').insertBefore(
        userInfoSection, 
        document.querySelector('.logout-btn')
    );

    const profilePic = document.getElementById("profile-pic");
    if (user.profilePic) {
        profilePic.src = user.profilePic;
    }

    document.getElementById("profile-pic-upload").addEventListener("change", function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profilePic.src = e.target.result;
                user.profilePic = e.target.result;
                localStorage.setItem("loggedInUser", JSON.stringify(user));
            };
            reader.readAsDataURL(file);
        }
    });

    function renderAddresses() {
        let addressContainer = document.getElementById("address-list");
        addressContainer.innerHTML = "";
        addressList.forEach((address, index) => {
            let addressHTML = `
                <div class="address-item">
                    <div>
                        <strong>${address.name}</strong> | ${address.phone} <br>
                        ${address.details}
                        ${address.default ? "<span class='default-tag'>DEFAULT</span>" : ""}
                    </div>
                    <div class="address-actions">
                        <button onclick="setDefaultAddress(${index})">Set as Default</button>
                        <button onclick="editAddress(${index})">Edit</button>
                        <button onclick="deleteAddress(${index})">Delete</button>
                    </div>
                </div>
            `;
            addressContainer.innerHTML += addressHTML;
        });
    }

    window.openAddressModal = function () {
        document.getElementById("address-modal").style.display = "block";
    };

    window.closeAddressModal = function () {
        document.getElementById("address-modal").style.display = "none";
    };

    window.saveAddress = function () {
        let firstName = document.getElementById("address-firstname").value;
        let middleName = document.getElementById("address-middlename").value;
        let lastName = document.getElementById("address-lastname").value;
        let fullName = `${firstName} ${middleName} ${lastName}`.trim();
        let phone = document.getElementById("address-phone").value;
        let details = document.getElementById("address-details").value;

        if (firstName && lastName && phone && details) {
            addressList.push({ name: fullName, phone, details, default: false });
            localStorage.setItem("addresses", JSON.stringify(addressList));
            renderAddresses();
            closeAddressModal();
        } else {
            alert("Please fill out all fields.");
        }
    };

    window.setDefaultAddress = function (index) {
        addressList.forEach((addr, i) => addr.default = i === index);
        localStorage.setItem("addresses", JSON.stringify(addressList));
        renderAddresses();
    };

    window.editAddress = function (index) {
        let address = addressList[index];
        const names = address.name.split(' ');
        document.getElementById("address-firstname").value = names[0] || '';
        document.getElementById("address-middlename").value = names[1] || '';
        document.getElementById("address-lastname").value = names[2] || '';
        document.getElementById("address-phone").value = address.phone;
        document.getElementById("address-details").value = address.details;
        document.getElementById("modal-title").textContent = "Edit Address";
        document.getElementById("address-modal").style.display = "block";

        // Override save function temporarily for editing
        window.saveAddress = function() {
            let firstName = document.getElementById("address-firstname").value;
            let middleName = document.getElementById("address-middlename").value;
            let lastName = document.getElementById("address-lastname").value;
            let fullName = `${firstName} ${middleName} ${lastName}`.trim();
            let phone = document.getElementById("address-phone").value;
            let details = document.getElementById("address-details").value;

            if (firstName && lastName && phone && details) {
                addressList[index] = { 
                    name: fullName, 
                    phone, 
                    details, 
                    default: address.default 
                };
                localStorage.setItem("addresses", JSON.stringify(addressList));
                renderAddresses();
                closeAddressModal();
            } else {
                alert("Please fill out all fields.");
            }
        };
    };

    window.deleteAddress = function (index) {
        addressList.splice(index, 1);
        localStorage.setItem("addresses", JSON.stringify(addressList));
        renderAddresses();
    };

    renderAddresses();

    // Function to show orders by status
    window.showOrdersByStatus = function(status) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';

        const statusIcons = {
            'Processing': '<i class="fas fa-cog fa-spin"></i>',
            'In Transit': '<i class="fas fa-shipping-fast"></i>',
            'Delivered': '<i class="fas fa-box-open"></i>',
            'Completed': '<i class="fas fa-check-circle"></i>',
            'Cancelled': '<i class="fas fa-times-circle"></i>'
        };

        const statusColors = {
            'Processing': '#ffd700',
            'In Transit': '#1e90ff',
            'Delivered': '#32cd32',
            'Completed': '#228b22',
            'Cancelled': '#dc143c'
        };
        
        const statusBgColors = {
            'Processing': 'rgba(255, 215, 0, 0.1)',
            'In Transit': 'rgba(30, 144, 255, 0.1)',
            'Delivered': 'rgba(50, 205, 50, 0.1)',
            'Completed': 'rgba(34, 139, 34, 0.1)',
            'Cancelled': 'rgba(220, 20, 60, 0.1)'
        };

        const purchaseHistory = JSON.parse(localStorage.getItem('purchaseHistory')) || [];
        const filteredOrders = purchaseHistory.filter(order => order.orderStatus === status);

        let ordersHTML = `
            <div class="modal-content status-view-content">
                <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
                <div class="status-header" style="color: ${statusColors[status]}; background: ${statusBgColors[status]}; border-radius: 15px; padding: 15px;">
                    ${statusIcons[status]}
                    <h2>${status} Orders</h2>
                </div>
                <div class="filtered-orders">
        `;

        if (filteredOrders.length === 0) {
            ordersHTML += '<p class="no-orders">No orders with this status</p>';
        } else {
            filteredOrders.forEach((order, index) => {
                order.items.forEach(item => {
                    ordersHTML += `
                        <div class="order-item" style="border-left: 4px solid ${statusColors[status]}">
                            <div class="order-item-details">
                                <img src="${item.img}" alt="${item.name}">
                                <div class="order-info">
                                    <h4>#ORD-${String(index + 1).padStart(3, '0')}</h4>
                                    <p>${item.name}</p>
                                    <p>Quantity: ${item.quantity}</p>
                                    <p>Total: ₱${(parseFloat(item.price.replace('₱', '')) * item.quantity).toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    `;
                });
            });
        }

        ordersHTML += `
                </div>
            </div>
        `;

        modal.innerHTML = ordersHTML;
        document.body.appendChild(modal);
    };

    // Admin function to process orders
    window.processOrder = function(index) {
        if (!user.isAdmin) return;
        
        let purchaseHistory = JSON.parse(localStorage.getItem('purchaseHistory')) || [];
        if (purchaseHistory[index]) {
            const currentStatus = purchaseHistory[index].orderStatus;
            const statusFlow = {
                'Processing': 'In Transit',
                'In Transit': 'Delivered',
                'Delivered': 'Completed'
            };
            
            if (statusFlow[currentStatus]) {
                const confirmMessage = `Are you sure you want to update this order from "${currentStatus}" to "${statusFlow[currentStatus]}"?`;
                if (confirm(confirmMessage)) {
                    purchaseHistory[index].orderStatus = statusFlow[currentStatus];
                    localStorage.setItem('purchaseHistory', JSON.stringify(purchaseHistory));
                    
                    // Show success notification
                    const notification = document.createElement('div');
                    notification.className = 'status-update-notification';
                    notification.innerHTML = `Order status updated to: ${statusFlow[currentStatus]}`;
                    document.body.appendChild(notification);
                    
                    setTimeout(() => {
                        notification.remove();
                        location.reload();
                    }, 1500);
                }
            }
        }
    };

window.rejectOrder = function(index) {
        if (!user.isAdmin) return;
        
        let purchaseHistory = JSON.parse(localStorage.getItem('purchaseHistory')) || [];
        if (purchaseHistory[index]) {
            const confirmMessage = "Are you sure you want to reject this order?";
            if (confirm(confirmMessage)) {
                purchaseHistory[index].orderStatus = 'Cancelled';
                localStorage.setItem('purchaseHistory', JSON.stringify(purchaseHistory));
                
                // Show rejection notification
                const notification = document.createElement('div');
                notification.className = 'status-update-notification rejection';
                notification.innerHTML = `Order has been cancelled`;
                document.body.appendChild(notification);
                
                setTimeout(() => {
                    notification.remove();
                    location.reload();
                }, 1500);
            }
        }
    };
});

// Define logout function in global scope
window.logout = function() {
    // Only clear login session data
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("cart");
    localStorage.removeItem("cartCount");
    window.location.href = "index3.html";
};
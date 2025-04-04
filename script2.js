function showLoginNotification() {
    const overlay = document.createElement('div');
    overlay.className = 'login-notification-overlay';

    const notification = document.createElement('div');
    notification.className = 'login-notification';
    notification.innerHTML = `
        <h3>Login Required</h3>
        <p>Please login first to add items to your cart!</p>
        <button class="login-btn" onclick="window.location.href='index3.html'">Login Now</button>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(notification);

    overlay.addEventListener('click', () => {
        overlay.remove();
        notification.remove();
    });
}

document.addEventListener("DOMContentLoaded", function() {
    let user = JSON.parse(localStorage.getItem("loggedInUser"));
    const productsContainer = document.getElementById("products-container");
    const searchInput = document.getElementById("search");
    const modal = document.getElementById("cartModal");
    const closeModal = document.getElementById("closeModal");
    const dashboardLink = document.querySelector("#dashboard-link");
    const dashboardPic = document.getElementById("dashboard-pic");

    // Update login display if user is logged in
    const cartContainer = document.getElementById("cart-container");

    if (user) {
        cartContainer.style.display = "list-item";
        let firstName = user.name.split(" ")[0];
        dashboardLink.textContent = `Hi, ${firstName}`;
        dashboardLink.href = "dashboard.html";
        if (user.profilePic) {
            dashboardPic.src = user.profilePic;
        }
    }

    const products = [
        { name: "Class Craft Edition - Ballpen", price: "₱25.00", img: "ballpenedit.png", category: "Pens" },
        { name: "Class Craft Edition - Notebook (Black)", price: "₱40.50", img: "notebookedit.png", category: "Others" },
        { name: "10pcs Bondpaper", price: "₱13.00", img: "bondpaper.png", category: "Papers" },
        { name: "Permanent Marker (Colors)", price: "₱30.00", img: "marker.png", category: "Pens" },
        { name: "Correction Tape", price: "₱15.00", img: "correctiontape.png", category: "Others" },
        { name: "Colored Paper", price: "₱14.00", img: "colorpaper.png", category: "Papers" },
        { name: "Colored Notebook", price: "₱18.50", img: "colornotebook.png", category: "Others" },
        { name: "Pencil Eraser", price: "₱5.00", img: "eraser.png", category: "Others" },
        { name: "Paper Clip", price: "₱10.00", img: "paperclip.png", category: "Others" },
        { name: "Glue", price: "₱20.00", img: "glue.png", category: "Others" },
        { name: "Folder Clip", price: "₱15.00", img: "folderclip.png", category: "Others" },
        { name: "Paste Glue", price: "₱25.00", img: "pasteglue.png", category: "Others" },
        { name: "Bag", price: "₱250.00", img: "bag.png", category: "Bags" },
        { name: "Bag #2", price: "₱300.00", img: "bag2.png", category: "Bags" },
        { name: "Bag #3", price: "₱350.00", img: "bag3.png", category: "Bags" },
        { name: "Bag #4", price: "₱400.00", img: "bag4.png", category: "Bags" },
        { name: "Scissor", price: "₱45.00", img: "scissor.png", category: "Others" },
        { name: "Class Craft Edition - ID Lace", price: "₱35.00", img: "idlace.png", category: "Others" },
        { name: "Pencil", price: "₱10.00", img: "pen.png", category: "Pens" },
        { name: "Crayons 64", price: "₱120.00", img: "crayons.png", category: "Colors" },
        { name: "Cartolina", price: "₱15.00", img: "cartolina.png", category: "Papers" },
        { name: "Colored Paper #2", price: "₱20.00", img: "colorpaper2.png", category: "Papers" },
        { name: "Manila Paper", price: "₱10.00", img: "manilapaper.png", category: "Papers" },
        { name: "Chalk", price: "₱25.00", img: "chalk.png", category: "Others" },
        { name: "Brown Envelope", price: "₱8.00", img: "brownenvelope.png", category: "Others" },
        { name: "Periodic Table", price: "₱30.00", img: "periodictable.png", category: "Papers" },
        { name: "Compass", price: "₱45.00", img: "compass.png", category: "Others" },
        { name: "Tape", price: "₱20.00", img: "tape.png", category: "Others" },
        { name: "Tape #2", price: "₱25.00", img: "tape2.png", category: "Others" },
        { name: "Double Sided Tape", price: "₱35.00", img: "doublesidedtape.png", category: "Others" },
        { name: "Stapler", price: "₱75.00", img: "stapler.png", category: "Others" },
        { name: "Punch Hole", price: "₱85.00", img: "punchhole.png", category: "Others" },
        { name: "Ruler", price: "₱15.00", img: "ruler.png", category: "Others" },
        { name: "Sticky Notes", price: "₱25.00", img: "stickynotes.png", category: "Others" },
        { name: "Colored Marker", price: "₱45.00", img: "coloredmarker.png", category: "Pens" },
        { name: "Paint", price: "₱120.00", img: "paint.png", category: "Colors" },
        { name: "Index Card", price: "₱15.00", img: "indexcard.png", category: "Papers" },
        { name: "Sharpener", price: "₱10.00", img: "sharpener.png", category: "Others" },
        { name: "Pencil Case", price: "₱65.00", img: "pencilcase.png", category: "Others" },
        { name: "Philippines Map", price: "₱35.00", img: "phmap.png", category: "Others" },
        { name: "Keychain", price: "₱25.00", img: "keychain.png", category: "Others" },
        { name: "ID CASE", price: "₱30.00", img: "idcase.png", category: "Others" },
        { name: "Colored Pencil", price: "₱45.00", img: "coloredpencil.png", category: "Pens" },
        { name: "Pin", price: "₱15.00", img: "pin.png", category: "Others" },
        { name: "White Correction Paint", price: "₱25.00", img: "whitecorrection.png", category: "Pens" },
        { name: "Calculator", price: "₱150.00", img: "calculator.png", category: "Others" },
        { name: "Illustration Board", price: "₱35.00", img: "illustrationboard.png", category: "Papers" },
        { name: "Coming Soon Product 1", price: "₱0.00", img: "placeholder.png", category: "New" },
        { name: "Coming Soon Product 2", price: "₱0.00", img: "placeholder.png", category: "New" },
        { name: "Coming Soon Product 3", price: "₱0.00", img: "placeholder.png", category: "New" },
        { name: "Coming Soon Product 4", price: "₱0.00", img: "placeholder.png", category: "New" },
        { name: "Coming Soon Product 5", price: "₱0.00", img: "placeholder.png", category: "New" }
    ];


    function filterCategory(category) {
        displayProducts("", category);
    }

    function displayProducts(filter = "", category = "") {
        productsContainer.innerHTML = "";

        const filteredProducts = products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(filter.toLowerCase());
            const matchesCategory = category ? product.category === category : true;
            return matchesSearch && matchesCategory;
        });

        if (filteredProducts.length === 0) {
            productsContainer.innerHTML = "<div class='no-products-found'><img src='search-empty.png' alt='No Results' /><p>No products found...</p><p class='suggestion'>Try searching with different keywords</p></div>";
            return;
        }

        filteredProducts.forEach(product => {
            const isComingSoon = product.name.includes("Coming Soon");
            const productHTML = `<div class='product'>
                <img src='${product.img}' alt='${product.name}' class='product-img' style='cursor: pointer'>
                <h2>${product.name}</h2>
                <div class="price-container">
                    <p class="price">${product.price.replace('₱', '')}</p>
                </div>
                <div class="button-container">
                    ${isComingSoon ? 
                        `<button class='coming-soon-btn' disabled>Coming Soon</button>` :
                        `<button class='add-to-cart' data-name='${product.name}' data-price='${product.price}' data-img='${product.img}'>Cart</button>
                         <button class='buy-now' data-name='${product.name}' data-price='${product.price}' data-img='${product.img}'>Buy Now</button>`
                    }
                </div>
            </div>`;
            productsContainer.innerHTML += productHTML;
        });
    }

    searchInput.addEventListener("input", function() {
        displayProducts(this.value);
    });

    displayProducts();

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartLink = document.querySelector('a[href="index4.html"]');

    if (user) {
        document.getElementById('cart-container').style.display = 'block';
        updateCartDisplay();
    }

    document.addEventListener("click", function(event) {
        if (event.target.classList.contains("add-to-cart")) {
            const productName = event.target.getAttribute("data-name");
            if (productName.includes("Coming Soon")) {
                return;
            }
            let user = JSON.parse(localStorage.getItem("loggedInUser"));
            if (!user) {
                showLoginNotification();
                return;
            }
            const name = event.target.getAttribute("data-name");
            const price = event.target.getAttribute("data-price");
            const img = event.target.getAttribute("data-img");

            let existingItem = cart.find(item => item.name === name);
            if (existingItem) {
                existingItem.quantity++;
                existingItem.total = existingItem.quantity * parseFloat(existingItem.price.replace('₱', ''));
            } else {
                cart.push({ 
                    name, 
                    price, 
                    img, 
                    quantity: 1,
                    total: parseFloat(price.replace('₱', ''))
                });
            }

            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartDisplay();
            modal.style.display = "block";
        }

        if (event.target.classList.contains("buy-now")) {
            const productName = event.target.getAttribute("data-name");
            if (productName.includes("Coming Soon")) {
                return;
            }
            let user = JSON.parse(localStorage.getItem("loggedInUser"));
            if (!user) {
                alert("Please login first to buy items!");
                window.location.href = "index3.html";
                return;
            }
            const name = event.target.getAttribute("data-name");
            const price = event.target.getAttribute("data-price");
            const img = event.target.getAttribute("data-img");
            const priceValue = parseFloat(price.replace('₱', ''));

            // Create confirmation overlay and modal
            const overlay = document.createElement('div');
            overlay.className = 'confirmation-overlay';

            const confirmationModal = document.createElement('div');
            confirmationModal.className = 'confirmation-modal';
            confirmationModal.innerHTML = `
                <div class="confirmation-content">
                    <h3>Confirm Purchase</h3>
                    <p>Are you sure you want to purchase this item?</p>
                    <div class="item-preview">
                        <img src="${img}" alt="${name}">
                        <div class="item-details">
                            <h4>${name}</h4>
                            <p class="confirm-price">₱${priceValue}</p>
                        </div>
                    </div>
                    <div class="confirmation-buttons">
                        <button class="confirm-yes">Yes, Purchase</button>
                        <button class="confirm-no">Cancel</button>
                    </div>
                </div>
            `;

            document.body.appendChild(overlay);
            document.body.appendChild(confirmationModal);

            const buyNowItem = {
                name: name,
                price: `₱${priceValue}`,
                img: img,
                quantity: 1,
                total: priceValue,
                subtotal: priceValue
            };

            confirmationModal.querySelector('.confirm-yes').addEventListener('click', () => {
                localStorage.setItem("buyNowItem", JSON.stringify(buyNowItem));
                window.location.href = "index8.html?buyNow=true";
            });

            confirmationModal.querySelector('.confirm-no').addEventListener('click', () => {
                overlay.remove();
                confirmationModal.remove();
            });

            overlay.addEventListener('click', () => {
                overlay.remove();
                confirmationModal.remove();
            });
        }
    });

    function updateCartDisplay() {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
        cartLink.innerHTML = `CART <span class="cart-count">${cartCount}</span>`;
        localStorage.setItem('cartCount', cartCount);
    }

    const imageModal = document.getElementById("imageModal");
    const modalImage = document.getElementById("modalImage");
    const closeImageModal = document.getElementById("closeImageModal");

    document.addEventListener("click", function(event) {
        if (event.target.classList.contains("product-img")) {
            const product = event.target.closest('.product');
            const name = product.querySelector('h2').textContent;
            if (name.includes("Coming Soon")) {
                return;
            }
            const price = product.querySelector('.price').textContent;
            const img = event.target.src;

            modalImage.src = img;
            document.getElementById('modalProductName').textContent = name;
            document.getElementById('modalProductPrice').textContent = `₱${price}`;
            // Product details updated
            imageModal.style.display = "block";
        }
    });

    closeImageModal.addEventListener("click", function() {
        imageModal.style.display = "none";
    });

    closeModal.addEventListener("click", function() {
        modal.style.display = "none";
    });

    let currentModalProduct = null;

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
        if (event.target === imageModal) {
            imageModal.style.display = "none";
        }
    };

    window.addToCartFromModal = function() {
        if (!currentModalProduct) return;

        let user = JSON.parse(localStorage.getItem("loggedInUser"));
        if (!user) {
            alert("Please login first to add items to cart!");
            window.location.href = "index3.html";
            return;
        }

        let existingItem = cart.find(item => item.name === currentModalProduct.name);
        if (existingItem) {
            existingItem.quantity++;
            existingItem.total = existingItem.quantity * parseFloat(existingItem.price.replace('₱', ''));
        } else {
            cart.push({
                name: currentModalProduct.name,
                price: currentModalProduct.price,
                img: currentModalProduct.img,
                quantity: 1,
                total: parseFloat(currentModalProduct.price.replace('₱', ''))
            });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartDisplay();
        imageModal.style.display = "none";
        modal.style.display = "block";
    };

    window.buyNowFromModal = function() {
        if (!currentModalProduct) return;

        let user = JSON.parse(localStorage.getItem("loggedInUser"));
        if (!user) {
            alert("Please login first to buy items!");
            window.location.href = "index3.html";
            return;
        }

        localStorage.setItem("buyNowItem", JSON.stringify({
            name: currentModalProduct.name,
            price: currentModalProduct.price,
            img: currentModalProduct.img,
            quantity: 1
        }));
        window.location.href = "index8.html";
    };

    document.addEventListener("click", function(event) {
        if (event.target.classList.contains("product-img")) {
            const product = event.target.closest('.product');
            const name = product.querySelector('h2').textContent;
            const price = product.querySelector('.price').textContent;
            const img = event.target.src;

            currentModalProduct = {
                name: name,
                price: `₱${price}`,
                img: img
            };

            modalImage.src = img;
            document.getElementById('modalProductName').textContent = name;
            document.getElementById('modalProductPrice').textContent = `₱${price}`;
            imageModal.style.display = "block";
        }
    });

    window.filterCategory = filterCategory;
});
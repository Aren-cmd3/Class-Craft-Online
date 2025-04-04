function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function clearUserSession() {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("cart");
    localStorage.removeItem("cartCount");
}

document.addEventListener("DOMContentLoaded", function () {
    const loginButton = document.querySelector('button');
    loginButton.addEventListener('click', login);

    function login() {
        let email = document.getElementById("login-email").value.trim();
        let password = document.getElementById("login-password").value.trim();
        let errorMessage = document.getElementById("error-message");

        if (!email || !password) {
            errorMessage.textContent = "Please fill in all fields!";
            return;
        }

        // Admin account check
        if (email === "classcraftbot@gmail.com" && password === "classcrafted09") {
            const adminUser = {
                email: "classcraftbot@gmail.com",
                name: "Admin",
                isAdmin: true,
                profilePic: "default-avatar.png"
            };
            localStorage.setItem("loggedInUser", JSON.stringify(adminUser));
            showNotification("Admin login successful!", "success");
            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 1500);
            return;
        }

        let users = JSON.parse(localStorage.getItem("users")) || [];
        let userByEmail = users.find(user => user.email.toLowerCase() === email.toLowerCase());

        if (!users.length) {
            errorMessage.textContent = "No accounts exist yet. Please create an account first.";
            showNotification("No accounts found!", "error");
            return;
        }

        if (!userByEmail) {
            errorMessage.textContent = "No account found with this email. Please check your email or create an account.";
            showNotification("Account not found!", "error");
            return;
        }

        if (userByEmail.password !== password) {
            errorMessage.textContent = "Incorrect password. Please try again.";
            showNotification("Incorrect password!", "error");
            return;
        }

        localStorage.setItem("loggedInUser", JSON.stringify(userByEmail));
        errorMessage.textContent = "";
        showNotification("Login successful!", "success");
        setTimeout(() => {
            window.location.href = "index.html";
        }, 1500);
    }

    window.login = login;
});
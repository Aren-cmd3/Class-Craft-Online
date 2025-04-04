document.addEventListener("DOMContentLoaded", function () {
    // Initialize notification system
});

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span class="notification-icon">${type === 'success' ? '✅' : '❌'}</span>
        <p class="notification-message">${message}</p>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 500);
    }, 5000);
}

function sendResetLink() {
    const email = document.getElementById("forgot-email").value;

    if (!email) {
        showNotification("Please enter your email.", 'error');
        return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
    localStorage.setItem("reset_otp", otp);
    localStorage.setItem("reset_email", email);

    // Show OTP section and display OTP (for testing purposes)
    document.getElementById("otp-section").style.display = "block";
    showNotification(`Your OTP is: ${otp}`, 'success');
}

function verifyOTP() {
    const enteredOTP = document.getElementById("otp-input").value;
    const storedOTP = localStorage.getItem("reset_otp");

    if (enteredOTP === storedOTP) {
        showNotification("OTP Verified! Enter a new password.", 'success');
        document.getElementById("otp-section").style.display = "none";
        document.getElementById("password-section").style.display = "block";
    } else {
        showNotification("Invalid OTP. Try again.", 'error');
    }
}

function resetPassword() {
    const newPassword = document.getElementById("new-password").value;
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const resetEmail = localStorage.getItem("reset_email");

    if (!resetEmail) {
        showNotification("Reset session expired. Please try again.", 'error');
        setTimeout(() => {
            window.location.href = "index6.html";
        }, 2000);
        return;
    }

    const userIndex = users.findIndex(user => user.email === resetEmail);
    if (userIndex === -1) {
        showNotification("Account not found. Please create an account first.", 'error');
        setTimeout(() => {
            window.location.href = "index5.html";
        }, 2000);
        return;
    }

    if (users[userIndex].password === newPassword) {
        showNotification("New password cannot be the same as current password.", 'error');
        return;
    }

    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(newPassword)) {
        showNotification("Password must be at least 8 characters and contain letters & numbers.", 'error');
        return;
    }

    users[userIndex].password = newPassword;
    localStorage.setItem("users", JSON.stringify(users));
    showNotification("Password reset successfully! Redirecting to login...", 'success');

    localStorage.removeItem("reset_otp");
    localStorage.removeItem("reset_email");

    setTimeout(() => {
        window.location.href = "index3.html";
    }, 2000);
}
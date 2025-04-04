
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icon = type === 'success' ? '✅' : '❌';
    notification.innerHTML = `
        <span class="notification-icon">${icon}</span>
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


// Add input validation function
function validateInput(input) {
    if (input.value.trim() === '') {
        input.style.borderColor = '#ff0000';
        input.style.backgroundColor = 'rgba(255, 0, 0, 0.05)';
        return false;
    } else {
        input.style.borderColor = '#4CAF50';
        input.style.backgroundColor = 'rgba(76, 175, 80, 0.05)';
        return true;
    }
}

// Add input event listeners for real-time validation
document.querySelectorAll('#signup-form input, #signup-form select').forEach(input => {
    input.addEventListener('input', () => validateInput(input));
});

document.getElementById("signup-form").addEventListener("submit", function(event) {
    event.preventDefault();

    let firstName = document.getElementById("firstName").value.trim();
    let middleName = document.getElementById("middleName").value.trim();
    let lastName = document.getElementById("lastName").value.trim();
    let name = `${firstName} ${middleName} ${lastName}`;
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();
    let birthMonth = document.getElementById("birthMonth").value;
    let birthDay = document.getElementById("birthDay").value;
    let birthYear = document.getElementById("birthYear").value;
    let birthday = `${birthMonth}/${birthDay}/${birthYear}`;

    // Validate all inputs
    let isValid = true;
    document.querySelectorAll('#signup-form input, #signup-form select').forEach(input => {
        if (!validateInput(input)) {
            isValid = false;
        }
    });

    if (!isValid) {
        showNotification("Please fill in all fields correctly.", "error");
        return;
    }

    // Add validation for all fields
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        if (input.value.trim() === '') {
            input.classList.add('invalid');
            input.classList.remove('valid');
        } else {
            input.classList.add('valid');
            input.classList.remove('invalid');
        }
    });

    // Check if any field is invalid
    if (document.querySelectorAll('.invalid').length > 0) {
        alert("Please fill in all fields correctly.");
        return;
    }

    if (name === "" || email === "" || password === "") {
        alert("Please fill in all fields.");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Check if email already exists (case insensitive)
    if (users.some(user => user.email.toLowerCase() === email.toLowerCase())) {
        showNotification("Email already registered! Please log in.", "error");
        setTimeout(() => {
            window.location.href = "index3.html";
        }, 2000);
        return;
    }

    users.push({ name, email, password });
    localStorage.setItem("users", JSON.stringify(users));

    showNotification("Account created successfully! Redirecting to login...", "success");
    setTimeout(() => {
        window.location.href = "index3.html";
    }, 2000);
});


document.addEventListener("DOMContentLoaded", function() {
    let user = JSON.parse(localStorage.getItem("loggedInUser"));
    const cartContainer = document.getElementById("cart-container");
    const dashboardLink = document.querySelector("#dashboard-link");
    const dashboardPic = document.getElementById("dashboard-pic");
    
    if (user) {
        cartContainer.style.display = "list-item";
        let firstName = user.name.split(" ")[0];
        dashboardLink.textContent = `Hi, ${firstName}`;
        dashboardLink.href = "dashboard.html";
        if (user.profilePic) {
            dashboardPic.src = user.profilePic;
        }
    }
});

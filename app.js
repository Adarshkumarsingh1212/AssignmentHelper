
document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form values
    const name = document.getElementById("name").value;
    const dob = document.getElementById("dob").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const role = document.getElementById("role").value;

    // Simulate OTP verification (placeholder)
    alert("TEAM ADARSH : LOGIN SUCCESFULLY FOR " + name);

    // Redirect based on role
    if (role === "user") {
        window.location.href = "user_dashboard.html";
    } else if (role === "provider") {
        window.location.href = "provider_dashboard.html";
    }
});

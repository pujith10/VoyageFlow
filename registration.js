const form = document.getElementById("regForm");
const modal = document.getElementById("successModal");
const continueBtn = document.getElementById("continueBtn");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Fetch values
    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let pin = document.getElementById("pin").value.trim();

    let valid = true;

    // Name validation
    if (name.length < 3) {
        document.getElementById("nameError").textContent = "Enter a valid name.";
        valid = false;
    } else {
        document.getElementById("nameError").textContent = "";
    }

    // Email validation
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if (!email.match(emailPattern)) {
        document.getElementById("emailError").textContent = "Invalid email format.";
        valid = false;
    } else {
        document.getElementById("emailError").textContent = "";
    }

    // Phone validation
    if (phone.length !== 10 || isNaN(phone)) {
        document.getElementById("phoneError").textContent = "Phone must be 10 digits.";
        valid = false;
    } else {
        document.getElementById("phoneError").textContent = "";
    }

    // PIN validation
    if (pin.length !== 6 || isNaN(pin)) {
        document.getElementById("pinError").textContent = "PIN must be 6 digits.";
        valid = false;
    } else {
        document.getElementById("pinError").textContent = "";
    }

    if (valid) {
        modal.style.display = "flex";
    }
});

// Continue Button → Go To Blog Page
continueBtn.addEventListener("click", () => {
    window.location.href = "blog.html"; 
});
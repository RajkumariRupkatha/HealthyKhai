document.addEventListener("DOMContentLoaded", function () {
    // Cart Data Storage
    if (!localStorage.getItem("cart")) {
        localStorage.setItem("cart", JSON.stringify([]));
    }

    const specialsContainer = document.querySelector(".specials-container");
    let specialItems = Array.from(document.querySelectorAll(".special-item"));
    const leftArrow = document.querySelector(".left-arrow");
    const rightArrow = document.querySelector(".right-arrow");
    const header = document.querySelector("header");
    const headerText = document.querySelector(".header-text");
    const contactSection = document.getElementById("contact");
    const specialsSection = document.getElementById("specials");
    const menuSection = document.getElementById("menu");
    const cartIcon = document.querySelector(".cart-icon");
    const cartOverlay = document.getElementById("cart-overlay");
    const cartItemsContainer = document.getElementById("cart-items");
    const cartLink = document.getElementById("cart-link");

    // ✅ MOBILE RESPONSIVE NAVIGATION (Hamburger Menu)
    const menuToggle = document.createElement("div");
    menuToggle.classList.add("menu-toggle");
    menuToggle.innerHTML = "☰"; // Hamburger icon

    // Add the menu toggle button inside the header
    const nav = document.querySelector("nav");
    nav.prepend(menuToggle);

    // ✅ Toggle Navigation and Cart Inside Menu
    menuToggle.addEventListener("click", function () {
        const menu = document.querySelector("nav ul");
        menu.classList.toggle("show");

        // If menu opens, show cart inside it
        if (menu.classList.contains("show")) {
            cartOverlay.classList.add("show");
        } else {
            cartOverlay.classList.remove("show");
        }
    });

    // ✅ Ensure Clicking "Cart" Inside Menu Opens It
    cartLink.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent default link behavior

        // Toggle cart view inside menu
        cartOverlay.classList.toggle("show");
    });

    // ✅ Hide Menu and Cart When Clicking Outside (Mobile Only)
    document.addEventListener("click", function (event) {
        const menu = document.querySelector("nav ul");

        if (window.innerWidth <= 768) {
            if (!menu.contains(event.target) && !menuToggle.contains(event.target) && !cartOverlay.contains(event.target)) {
                menu.classList.remove("show");
                cartOverlay.classList.remove("show");
            }
        }
    });

    let lastScrollY = window.scrollY;
    let currentIndex = Math.floor(specialItems.length / 2); // Start in the middle

    // ✅ HEADER SCROLL LOGIC (Hide on Scroll Down, Show on Scroll Up)
    window.addEventListener("scroll", () => {
        let currentScrollY = window.scrollY;

        if (currentScrollY > lastScrollY + 10) {
            header.style.transform = "translateY(-100%)";
        } else if (currentScrollY < lastScrollY - 10) {
            header.style.transform = "translateY(0)";
        }

        lastScrollY = currentScrollY;
    });

    // ✅ UPDATE SPECIALS VIEW
    function updateSpecialsView() {
        specialItems.forEach((item, index) => {
            item.classList.remove("active", "left", "right", "far-left", "far-right");

            if (index === currentIndex) {
                item.classList.add("active");
                item.style.transform = "translateX(0) scale(1.2)";
                item.style.zIndex = "10";
                item.style.opacity = "1";
            } else if (index === currentIndex - 1) {
                item.classList.add("left");
                item.style.transform = "translateX(-260px) scale(1.1)";
                item.style.zIndex = "5";
                item.style.opacity = "0.8";
            } else if (index === currentIndex + 1) {
                item.classList.add("right");
                item.style.transform = "translateX(260px) scale(1.1)";
                item.style.zIndex = "5";
                item.style.opacity = "0.8";
            } else if (index === currentIndex - 2) {
                item.classList.add("far-left");
                item.style.transform = "translateX(-420px) scale(0.9)";
                item.style.zIndex = "3";
                item.style.opacity = "0.6";
            } else if (index === currentIndex + 2) {
                item.classList.add("far-right");
                item.style.transform = "translateX(420px) scale(0.9)";
                item.style.zIndex = "3";
                item.style.opacity = "0.6";
            } else {
                item.style.transform = "translateX(0) scale(0.7)";
                item.style.opacity = "0.5";
                item.style.zIndex = "1";
            }
        });
    }

    rightArrow.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % specialItems.length;
        updateSpecialsView();
    });

    leftArrow.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + specialItems.length) % specialItems.length;
        updateSpecialsView();
    });

    updateSpecialsView();

    // ✅ CART FUNCTIONALITY - DISABLE HOVER ON MOBILE
    let cartTimeout;

    cartIcon.addEventListener("mouseenter", () => {
        if (window.innerWidth > 768) { // Prevent hover effect on mobile
            clearTimeout(cartTimeout);
            cartOverlay.style.right = "0"; // Show cart
        }
    });

    cartOverlay.addEventListener("mouseenter", () => {
        clearTimeout(cartTimeout);
    });

    cartOverlay.addEventListener("mouseleave", () => {
        cartTimeout = setTimeout(() => {
            cartOverlay.style.right = "-350px";
        }, 300);
    });

    // ✅ SHOW CART FUNCTION
    function showCart() {
        const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
        cartItemsContainer.innerHTML = "";

        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = "<p>No items in cart</p>";
        } else {
            cartItems.forEach((item, index) => {
                let cartItem = document.createElement("div");
                cartItem.classList.add("cart-item");
                cartItem.innerHTML = `
                    <p>${item.name} - $${item.price.toFixed(2)} x ${item.quantity}</p>
                    <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
                `;
                cartItemsContainer.appendChild(cartItem);
            });
        }
    }

    // ✅ ADD TO CART FUNCTION
    window.addToCart = function (itemName, price) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let existingItem = cart.find(item => item.name === itemName);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ name: itemName, price: price, quantity: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        showCart();
    };

    // ✅ REMOVE FROM CART FUNCTION
    window.removeFromCart = function (index) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        showCart();
    };

    // Update cart view when page loads
    showCart();
});

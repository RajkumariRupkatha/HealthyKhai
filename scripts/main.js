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
    const closeCartButton = document.getElementById("close-cart-button");

    // ✅ MOBILE RESPONSIVE NAVIGATION (Hamburger Menu)
    const menuToggle = document.createElement("div");
    menuToggle.classList.add("menu-toggle");
    menuToggle.innerHTML = "☰"; // Hamburger icon

    const nav = document.querySelector("nav");
    nav.prepend(menuToggle);

    menuToggle.addEventListener("click", function () {
        document.querySelector("nav ul").classList.toggle("show");
    });


    let lastScrollY = window.scrollY;
    let currentIndex = Math.floor(specialItems.length / 2); // Start in the middle

    // ✅ HEADER SCROLL LOGIC (Hide on Scroll Down, Show on Scroll Up)
window.addEventListener("scroll", () => {
    let currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY + 10) { // Only hide when scrolling significantly down
        header.style.transform = "translateY(-100%)";
    } else if (currentScrollY < lastScrollY - 10) { // Only show when scrolling significantly up
        header.style.transform = "translateY(0)";
    }

    lastScrollY = currentScrollY;
});

    // ✅ DEBOUNCED SCROLL EVENT TO UPDATE HEADER TEXT
    let debounceTimer;
    window.addEventListener("scroll", () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            let scrollPosition = window.scrollY;

            // Keep header transparent
            header.style.background = "transparent";

            // Update header text based on scroll position
            if (scrollPosition < specialsSection.offsetTop - 100) {
                headerText.textContent = "Our Story";
            } else if (scrollPosition >= specialsSection.offsetTop - 100 && scrollPosition < menuSection.offsetTop - 100) {
                headerText.textContent = "Specials";
            } else if (scrollPosition >= menuSection.offsetTop - 100 && scrollPosition < contactSection.offsetTop - 100) {
                headerText.textContent = "Menu";
            } else if (scrollPosition >= contactSection.offsetTop - 100) {
                headerText.textContent = "Contact Us";
            }

            // Smooth transition for text update
            headerText.style.transition = "opacity 0.3s ease-in-out";
            headerText.style.opacity = "0.7";
            setTimeout(() => {
                headerText.style.opacity = "1";
            }, 200);
        }, 100);
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

    // ✅ CART FUNCTIONALITY - SHOW ON HOVER
    let cartTimeout;

    cartIcon.addEventListener("mouseenter", () => {
        clearTimeout(cartTimeout); 
        cartOverlay.style.right = "0"; // Show cart
    });
    
    cartOverlay.addEventListener("mouseenter", () => {
        clearTimeout(cartTimeout); // Prevent hiding when inside cart
    });
    
    cartOverlay.addEventListener("mouseleave", () => {
        cartTimeout = setTimeout(() => {
            cartOverlay.style.right = "-350px"; // Hide cart after delay
        }, 300); // Small delay to prevent accidental closing
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

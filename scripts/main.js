document.addEventListener("DOMContentLoaded", function () {
    const specialsContainer = document.querySelector(".specials-container");
    let specialItems = Array.from(document.querySelectorAll(".special-item"));
    const leftArrow = document.querySelector(".left-arrow");
    const rightArrow = document.querySelector(".right-arrow");
    const header = document.querySelector("header");
    let lastScrolly = window.scrollY; // Track previous scroll porition
    const contactSection = document.getElementById("contact"); // New Contact Section
    const specialsSection = document.getElementById("specials");
    const menuSection = document.getElementById("menu");
    const headerText = document.querySelector(".header-text");
    
    let currentIndex = Math.floor(specialItems.length / 2); // Start with the middle item
    window.addEventListener("scroll", () => {
        let scrollPosition = window.scrollY;
    
        // ✅ Keep the header transparent always
        header.style.background = "transparent";
    
        // Update header text based on scroll position
        if (scrollPosition < specialsSection.offsetTop - 100) {
            headerText.textContent = "Our Story";
        } else if (scrollPosition >= specialsSection.offsetTop - 100 && scrollPosition < menuSection.offsetTop - 100) {
            headerText.textContent = "Specials";
        } else if (scrollPosition >= menuSection.offsetTop - 100) {
            headerText.textContent = "Menu";
        } else if (scrollPosition >= contactSection.offsetTop - 100) {
            headerText.textContent = "Contact Us";
        } 
    
        // Smooth text transition effect
        headerText.style.transition = "opacity 0.3s ease-in-out";
        headerText.style.opacity = "0.7";
        setTimeout(() => {
            headerText.style.opacity = "1";
        }, 200);
    });
    
    // ===== FUNCTION TO UPDATE SPECIALS VIEW =====
    function updateSpecialsView() {
        specialItems.forEach((item, index) => {
            item.classList.remove("active", "left", "right", "far-left", "far-right");

            if (index === currentIndex) {
                item.classList.add("active");
                item.style.transform = "translateX(0) scale(1.2)"; // Center (biggest)
                item.style.zIndex = "10";
                item.style.opacity = "1";
            } else if (index === currentIndex - 1) {
                item.classList.add("left");
                item.style.transform = "translateX(-260px) scale(1.1)"; // Left (medium)
                item.style.zIndex = "5";
                item.style.opacity = "0.8";
            } else if (index === currentIndex + 1) {
                item.classList.add("right");
                item.style.transform = "translateX(260px) scale(1.1)"; // Right (medium)
                item.style.zIndex = "5";
                item.style.opacity = "0.8";
            } else if (index === currentIndex - 2) {
                item.classList.add("far-left");
                item.style.transform = "translateX(-420px) scale(0.9)"; // Left edge (small)
                item.style.zIndex = "3";
                item.style.opacity = "0.6";
            } else if (index === currentIndex + 2) {
                item.classList.add("far-right");
                item.style.transform = "translateX(420px) scale(0.9)"; // Right edge (small)
                item.style.zIndex = "3";
                item.style.opacity = "0.6";
            } else {
                item.style.transform = "translateX(0) scale(0.7)"; // Farthest (smallest)
                item.style.opacity = "0.5";
                item.style.zIndex = "1";
            }
        });
    }

    rightArrow.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % specialItems.length; // Loop to first item if at last
        updateSpecialsView();
    });

    leftArrow.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + specialItems.length) % specialItems.length; // Loop to last item if at first
        updateSpecialsView();
    });
    // Initialize view on page load
    updateSpecialsView();
});

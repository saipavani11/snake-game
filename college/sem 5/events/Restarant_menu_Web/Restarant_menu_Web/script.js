document.addEventListener("DOMContentLoaded", function () {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();

            const targetId = this.getAttribute("href");
            if (targetId === "#") return; // Skip links with href="#"

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: "smooth"
                });
            } else {
                console.error(`No element found with ID: ${targetId}`);
            }
        });
    });
});

const text = "Welcome to Savoury Spot - A Journey of Authentic Flavors!";
let index = 0;

function typeText() {
    if (index < text.length) {
        document.getElementById('animated-text').innerHTML += text.charAt(index);
        index++;
        setTimeout(typeText, 100);
    }
}

window.onload = typeText;


    // Get references to elements
    const searchInput = document.getElementById('search-input');
    const menuItems = document.querySelectorAll('.menu-items .item');
    const noResultsMessage = document.createElement('p');
    noResultsMessage.textContent = "No results found.";
    noResultsMessage.style.display = 'none';
    noResultsMessage.style.color = 'red';
    document.querySelector('.menu-section').appendChild(noResultsMessage);

    // Add event listener for input
    searchInput.addEventListener('input', () => {
        const searchValue = searchInput.value.toLowerCase();
        let hasResults = false;

        menuItems.forEach(item => {
            const itemName = item.querySelector('h3').textContent.toLowerCase();
            if (itemName.includes(searchValue)) {
                item.style.display = 'block'; // Show matching item
                hasResults = true;
            } else {
                item.style.display = 'none'; // Hide non-matching item
            }
        });

        // Show or hide the "No results found" message
        noResultsMessage.style.display = hasResults ? 'none' : 'block';
    });



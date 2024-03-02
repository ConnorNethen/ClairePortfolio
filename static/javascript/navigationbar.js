document.addEventListener('DOMContentLoaded', () => {
    let isOpen = false;
    let scrollTimeout;
    const navbar = document.getElementById('navbar');
    const navItems = document.getElementById('nav-items');
    const togglerImg = document.getElementById('toggler-img');

    // Function that handles user scrolling
    function handleScroll() {
        // User is actively scrolling ...
        navbar.style.backgroundColor = 'transparent'; // Make navigation bar transparent
        closeNavbar(); // Close navigation bar
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            // After 300ms of no scroll events, consider the scrolling stopped
            if (window.scrollY > 0) { // If not at the top, restore the navigation bar's original background color
                navbar.style.backgroundColor = '#848B79';
            } else { // If at the top, keep navigation bar transparent
                navbar.style.backgroundColor = 'transparent';
            }
        }, 300);
    }

    // Event listener for scroll events
    window.addEventListener('scroll', handleScroll);
    
    // Function to toggle the navigation bar's visibility and appearance
    function toggleNavbar() {
        isOpen = !isOpen;
        navItems.classList.toggle('nav-items-visible'); // Make navigation items visible
        document.getElementById('navbar-toggler').classList.toggle('transformed-toggler'); // Toggle border-radius class
        if (isOpen) { // If navigation bar is open ...
            togglerImg.src = '/static/assets/Icons/x_icon.png'; // Set toggler image to 'X' icon
            togglerImg.classList.add('transformed-toggler-img'); // Add transformed toggler image class
            navbar.style.backgroundColor = '#848B79'; // Set navigation bar background color to orginal
        } else { // If the navigation bar is closed ...
            togglerImg.src = '/static/assets/Icons/paint_brush.png'; // Set toggler image to paint brush
            togglerImg.classList.remove('transformed-toggler-img'); // Remove transformed toggler image class

            // Check position of user on the page
            if (window.scrollY > 0) { // If not at the top, restore the navigation bar's orginal background color
                navbar.style.backgroundColor = '#848B79';
            } else { // If at the top, keep navigation bar transparent
                navbar.style.backgroundColor = 'transparent';
            }
        }
    }

    // Function that closes the navigation bar
    function closeNavbar() {
        if (isOpen) { // If the navbar is open, remove transformed toggler class
            document.getElementById('navbar-toggler').classList.remove('transformed-toggler'); // Ensure border-radius returns to normal
        }
        isOpen = false;
        navItems.classList.remove('nav-items-visible'); // Hide navigation items
        togglerImg.src = '/static/assets/Icons/paint_brush.png'; // Set toggler image to paint brush
        togglerImg.classList.remove('transformed-toggler-img'); // Remove transformed toggler image class
    }

    // Event listener for navigation bar toggle
    document.getElementById('navbar-toggler').addEventListener('click', toggleNavbar);

    // Enhance navigation links with smooth scrolling and auto-closing of the navigation bar
    document.querySelectorAll('.nav-link, .navbar-brand').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
                closeNavbar();
            }
        });
    });
});
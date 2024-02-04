document.addEventListener('DOMContentLoaded', () => {
    let isOpen = false;
    let scrollTimeout;
    const navbar = document.getElementById('navbar');
    const navItems = document.getElementById('nav-items');
    const togglerImg = document.getElementById('toggler-img');

    function handleScroll() {
        // User is actively scrolling
        navbar.style.backgroundColor = 'transparent';
        closeNavbar(); // Close the navbar menu
        
        // Throttle updates to reduce repaints and improve performance
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            // After 300ms of no scroll events, consider the scrolling stopped
            if (window.scrollY > 0) {
                // If not at the top, restore the navbar's original background color
                navbar.style.backgroundColor = '#848B79'; // Reset to stylesheet default or set a specific color
            } else {
                // User is at the top of the page, can keep navbar transparent or set to default
                navbar.style.backgroundColor = 'transparent';
            }
        }, 300);
    }

    // Attach event listener for scroll events
    window.addEventListener('scroll', handleScroll);
    
    // Toggle the navigation bar's visibility and appearance
    function toggleNavbar() {
        isOpen = !isOpen;
        navItems.classList.toggle('nav-items-visible');
        if (isOpen) {
            togglerImg.src = '/static/assets/Icons/x_icon.png';
            togglerImg.classList.add('transformed-toggler-img');
            navbar.style.backgroundColor = '#848B79';
        } else {
            togglerImg.src = '/static/assets/Icons/paint_brush.png';
            togglerImg.classList.remove('transformed-toggler-img');
            if (window.scrollY > 0) {
                navbar.style.backgroundColor = '#848B79';
            } else {
                navbar.style.backgroundColor = 'transparent';
            }
        }
    }

    // Close the navigation bar
    function closeNavbar() {
        isOpen = false;
        navItems.classList.remove('nav-items-visible');
        togglerImg.src = '/static/assets/Icons/paint_brush.png';
        togglerImg.classList.remove('transformed-toggler-img');
    }

    document.getElementById('navbar-toggler').addEventListener('click', toggleNavbar);

    // Enhance navigation links with smooth scrolling and auto-closing of the navbar
    document.querySelectorAll('.nav-link').forEach(link => {
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
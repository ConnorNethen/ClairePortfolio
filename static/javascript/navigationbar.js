document.addEventListener('DOMContentLoaded', () => {
    
    let isOpen = false;

    let isVisable = false;
    let isScrolled = false;
    let scrollTimeout;

    const navbar = document.getElementById('navbar');
    const navItems = document.getElementById('nav-items');
    const togglerImg = document.getElementById('toggler-img');

    let lastScrollY = window.scrollY; // Track the last scroll position

    function handleScroll() {
        const currentScrollY = window.scrollY;
        isVisable = window.scrollY > 0 || lastScrollY !== currentScrollY;
        // User is actively scrolling
        closeNavbar(); // Close the navbar menu
        // Throttle updates to reduce repaints and improve performance
        clearTimeout(scrollTimeout);


        // while scrolling, close and hide navbar
        isVisable = false;
        isOpen = false;
        navbar.style.backgroundColor = ''
        // change status of isScrolled after 200ms, make navbar visible again if not at the top of the page
        scrollTimeout = setTimeout(() => {
            navbar.style.backgroundColor = ''
            isVisable = window.scrollY > 0;
        }, 200);
        
        lastScrollY = currentScrollY; // Update last scroll position
        
    }

    window.addEventListener('scroll', handleScroll);


    function toggleNavbar() {
        isOpen = !isOpen;
        navItems.classList.toggle('nav-items-visible');
        togglerImg.src = isOpen ? '/static/assets/Icons/x_icon.png' : '/static/assets/Icons/paint_brush.png';
        if (isOpen) {
            togglerImg.classList.add('transformed-toggler-img');
        } else {
            togglerImg.classList.remove('transformed-toggler-img');
        }
        navbar.style.backgroundColor = isOpen || window.scrollY > 0 ? '#848B79' : 'transparent';
    }

    function closeNavbar() {
        isOpen = false;
        navItems.classList.remove('nav-items-visible');
        togglerImg.src = '/static/assets/Icons/paint_brush.png';
        togglerImg.classList.remove('transformed-toggler-img');
        navbar.style.backgroundColor = window.scrollY > 0 ? '#848B79' : 'transparent';
    }

    

    document.getElementById('navbar-toggler').addEventListener('click', toggleNavbar);

    
    // Close navbar when a nav link is clicked and scroll to link section
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent the default anchor link behavior
            const targetId = this.getAttribute('href'); // Get the href attribute of the clicked link
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const top = targetElement.offsetTop; // Get the distance of the element from the top of the document
                window.scrollTo({
                    top: top,
                    behavior: 'smooth'
                });
                closeNavbar();
            }
        });
    });
});
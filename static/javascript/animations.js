document.addEventListener('DOMContentLoaded', function () {
    var animationImages = document.querySelectorAll('.image-overlay-wrapper');

    // Function to toggle 'show-overlay' class
    function toggleOverlay(event) {
        // Prevent firing the event twice on devices with both mouse and touch screen
        if (event.type === 'touchstart') {
            event.preventDefault();
            event.stopPropagation(); // Stop the event from bubbling up
        }
        this.classList.toggle('show-overlay');
    }

    // Add click and touch event to each '.image-overlay-wrapper' element
    animationImages.forEach(function (imgContainer) {
        imgContainer.addEventListener('click', toggleOverlay);
        imgContainer.addEventListener('touchstart', toggleOverlay);
    });
});

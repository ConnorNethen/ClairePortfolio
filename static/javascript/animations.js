document.addEventListener('DOMContentLoaded', function () {
    var animationImages = document.querySelectorAll('.image-overlay-wrapper');

    // Function to toggle 'show-overlay' class
    function toggleOverlay(event) {
        this.classList.toggle('show-overlay');
    }

    // Add click and touch event to each '.image-overlay-wrapper' element
    animationImages.forEach(function (imgContainer) {
        imgContainer.addEventListener('click', toggleOverlay);
    });
});

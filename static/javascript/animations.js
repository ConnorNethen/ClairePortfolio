document.addEventListener('DOMContentLoaded', function () {
    var animationImages = document.querySelectorAll('.image-overlay-wrapper');

    // Add click event to each '.image-overlay-wrapper' element
    animationImages.forEach(function (imgContainer) {
        imgContainer.addEventListener('click', function () {
            this.classList.toggle('show-overlay');
        });
    });
});

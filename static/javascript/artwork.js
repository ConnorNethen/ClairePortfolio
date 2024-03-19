document.addEventListener('DOMContentLoaded', function () {
    var imgContainers = document.getElementsByClassName('artwork-img-container');
    var images = Array.from(imgContainers).map(function(container, index) {
        var img = container.getElementsByTagName('img')[0];
        return { src: img.src, alt: img.alt, index: index };
    });

    var currentIndex = 0; // Start with the first image
    var totalImages = images.length;
    var modal = document.getElementById('imageModal');
    var modalImg = document.getElementById("img01");
    var captionText = document.getElementById("caption");
    var numberText = document.getElementsByClassName("numberText")[0];
    var prevButton = document.querySelector('.prevSlide'); // Use querySelector for single element
    var nextButton = document.querySelector('.nextSlide'); // Use querySelector for single element


    // Function to open the modal with a specific image
    function openModal(index) {
        var image = images[index];
        modalImg.src = image.src;
        captionText.textContent = image.alt;
        numberText.textContent = (index+1) + ' / ' + totalImages;
        modal.style.display = "flex";
        document.body.style.overflow = 'hidden'; // Disable scrolling
        currentIndex = index; // Update current index
    }

    // Event listeners for prev and next buttons
    prevButton.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent modal from closing
        currentIndex = (currentIndex - 1 + totalImages) % totalImages;
        openModal(currentIndex);
    });

    nextButton.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent modal from closing
        currentIndex = (currentIndex + 1) % totalImages;
        openModal(currentIndex);
    });

    // Setting up click event for each image container
    images.forEach(function(image, index) {
        imgContainers[index].addEventListener('click', function() {
            openModal(index);
        });
    });

    // Close modal functionality
    var span = document.getElementsByClassName("close")[0];
    span.onclick = function(event) {
        modal.style.display = "none";
        document.body.style.overflow = 'visible'; // Re-enable scrolling
        event.stopPropagation(); // Prevent modal from closing again
    };

    modal.addEventListener('click', function() {
        this.style.display = "none";
        document.body.style.overflow = 'visible';
    });

    // Prevent closing modal when clicking on the modal content wrapper
    document.querySelector('.modal-content-wrapper').addEventListener('click', function(event) {
        event.stopPropagation();
    });
});

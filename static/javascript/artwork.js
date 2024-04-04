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
    var mediumText = document.getElementById("medium");
    var numberText = document.getElementsByClassName("numberText")[0];
    var prevButton = document.querySelector('.prevSlide'); // Use querySelector for single element
    var nextButton = document.querySelector('.nextSlide'); // Use querySelector for single element
    let isOpen = false;
    let isTransitioning = false;

    function openModal(index) {
        if (isTransitioning) return; // If a transition is already in-progress, return
        if (isOpen) {
            // Modal is already open, do animation
            loadAndAnimateImage(index);
        } else {
            // Modal has just been opened, no animation
            isOpen = true;
            modal.style.display = "flex";
            document.body.style.overflow = 'hidden'; // Disable scrolling
            var image = images[index];
            modalImg.src = image.src;
            let [capt, medi] = parseText(image.alt);
            captionText.textContent = capt;
            mediumText.textContent = medi;
            numberText.textContent = (index + 1) + ' / ' + totalImages;
            currentIndex = index; // Update current index
        }
    }

    function loadAndAnimateImage(index) {
        if (isTransitioning) return; // If a transition is already in-progress, return
        isTransitioning = true; // Indicate that a transition is starting

        // Animate current image out
        modalImg.classList.add('fade-out');
    
        // Wait for the animation to complete
        setTimeout(() => {
            // Reset classes and set next image
            modalImg.className = 'modal-content'; // Reset all classes
            var image = images[index];
            modalImg.src = image.src;
            let [capt, medi] = parseText(image.alt);
            captionText.textContent = capt;
            mediumText.textContent = medi;
            numberText.textContent = `${index + 1} / ${totalImages}`;
    
            // Animate next image in
            modalImg.classList.add('fade-in');
    
            // Force a reflow ensuring transitions are applied correctly
            void modalImg.offsetHeight;
    
            // Animate next image in by removing the preparation class
            setTimeout(() => {
                modalImg.classList.remove('fade-in');
                isTransitioning = false; // Indicate that a transition has ended
            }, 25); // A minimal timeout to ensure class changes are registered
    
        }, 500); // This timeout should match the longest CSS transition time
    }

    // Function to parse the alt text from the image
    function parseText(text) {
        let index = text.indexOf("/");
        return [text.slice(0,index), text.slice(index+1, text.length)];
    }

    // Event listener for prev button
    prevButton.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent modal from closing
        if (isTransitioning) return; // Prevent action if a transition is in progress
        currentIndex = (currentIndex - 1 + totalImages) % totalImages;
        openModal(currentIndex);
    });

    // Event listener for next button
    nextButton.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent modal from closing
        if (isTransitioning) return; // Prevent action if a transition is in progress
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

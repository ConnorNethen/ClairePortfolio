document.addEventListener('DOMContentLoaded', function () {
    var imgContainers = document.getElementsByClassName('artwork-img-container');
    // Convert HTMLCollection to an array and map to a new array with image details
    var images = Array.from(imgContainers).map(function(container, index) {
        var img = container.getElementsByTagName('img')[0];
        return { src: img.src, alt: img.alt, index: index };
    });

    var currentIndex = 0; // Start with the first image
    var totalImages = images.length; // Total images in gallery
    var modal = document.getElementById('imageModal');
    var modalImg = document.getElementById("img01"); // Image displayed on the modal
    var captionText = document.getElementById("caption"); // Caption of image displayed on the modal
    var mediumText = document.getElementById("medium"); // Medium of image displayed on the modal
    var numberText = document.getElementsByClassName("numberText")[0];
    var prevButton = document.querySelector('.prevSlide');
    var nextButton = document.querySelector('.nextSlide');
    let isOpen = false; // True = Modal is open, False = Modal is closed
    let isTransitioning = false; // True = transition in-progress, False = no transition in-progress

    // Function to open the modal and display the image and its information
    function openModal(index) {
        // Handle current transitioning state
        if (isTransitioning) return; // Exit if transition is in-progress
        if (!isOpen) {
            // Modal has just been opened, no animation
            isOpen = true;
            modal.style.display = "flex";
            document.body.style.overflow = 'hidden'; // Disable scrolling
            updateModal(images[index]);
        } else {
            loadAndAnimateImage(index); // Handle image load and animations
        }
    }

    // Function to load image information and animations
    function loadAndAnimateImage(index) {
        // Handle current transitioning state
        if (isTransitioning) return;
        isTransitioning = true;

        // Animate current image out
        animateOut();
    
        // Wait for the animation to complete
        setTimeout(() => {
            // Reset modal classes & update modal contents
            resetModal();
            updateModal(images[index]);

            // Force a reflow ensuring transitions are applied correctly
            void modalImg.offsetHeight;

            // Animate next image in
            animateIn();
    
            // Ensure the fade-in animation completes
            setTimeout(() => {
                endTransition();
            }, 500); // Ensure class changes are registered
    
        }, 500); // 0.5s animation time
    }

    // Function to parse alt text to seperate caption & medium text
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

    // Setting up click event for each image container to open modal
    images.forEach(function(image, index) {
        imgContainers[index].addEventListener('click', function() {
            openModal(index);
        });
    });

    /* Close modal functionality */
    // Clicking on 'x' will close the modal
    var span = document.getElementsByClassName("close")[0];
    span.onclick = function(event) {
        closeModal(); // Close the modal
        event.stopPropagation(); // Prevent modal from closing again
    };

    // Clicking outside of the image will close the modal
    modal.addEventListener('click', function() {
        closeModal(); // Close the modal
    });

    // Prevent closing modal when clicking inside the modal content wrapper (image)
    document.querySelector('.modal-content-wrapper').addEventListener('click', function(event) {
        event.stopPropagation();
    });

    // Prevent closing modal when clicking on the number text
    document.querySelector('.numberText').addEventListener('click', function(event) {
        event.stopPropagation();
    });

    /***  Helper Functions Below ***/
    // Function to reset the modal image/caption/medium classes
    function resetModal() {
        modalImg.className = 'modal-content';
        captionText.className = 'modal-caption';
        mediumText.className = 'modal-medium';
    }

    // Function to update the modal content with current image information
    function updateModal(image) {
        modalImg.src = image.src; // Image
        let [capt, medi] = parseText(image.alt); // Parse alt text to retrieve caption & medium
        captionText.textContent = capt; // Caption text
        mediumText.textContent = medi; // Medium text
        numberText.textContent = `${image.index + 1} / ${totalImages}`; // Image counter text
        currentIndex = image.index; // update current index
    }

    // Function to close the modal and reset necessary state variables
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'visible'; // Re-enable scrolling
        isOpen = false;
    }

    // Function to animate out the current image
    function animateOut() {
        modalImg.classList.add('modal-fade-out');
        captionText.classList.add('caption-fade-out');
        mediumText.classList.add('medium-fade-out');
    }

    // Function to animate in the next image
    function animateIn() {
        modalImg.classList.add('modal-fade-in');
        captionText.classList.add('caption-fade-in');
        mediumText.classList.add('medium-fade-in');
    }

    // Function to handle the end of a transition
    function endTransition() {
        modalImg.classList.remove('modal-fade-in');
        captionText.classList.remove('caption-fade-in');
        mediumText.classList.remove('medium-fade-in');
        isTransitioning = false; // Indicate that a transition has ended
    }
});

document.addEventListener('DOMContentLoaded', function () {
  let carousel = document.querySelector('.carousel');
  let currentSlide = 1; // Start with original first slide
  let isTransitioning = false; // Flag to prevent initiating another slide change while one is already in progress
  let autoplayInterval; // Autoplay interval reference

  // Boolean variable to prohibit autoplay AFTER the user has interacted with prev/next buttons
  // *FUNCTIONALITY*
  //    - "scrollAutoPlayFlag" will be set to 'true' upon a prev/next button interaction, preventing autoplay from starting again after a scroll event
  //    - Autoplay WILL COMMENCE AGAIN if the user tabs out of the webpage and back in
  //    - This flag ONLY prohibits autoplay from starting again after button interactions while user is on the webpage
  let scrollAutoPlayFlag = false;

  // Get number of original slides
  const slides = carousel.querySelectorAll('.carousel-item');

  // Clone first and last slides for seemless looping
  let cloneFirst = slides[0].cloneNode(true);
  let cloneLast = slides[slides.length - 1].cloneNode(true);

  // Append cloned first slide to end
  carousel.appendChild(cloneFirst);

  // Append cloned last slide to beginning
  carousel.insertBefore(cloneLast, carousel.firstChild);

  const totalSlides = carousel.querySelectorAll('.carousel-item').length; // Update total number of slides in carousel (including clones)

  // Move to the first "real" slide without transition effect
  carousel.style.transition = 'none';
  carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
  
  carousel.offsetHeight; // Force a reflow to apply the transformation immediately

  // Re-enable transitions after initial setup
  setTimeout(() => {
      carousel.style.transition = 'transform 0.75s ease-in-out';
  }, 10);

  // Event listener for nextSlide "button"
  document.getElementById('nextSlide').addEventListener('click', function() {
      // Prevent another action if a transition is in-progress, increment slide
      if (isTransitioning) return;
      moveToSlide(currentSlide + 1);

      // Stop autoplay of slides
      stopAutoPlay();
      scrollAutoPlayFlag = true; // Set "scrollAutoPlayFlag" to 'true'
  });
  
  // Event listener for prevSlide "button"
  document.getElementById('prevSlide').addEventListener('click', function() {
      // Prevent another action if a transition is in-progress, decrement slide
      if (isTransitioning) return;
      moveToSlide(currentSlide - 1);

      // Stop autoplay of slides
      stopAutoPlay();
      scrollAutoPlayFlag = true; // Set "scrollAutoPlayFlag" to 'true'
  });

  // Event listener for the 'transitionend' event to reset the position if needed
  carousel.addEventListener('transitionend', function() {
    // Adjust for when the carousel has moved to a cloned slide, reposition to corresponding "real" slide
    if (currentSlide === 0) { // At last clone slide ...
      carousel.style.transition = 'none'; // Disable transition
      currentSlide = totalSlides - 2; // Set current slide index to LAST "real" slide
      carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
    } else if (currentSlide === totalSlides - 1) { // At first clone slide ...
      carousel.style.transition = 'none'; // Disable transition
      currentSlide = 1; // Set current slide index to FIRST "real" slide
      carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    // Ensure the next frame re-enables transitions smoothly
    requestAnimationFrame(() => {
      // Trigger a reflow to apply the transition property change and reset the transitioning flag
      carousel.offsetHeight;
      carousel.style.transition = 'transform 0.75s ease-in-out';
      isTransitioning = false;
    });
  });

  // Function to move the carousel to the appropriate slide
  function moveToSlide(newSlide) {
    isTransitioning = true; // Transition in progress
    currentSlide = newSlide; // Update current slide index
    carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
  }

  // Event Listener for scroll events
  window.addEventListener('scroll', checkCarouselVisibility);

  // Function to detect the visibility of the carousel on the user's screen
  function checkCarouselVisibility() {
    const inView = helperCheckCarouselVis(); // Call helper function to determine if carousel is in view

    // If the carousel is in view AND the user hasn't interacted with prev/next buttons ...
    if (inView && !scrollAutoPlayFlag) {
      // Carousel in view AND prev/next buttons have not been interacted with, start autoplay
      startAutoPlay();
    } else {
      // Carousel NOT in view OR prev/next buttons have been interacted with, stop autoplay
      stopAutoPlay();
    }
  }

  // Helper Function to determine the location of the carousel in relation to the viewport
  function helperCheckCarouselVis() {
    // Retrieve the carousel element and calculates its current position and dimensions relative to the viewport
    const carouselRect = document.querySelector('.carousel').getBoundingClientRect();

    // Evaluates whether the carousel is in view. The carousel is considered in view if:
    //   - The top edge of the carousel is above the bottom of the viewport (carouselRect.top < window.innerHeight)
    //   AND
    //   - The bottom edge of the carousel is below the top of the viewport (carouselRect.bottom >= 0)
    return (carouselRect.top < window.innerHeight && carouselRect.bottom >= 0);
  }

  // Event Listener for the visibility change event to pause/resume autoplay
  document.addEventListener('visibilitychange', handleVisibilityChange);

  // Function to detect if webpage is visible to the user
  function handleVisibilityChange() {
    if (document.hidden) {
      // Page IS NOT visible, stop autoplay
      stopAutoPlay();
    } else {
      scrollAutoPlayFlag = false; // Reset "scrollAutoPlayFlag" to 'false' (user has returned to webpage)

      // Start autoplay ONLY IF the carousel is in view, otherwise autoplay will begin when carousel comes into view
      if (helperCheckCarouselVis()) {
        startAutoPlay();
      }
    }
  }

  // Function to start or reset the autoplay
  function startAutoPlay() {
    clearInterval(autoplayInterval); // Clear existing interval
    autoplayInterval = setInterval(() => {
      moveToSlide(currentSlide + 1); // Increment slide
    }, 5000); // Change slide every 5000 milliseconds (5 seconds)
  }

  // Function to stop the autoplay
  function stopAutoPlay() {
    clearInterval(autoplayInterval); // Clear existing interval
  }

  // Start autoplay once the document is ready
  startAutoPlay();
});
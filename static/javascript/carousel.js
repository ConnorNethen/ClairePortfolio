document.addEventListener('DOMContentLoaded', function () {
  let carousel = document.querySelector('.c');
  let currentSlide = 1; // Start with original first slide
  let isTransitioning = false; // Flag to prevent initiating another slide change while one is already in progress
  
  let autoplayInterval;

  // Get number of original slides
  const slides = carousel.querySelectorAll('.c-item');

  // Clone first and last slides for seemless looping
  let cloneFirst = slides[0].cloneNode(true);
  let cloneLast = slides[slides.length - 1].cloneNode(true);

  // Append cloned first slide to end
  carousel.appendChild(cloneFirst);

  // Append cloned last slide to beginning
  carousel.insertBefore(cloneLast, carousel.firstChild);

  const totalSlides = carousel.querySelectorAll('.c-item').length; // Update total number of slides in carousel (including clones)

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
  });
  
  // Event listener for prevSlide "button"
  document.getElementById('prevSlide').addEventListener('click', function() {
      // Prevent another action if a transition is in-progress, decrement slide
      if (isTransitioning) return;
      moveToSlide(currentSlide - 1);

      // Stop autoplay of slides
      stopAutoPlay();
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

  // Function to start or reset the autoplay
  function startAutoPlay() {
    clearInterval(autoplayInterval); // Clear existing interval
    autoplayInterval = setInterval(() => {
      moveToSlide(currentSlide + 1); // Increment slide
    }, 6000); // Change slide every 6000 milliseconds (6 seconds)
  }

  // Function to stop the autoplay
  function stopAutoPlay() {
    clearInterval(autoplayInterval); // Clear existing interval
  }

  // Start autoplay once the document is ready
  startAutoPlay();
});
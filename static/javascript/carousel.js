document.addEventListener('DOMContentLoaded', function () {
    let currentSlide = 0;
    const carousel = document.getElementById('carousel');
    const totalSlides = 3;
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.getElementById('nextSlide').addEventListener('click', function() {
      nextSlide();
    });
    
    document.getElementById('prevSlide').addEventListener('click', function() {
      prevSlide();
    });

    carousel.addEventListener('touchstart', function(event) {
      touchStartX = event.touches[0].clientX;
    }, false);

    carousel.addEventListener('touchend', function(event) {
      touchEndX = event.changedTouches[0].clientX;
      handleSwipe();
    }, false);
  
    function nextSlide() {
      currentSlide = (currentSlide + 1) % totalSlides;
      updateCarousel();
    }
    
    function prevSlide() {
      currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
      updateCarousel();
    }
    
    function updateCarousel() {
      const translateX = currentSlide * -100;
      carousel.style.transform = `translateX(${translateX}%)`;
    }

    function handleSwipe() {
      const threshold = 70;
      let distance = touchEndX - touchStartX;

      if (Math.abs(distance) >= threshold) {
        if (distance < 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
  }
});
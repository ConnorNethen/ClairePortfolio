document.addEventListener('DOMContentLoaded', function () {
    let currentSlide = 0;
    const carousel = document.getElementById('carousel');
    const totalSlides = 3;
    
    document.getElementById('nextSlide').addEventListener('click', function() {
      nextSlide();
    });
    
    document.getElementById('prevSlide').addEventListener('click', function() {
      prevSlide();
    });
  
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
  });
  
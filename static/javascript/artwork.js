document.addEventListener('DOMContentLoaded', function () {

    var imgContainers = document.getElementsByClassName('artwork-img-container');

    for (var i = 0; i < imgContainers.length; i++) {
      imgContainers[i].addEventListener('click', function () {
        openModal(this);
      });
    }

    var modal = document.getElementById('imageModal');

    // Function to open the modal
    function openModal(imgContainer) {
        var img = imgContainer.getElementsByTagName('img')[0];
        var modalImg = document.getElementById("img01");
        var captionText = document.getElementById("caption");
        modal.style.display = "flex";
        modalImg.src = img.src;
        captionText.innerHTML = img.alt;
        document.body.style.overflow = 'hidden'; // Disable scrolling
    }

    var span = document.getElementsByClassName("close")[0];

    // When the user clicks on <span> (x), close the modal
    span.onclick = function(event) { 
        modal.style.display = "none";
        document.body.style.overflow = 'visible'; // Re-enable scrolling
        event.stopPropagation(); // Prevent click from closing modal again
    }

    // Prevent closing modal when clicking on the image or caption
    document.querySelector('.modal-content-wrapper').addEventListener('click', function(event) {
        event.stopPropagation(); // This stops the click from reaching the modal background
    });

    // Close the modal if the user clicks anywhere outside of the modal content
    modal.addEventListener('click', function() {
        this.style.display = "none";
        document.body.style.overflow = 'visible'; // Re-enable scrolling
    });

});

async function handleSubmit(event) {
    event.preventDefault(); // Prevents the default form submission action

    // Capture form data
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    let allInvalid = false;
    if (!name || !email || !message) {
        if (!name && !email && !message) { // Missing all fields
            allInvalid = true;
            console.log("All invalid");
            displayCustomAlert('Please fill out all fields', 'allPopup');
        } else {
            hidePopup('allPopup');
        }

        if (!name && !allInvalid) { // Missing name field
            displayCustomAlert('Please enter your name', 'namePopup');
        } else {
            hidePopup('namePopup');
        }

        if (!email && !allInvalid) { // Missing email field
            displayCustomAlert('Please enter your email', 'emailPopup');
        } else {
            hidePopup('emailPopup');
        }

        if (!message && !allInvalid) { // Missing message field
            displayCustomAlert('Please enter a message', 'messagePopup');
        } else {
            hidePopup('messagePopup');
        }
        return; // stop the function
    }
    
    const response = await fetch('/send_email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({name, email, message})
    });

    if (response.ok) {
        console.log('Email sent successfully');
        document.getElementById('contactForm').reset(); // Clear the form
        //alert('Email sent successfully!');
        displayEmailAlert('Email has been sent succesfully!', 'confirmationPopup', true); // confirmation popup upon successful email
    } else {
        console.error('Error sending email');
        //alert('Error sending email. Please try again.');
        displayEmailAlert('Error sending email. Please try again.', 'confirmationPopup', false); // confirmation popup upon unsuccessful email
    }
}

document.getElementById('contactForm').addEventListener('submit', handleSubmit);

function displayCustomAlert(message, section) {
    var popup = document.getElementById(section);
    popup.innerText = message; // Set the popup message
    popup.style.display = 'block'; // Make the popup visible
    popup.style.animation = 'fadeIn 0.5s forwards'; // Apply fade in animation

    // Set timeout to fade out the popup after 3.5 seconds
    setTimeout(() => {
        popup.style.animation = 'fadeOut 0.5s forwards'; // Apply fade out animation
        setTimeout(() => popup.style.display = 'none', 500); // Hide after animation
    }, 3500);
}

function displayEmailAlert(message, section, valid) {
    var popup = document.getElementById(section);
    if (valid) {
        popup.style = 'background-color: green';
    } else {
        popup.style = 'background-color: red';
    }
    popup.innerText = message; // Set the popup message
    popup.style.display = 'block'; // Make the popup visible
    popup.style.animation = 'fadeIn 0.5s forwards'; // Apply fade in animation

    // Set timeout to fade out the popup after 3.5 seconds
    setTimeout(() => {
        popup.style.animation = 'fadeOut 0.5s forwards'; // Apply fade out animation
        setTimeout(() => popup.style.display = 'none', 500); // Hide after animation
    }, 3500);
}

function hidePopup(section) {
    var popup = document.getElementById(section);
    popup.style.display = 'none'; // Directly hide the popup
}
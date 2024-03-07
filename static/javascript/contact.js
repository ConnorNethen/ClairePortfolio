async function handleSubmit(event) {
    event.preventDefault(); // Prevents the default form submission action

    // Capture form data
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    // Reference to the submit button
    const submitButton = document.getElementById('submit');

    let allInvalid = false;
    if (!name || !email || !message) {
        if (!name && !email && !message) { // Missing all fields
            allInvalid = true;
            displayCustomAlert('Please fill out all fields', 'allPopup');
        }

        if (!name && !allInvalid) { // Missing name field
            displayCustomAlert('Please enter your name', 'namePopup');
        }

        if (!email && !allInvalid) { // Missing email field
            displayCustomAlert('Please enter your email', 'emailPopup');
        }

        if (!message && !allInvalid) { // Missing message field
            displayCustomAlert('Please enter a message', 'messagePopup');
        }
        return; // stop the function
    }

    // Disable submit button while send_email operation completes
    submitButton.disabled = true;
    
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
        displayEmailAlert('Email has been sent succesfully!', 'confirmationPopup', true); // Confirmation popup upon successful email
    } else {
        response.json().then(data => {
            console.error('Error sending email:', data.error);
            displayEmailAlert(data.error, 'confirmationPopup', false); // Display the specific error message
        });
    }

    // Re-enable the submit button after the send_email operation completes
    submitButton.disabled = false;
}

// Flags for popups
//   FALSE when inactive
//   TRUE when displayed on screen until it is finised with it's fade-out animation
const popupsActive = {
    'allPopup': false,
    'namePopup': false,
    'emailPopup': false,
    'messagePopup': false,
    'confirmationPopup': false,
};

document.getElementById('contactForm').addEventListener('submit', handleSubmit);

function displayCustomAlert(message, section) {
    // Update activated popups ...
    if (popupsActive[section]) return; // Prevent overlapping animations
    popupsActive[section] = true; // Mark popup section as active

    var popup = document.getElementById(section);
    popup.innerText = message; // Set the popup message
    popup.style.display = 'block'; // Make the popup visible
    popup.style.animation = 'fadeIn 0.5s forwards'; // Apply fade in animation

    // Set timeout to fade out the popup after 3.5 seconds
    setTimeout(() => {
        popup.style.animation = 'fadeOut 0.5s forwards'; // Apply fade out animation
        setTimeout(() => {
            hidePopup(section);
        }, 500);
    }, 3500);
}

function displayEmailAlert(message, section, valid) {
    // Update activated popups ...
    if (popupsActive[section]) return; // Prevent overlapping animations
    popupsActive[section] = true; // Mark popup section as active


    var popup = document.getElementById(section);
    popup.style.backgroundColor = valid ? 'green' : 'red'; // Valid email (green), invalid email (red)
    popup.innerText = message; // Set the popup message
    popup.style.display = 'block'; // Make the popup visible
    popup.style.animation = 'fadeIn 0.5s forwards'; // Apply fade in animation

    // Set timeout to fade out the popup after 3.5 seconds
    setTimeout(() => {
        popup.style.animation = 'fadeOut 0.5s forwards'; // Apply fade out animation
        setTimeout(() => {
            hidePopup(section);
        }, 500);
    }, 3500);
}

function hidePopup(section) {
    var popup = document.getElementById(section);
    popup.style.display = 'none'; // Directly hide the popup
    popupsActive[section] = false; // Mark as inactive
}
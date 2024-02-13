async function handleSubmit(event) {
    event.preventDefault(); // Prevents the default form submission action

    // Capture form data
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    const response = await fetch('/send_email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({name, email, message})
    });

    if (response.ok) {
        console.log('Email sent successfully');
        // Optionally, clear the form or give feedback to the user
    } else {
        console.error('Error sending email');
    }
}

document.getElementById('contactForm').addEventListener('submit', handleSubmit);

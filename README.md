# Claire Hanel Portfolio Website

This repository hosts the source code for a portfolio website dedicated to showcasing the creative works of Claire Hanel, a talented illustrator and animator from Milwaukee, Wisconsin. The website features a selection of Claire's finest illustrations and animations, provides background information about her artistic journey, and includes a contact form for reaching out.

# Claire's Professional Portfolio URL
https://claire-hanel.azurewebsites.net

## Features

- **Dynamic Carousel**: Highlights selected artworks and projects in a visually engaging slider.
- **Art Gallery**: Displays Claire's artwork with a modal lightbox for detailed viewing.
- **Animation Showreel**: Links to external platforms hosting her animation work.
- **Responsive Design**: Ensures the website is functional and aesthetically pleasing across various devices and screen sizes.
- **Contact Form**: Integrated with backend functionality to handle inquiries via email.

## Technology Stack

- **HTML/CSS**: For structuring and styling the website.
- **JavaScript**: For dynamic content interaction.
- **Flask**: A lightweight WSGI web application framework used to serve the website.
- **Flask-Mail**: To handle outgoing emails from the contact form.
- **Python**: Back-end logic including email rate limiting and form data validation.

## Project Structure

Below is an outline of the core project files and directories:

- `.github/workflows/`: CI/CD pipeline configurations for automated testing and deployment.
- `static/`: Contains all the static assets used by the website.
  - `assets/`: Images and icons used throughout the site.
    - `Icons/`: Various icons for UI elements.
    - `images/`: Artwork and photographs displayed in the portfolio.
  - `javascript/`: Interactive scripts for dynamic features.
    - `animations.js`: Handles the animations section interactivity.
    - `artwork.js`: Script for the art gallery lightbox.
    - `carousel.js`: Controls the image carousel behavior.
    - `contact.js`: Manages the contact form submission and validation.
    - `navigationbar.js`: Ensures responsive navigation bar functionality.
  - `styles/`: CSS stylesheets for styling the website.
    - `animations.css`: Styling for the animations section.
    - `artwork.css`: Styling for the artwork section and gallery lightbox.
    - `carousel.css`: Styling for the homepage image carousel.
    - `contact.css`: Styling for the contact section.
    - `navigationbar.css`: Styling for the navigation bar.
    - `profile.css`: Styling for the profile section.
- `templates/`: HTML templates rendered by Flask.
  - `home.html`: The main HTML file that serves as the entry point for the website.
- `venv/`: Virtual environment directory for Python packages.
- `.env`: Environment variables for configuration (not tracked in git for security).
- `.gitignore`: Specifies intentionally untracked files that Git should ignore.
- `app.py`: The Flask application's main entry point and backend logic.
- `gittattributes`: Git attributes configuration.
- `README.md`: Documentation file.
- `requirements.txt`: Specifies the Python dependencies for the project.

from flask import Flask, render_template, request, jsonify
from flask_mail import Mail, Message
import os
from dotenv import load_dotenv
import re
from email_validator import validate_email, EmailNotValidError
from datetime import datetime, timedelta
import collections
import logging

# Load environment variables
load_dotenv()

app = Flask(__name__)
logging.basicConfig(level=logging.DEBUG)

# Store email send timestamps, keyed by user IP
email_send_times = collections.defaultdict(list)

# Configure Flask-Mail with environment variables and proper type conversion
app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS', 'true').lower() in ['true', '1', 't', 'y', 'yes']
app.config['MAIL_USE_SSL'] = os.getenv('MAIL_USE_SSL', 'false').lower() in ['true', '1', 't', 'y', 'yes']
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
mail = Mail(app)


# Render the homepage
@app.route('/')
def home():
    return render_template('home.html')

"""
Function that checks if a user can send an email based on the rate limit

Parameters:
  - user_id: The identifier for the user, IP address.
    
Returns:
  - Tuple of (bool, int):
    - First element indicates if the email can be sent
    - Second element indicates wait time (in seconds) if the rate limit is exceeded
"""
def can_send_email(user_id):
    now = datetime.now()
    two_minutes_ago = now - timedelta(minutes=2)
    
    # Filter out timestamps older than 1 minute
    recent_times = [t for t in email_send_times[user_id] if t > two_minutes_ago]
    email_send_times[user_id] = recent_times  # Update the list with only recent timestamps
    logging.debug(f"Recent times for {user_id}: {recent_times}")
    
    # Allow only 2 emails in 2 minutes
    if len(recent_times) < 2:
        return True, 0  # True to send, 0 wait time
    
    # If rate limit exceeded, calculate wait time based on the most recent email sent
    recent_times_sorted = sorted(recent_times)
    most_recent_email_time = recent_times_sorted[-1]
    allowed_time = most_recent_email_time + timedelta(minutes=2)
    wait_time = (allowed_time - now).total_seconds()
    return False, int(wait_time)  # False to send, return current wait time

# Endpoint to send an email to Claire with the contact form information (rate limits apply)
@app.route('/send_email', methods=['POST'])
def send_email():
    ### Record and ensure the user can send an email (has not sent more that 2 emails in 2 minutes) ###
    user_id = request.remote_addr  # Use client IP as a simple identifier
    allowed, waitTime = can_send_email(user_id)
    if not allowed: # User has already sent more than allowed number of emails in 2 minutes, deny email
        return jsonify({'error':'Rate limit exceeded. Please wait ' + str(waitTime) + ' seconds before sending another email.'}), 429

    data = request.json
    # Just in case (may be redundant) ...
    if not data or 'name' not in data or 'email' not in data or 'message' not in data:
        return jsonify({'error':'Missing data'}), 400
    
    # Populate name, email, message_body fields
    name = data.get('name')
    email = data.get('email')
    message_body = data.get('message')

    # Validate user input (name, email, message_body)
    isValid, error_message = validateInfo(name, email, message_body)
    if not isValid:
        return jsonify({'error': error_message}), 400

    try:
        msg = Message('Contact Form Submission',
                    sender= os.getenv('SENDER'),
                    recipients=[os.getenv('RECIPIENT')])
        msg.body = f"{name} visited your website and would like to contact you!\nEmail: {email}\nMessage:\n{message_body}"
        mail.send(msg)

        # Email can be sent, update send times
        email_send_times[user_id].append(datetime.now()) 
    except Exception as e:
        logging.error(f"Failed to send email: {e}")
        return jsonify({'error': 'Failed to send email'}), 500
    
    return jsonify({'status': 'Email sent successfully'})

"""
Function that validates contact form input

Parameters:
  - n: Name
  - em: Email Address
  - m: Message
    
Returns:
  - Tuple of (bool, str):
    - First element indicates if the input is valid 
    - Second element indicates an error message if the input is invalid
"""
def validateInfo(n, em, m):
    # Validation patterns
    namePattern = re.compile('[^a-zA-Z\s]')
    messagePattern = re.compile('[^a-zA-Z\s0-9,.!?@()"\']')

    # validate name ...
    if len(n) > 40:
        return False, "Invalid name: Limit of 40 characters"
    if re.search(namePattern, n):
        return False, "Invalid name: Illegal characters found"
    
    # Validate email address ...
    try:
        # Ensire the email address:
        #    - is valid (correct format)
        #    - can receive emails (valid Mail Exchange records)
        validate_email(em, check_deliverability=True)
    except EmailNotValidError as e:
        # The exception message is a human-readable explanation of
        # why it's not a valid (or deliverable) email address
        return False, str(e) 

    # Validate message ...
    if len(m) > 250:
        return False, "Invalid message: Limit of 250 characters"
    if re.search(messagePattern, m):
        return False, "Invalid message: Common punctuation only"
    if  ".exe" in m:
        return False, "Invalid message: Please remove '.exe'"
    
    # User information is valid, return True and a placeholder error message
    return True, "none"
    
if __name__ == '__main__':
    app.run()

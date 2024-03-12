from flask import Flask, render_template, request, jsonify
from flask_mail import Mail, Message
import os
from dotenv import load_dotenv
import re
from email_validator import validate_email, EmailNotValidError
from datetime import datetime, timedelta
import collections
import logging

load_dotenv()
app = Flask(__name__)

@app.route('/')
def home():
    return render_template('home.html')

def str_to_bool(s):
    return s.lower() in ['true', '1', 't', 'y', 'yes']

# Store email send timestamps, keyed by user IP
email_send_times = collections.defaultdict(list)

logging.basicConfig(level=logging.DEBUG)

def can_send_email(user_id):
    now = datetime.now()
    two_minutes_ago = now - timedelta(minutes=2)
    
    # Filter out timestamps older than 1 minute
    recent_times = [t for t in email_send_times[user_id] if t > two_minutes_ago]
    email_send_times[user_id] = recent_times  # Update the list with only recent timestamps
    logging.debug(f"Recent times for {user_id}: {recent_times}")
    
    # Check if less than 2 emails have been sent in the last minute
    if len(recent_times) < 10: ## CHANGE BACK TO 2
        return True, 0  # True to send, 0 wait time
    
    # If rate limit exceeded, calculate wait time based on the most recent email sent
    recent_times_sorted = sorted(recent_times)
    most_recent_email_time = recent_times_sorted[-1]
    allowed_time = most_recent_email_time + timedelta(minutes=2)
    wait_time = (allowed_time - now).total_seconds()
    return False, int(wait_time)  # False to send, return wait time in seconds

# Configure Flask-Mail with environment variables and proper type conversion
app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 587))  # Ensure it's an integer
app.config['MAIL_USE_TLS'] = str_to_bool(os.getenv('MAIL_USE_TLS', 'true'))
app.config['MAIL_USE_SSL'] = str_to_bool(os.getenv('MAIL_USE_SSL', 'false'))
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
mail = Mail(app)

@app.route('/send_email', methods=['POST'])
def send_email():
    ### Record and ensure the user can send an email (has not sent more that 2 emails in 2 minutes) ###
    user_id = request.remote_addr  # Use client IP as a simple identifier
    allowed, waitTime = can_send_email(user_id)
    if not allowed: # User has already sent more than allowed number of emails in 2 minutes, deny email
        return jsonify({'error':'Rate limit exceeded. Please wait ' + str(waitTime) + ' seconds before sending another email.'}), 429

    data = request.json

    # Just in case... may be redundant (can remove later)
    if not data or 'name' not in data or 'email' not in data or 'message' not in data:
        return jsonify({'error':'Missing data'}), 400
    
    # populate name, email, message_body fields
    name = data.get('name')
    email = data.get('email')
    message_body = data.get('message')

    ### Validate user input (name, email, message) ###
    isValid, error_message = validateInfo(name, email, message_body)
    if not isValid:
        return jsonify({'error': error_message}), 400

    try:
        msg = Message('Contact Form Submission',
                    sender= os.getenv('SENDER'),
                    recipients=[os.getenv('RECIPIENT')])
        msg.body = f"{name} visited your website and would like to contact you!\nEmail: {email}\nMessage:\n{message_body}"
        mail.send(msg)
        email_send_times[user_id].append(datetime.now()) # email can be send, update send times
    except Exception as e:
        return jsonify({'error': 'Failed to send email'}), 500
    
    return jsonify({'status': 'Email sent successfully'})

# Function that validates user's information
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
        # Check that the email address is valid. Turn on check_deliverability
        # for first-time validations like on account creation pages (but not
        # login pages).
        validate_email(em, check_deliverability=True)
    except EmailNotValidError as e:
        # The exception message is human-readable explanation of why it's
        # not a valid (or deliverable) email address.
        return False, str(e)
    
    # Validate message ...
    if len(m) > 250:
        return False, "Invalid message: Limit of 250 characters"
    if re.search(messagePattern, m):
        return False, "Invalid message: Common punctuation only"
    if  ".exe" in m:
        return False, "Invalid message: Please remove '.exe'"
    
    return True, "none" # User information is valid
    
if __name__ == '__main__':
    app.run()

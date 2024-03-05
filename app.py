from flask import Flask, render_template, request, jsonify
from flask_mail import Mail, Message
import os
from dotenv import load_dotenv
import re

load_dotenv()
app = Flask(__name__)

@app.route('/')
def home():
    return render_template('home.html')

def str_to_bool(s):
    return s.lower() in ['true', '1', 't', 'y', 'yes']

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
    data = request.json

    if not data or 'name' not in data or 'email' not in data or 'message' not in data:
        return jsonify({'error':'Missing data'}), 400
    
    name = data.get('name')
    email = data.get('email')
    message_body = data.get('message')

    ### Validate user input (name, email, message) ###
    isValid, error_message = validateInfo(name, email, message_body)
    if not isValid:
        return jsonify({'error': error_message}), 400

    if not name or not email or not message_body:
        return jsonify({'error':'Invalid input'}), 400

    try:
        msg = Message('Contact Form Submission',
                    sender= os.getenv('SENDER'),
                    recipients=[os.getenv('RECIPIENT')])
        msg.body = f"{name} visited your website and would like to contact you!\nEmail: {email}\nMessage:\n{message_body}"
        mail.send(msg)
    except Exception as e:
        return jsonify({'error': 'Failed to send email'}), 500
    
    return jsonify({'status': 'Email sent successfully'})

# Function that validates user's information
def validateInfo(n, e, m):
    # Validation patterns
    namePattern = re.compile('[^a-zA-Z\s]')
    emailPattern = re.compile('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
    messagePattern = re.compile('[^a-zA-Z\s0-9,.!?@%$&():;"]')

    # validate name ...
    if len(n) > 40:
        return False, "Invalid name: Limit of 40 characters"
    if re.search(namePattern, n):
        return False, "Invalid name: Illegal characters found"
    
    # Validate email address ...
    if len(e) > 40:
        return False, "Invalid email: Limit of 40 characters"
    exe_pattern = re.compile(r'\.exe$', re.IGNORECASE)
    if not re.search(emailPattern, e) or exe_pattern.search(e):
        return False, "Invalid email: Illegal characters found"
    
    # Validate message ...
    if len(m) > 250:
        return False, "Invalid message: Limit of 250 characters"
    if re.search(messagePattern, m) or ".exe" in m:
        return False, "Invalid message: Illegal characters found"
    
    return True, "none" # User information is valid
    
if __name__ == '__main__':
    app.run()

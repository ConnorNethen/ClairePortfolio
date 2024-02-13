from flask import Flask, render_template, request, jsonify
from flask_mail import Mail, Message

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('home.html')

# Configure Flask-Mail
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_USERNAME'] = 'spamportfolio1@gmail.com'
app.config['MAIL_PASSWORD'] = 'gvjh wwxj vjny heuu'
mail = Mail(app)

@app.route('/send_email', methods=['POST'])
def send_email():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    message_body = data.get('message')

    msg = Message('Contact Form Submission',
                  sender='spamportfolio1@gmail.com',
                  recipients=['ConnorNethen258@gmail.com'])
    msg.body = f"{name} visited your website and would like to contact you!\nEmail: {email}\nMessage: {message_body}"
    mail.send(msg)

    return jsonify({'status': 'Email sent successfully'})


if __name__ == '__main__':
    app.run()

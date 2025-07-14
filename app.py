from flask import Flask, render_template, request, redirect, url_for
import psycopg2
import bcrypt

app = Flask(__name__)

# Database configuration
DB_CONFIG = {
    "dbname": "portfolio",
    "user": "postgres",
    "password": "123",  # Replace with your PostgreSQL password
    "host": "localhost"
}

def get_db_connection():
    return psycopg2.connect(**DB_CONFIG)

def hash_password(password):
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

@app.route('/')
def home():
    return redirect(url_for('signup'))

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    message = None
    success = False
    conn = None  # Initialize connection variable
    
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            
            # Check if email already exists
            cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
            if cursor.fetchone():
                message = "Email already exists!"
            else:
                # Hash the password before storing
                hashed_pw = hash_password(password)
                
                cursor.execute(
                    "INSERT INTO users (email, password) VALUES (%s, %s)",
                    (email, hashed_pw)
                )
                conn.commit()
                
                message = "Account created successfully!"
                success = True
                
        except Exception as e:
            message = f"Error: {str(e)}"
            if conn:
                conn.rollback()
                
        finally:
            if conn:
                conn.close()
    
    return render_template('signup.html', message=message, success=success)

if __name__ == '__main__':
    app.run(debug=True)

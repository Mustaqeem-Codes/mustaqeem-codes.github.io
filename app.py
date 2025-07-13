from flask import Flask, request, render_template
import psycopg2

app = Flask(__name__)

# PostgreSQL database config
conn = psycopg2.connect(
    host="localhost",
    dbname="Portfolio",
    user="postgres",
    password="123"  # 🔁 Replace with your actual PostgreSQL password
)
cur = conn.cursor()

@app.route('/')
def home():
    return render_template('Test.html')  # Flask looks inside templates folder automatically

@app.route('/submit', methods=['POST'])
def submit():
    email = request.form.get('email')
    password = request.form.get('password')

    if email and password:
        try:
            cur.execute("INSERT INTO users (email, password) VALUES (%s, %s)", (email, password))
            conn.commit()
            return "✅ Data saved successfully!"
        except Exception as e:
            conn.rollback()
            return f"❌ Error: {e}"
    else:
        return "⚠️ Both fields required."

if __name__ == '__main__':
    app.run(debug=True)

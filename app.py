from flask import Flask, render_template, request, jsonify, session
import hashlib
import os

app = Flask(__name__)
app.secret_key = os.urandom(24)

# In-memory user store (replace with a database for production)
users = {
    "admin": {
        "password": hashlib.sha256("admin123".encode()).hexdigest(),
        "name": "Administrator"
    }
}

# ── ROUTES ──

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username", "").strip()
    password = data.get("password", "")
    hashed = hashlib.sha256(password.encode()).hexdigest()

    if username in users and users[username]["password"] == hashed:
        session["user"] = username
        session["name"] = users[username]["name"]
        return jsonify({"success": True, "name": users[username]["name"]})
    return jsonify({"success": False, "message": "Invalid username or password."}), 401


@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()
    name     = data.get("name", "").strip()
    username = data.get("username", "").strip()
    password = data.get("password", "")

    if not name or not username or not password:
        return jsonify({"success": False, "message": "All fields are required."}), 400
    if username in users:
        return jsonify({"success": False, "message": "Username already taken."}), 409

    users[username] = {
        "password": hashlib.sha256(password.encode()).hexdigest(),
        "name": name
    }
    return jsonify({"success": True, "message": "Account created. Please sign in."})


@app.route("/api/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"success": True})


@app.route("/api/analyze", methods=["POST"])
def analyze():
   # Session removed for mobile API

    data   = request.get_json()
    age    = float(data.get("age", 0))
    sugar  = float(data.get("sugar", 0))
    bp     = float(data.get("bp", 0))
    bmi    = float(data.get("bmi", 0))
    hr     = float(data.get("hr", 0))
    hba1c  = float(data.get("hba1c", 0))
    family = int(data.get("family", 0))

    score = 0

    # Fasting sugar
    if sugar >= 126:   score += 30
    elif sugar >= 100: score += 16
    elif sugar < 70:   score += 10

    # HbA1c
    if hba1c >= 6.5:   score += 22
    elif hba1c >= 5.7: score += 12

    # Blood pressure
    if bp >= 140:   score += 10
    elif bp >= 120: score += 5

    # BMI
    if bmi >= 35:   score += 10
    elif bmi >= 25: score += 5

    # Age
    if age >= 60:   score += 8
    elif age >= 45: score += 4

    # Family history
    score += family * 4

    # Heart rate
    if hr > 100 or hr < 50: score += 4

    score = min(int(score), 100)

    if score < 25:
        level = "Low Risk"
        recs  = [
            "Maintain current healthy lifestyle",
            "Annual fasting glucose check recommended",
            "Stay physically active — 150 min/week",
            "Balanced diet low in refined sugars"
        ]
    elif score < 50:
        level = "Moderate Risk"
        recs  = [
            "Reduce refined carbohydrate intake",
            "Monitor fasting sugar every 3 months",
            "Aim for BMI between 18.5 and 24.9",
            "Consult physician for glucose tolerance test",
            "Increase aerobic activity"
        ]
    elif score < 75:
        level = "High Risk"
        recs  = [
            "Immediate physician consultation advised",
            "HbA1c monitoring every 3 months",
            "Structured diabetes prevention program",
            "Low-glycaemic diet plan with dietitian",
            "Blood pressure management essential",
            "Weight loss target of 5–7% body weight"
        ]
    else:
        level = "Critical Risk"
        recs  = [
            "Urgent medical evaluation required",
            "Possible diabetic condition — confirm diagnosis",
            "Medication assessment with endocrinologist",
            "Strict dietary control — avoid all sugars/refined carbs",
            "Daily blood glucose self-monitoring",
            "Comprehensive cardiovascular screening"
        ]

    return jsonify({
        "success": True,
        "score":   score,
        "level":   level,
        "recs":    recs,
        "patient": "Guest User"
    })


    print("=" * 50)
    print("  VitalCheck — Sugar Risk Analysis")
    print("  Running at: http://127.0.0.1:5000")
    print("  Default login: admin / admin123")
    print("=" * 50)
    app.run(debug=True, port=5000)

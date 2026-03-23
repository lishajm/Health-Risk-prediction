╔══════════════════════════════════════════════════════╗
║         VitalCheck — Sugar Risk Analysis             ║
║         Flask Web Application                        ║
╚══════════════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PROJECT STRUCTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  VitalCheck/
  ├── app.py                  ← Run this to start the server
  ├── requirements.txt        ← Python dependencies
  ├── README.txt              ← This file
  ├── templates/
  │   └── index.html          ← Main HTML template
  └── static/
      ├── css/
      │   └── style.css       ← All styles (dark luxury theme)
      └── js/
          ├── background.js   ← Animated ECG + particles canvas
          ├── auth.js         ← Login / Register / Logout
          └── app.js          ← Risk analysis + PDF download

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 HOW TO RUN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 1 — Install Python (3.8+)
  Download from: https://www.python.org/downloads/

STEP 2 — Install dependencies
  Open a terminal in this folder and run:

    pip install -r requirements.txt

STEP 3 — Start the server
  In the same terminal, run:

    python app.py

STEP 4 — Open in browser
  Go to: http://127.0.0.1:5000

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 DEFAULT LOGIN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Username : admin
  Password : admin123

  You can also register a new account from the login page.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 FEATURES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ✦ Elegant Luxury dark UI — Red & Gold theme
  ✦ Animated ECG heartwave + particles background
  ✦ Login & Register (Flask session-based auth)
  ✦ 8 biomarker inputs:
      Age, Gender, Fasting Sugar, Blood Pressure,
      BMI, Heart Rate, HbA1c, Family History
  ✦ Risk Score 0–100 → Low / Moderate / High / Critical
  ✦ Clinical recommendations per risk level
  ✦ PDF Report download (dark luxury A4)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 SUGAR THRESHOLDS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Fasting Sugar:   Normal <100 | Pre-diabetic 100–125 | Diabetic ≥126 mg/dL
  HbA1c:          Normal <5.7  | Pre-diabetic 5.7–6.4 | Diabetic ≥6.5 %

  NOTE: For informational purposes only.
        Always consult a qualified physician.

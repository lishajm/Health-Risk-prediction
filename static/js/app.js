// ── RISK ANALYSIS + PDF ──
let lastResult = null;

async function analyze() {
  const age    = document.getElementById('age').value;
  const gender = document.getElementById('gender').value;
  const sugar  = document.getElementById('sugar').value;
  const bp     = document.getElementById('bp').value;
  const bmi    = document.getElementById('bmi').value;
  const hr     = document.getElementById('hr').value;
  const hba1c  = document.getElementById('hba1c').value;
  const family = document.getElementById('family').value;

  if (!age || !sugar || !bp || !bmi || !hr || !hba1c) {
    alert('Please fill in all fields.');
    return;
  }

  try {
    const res  = await fetch('/api/analyze', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ age, gender, sugar, bp, bmi, hr, hba1c, family }),
    });
    const data = await res.json();

    if (!data.success) { alert(data.message || 'Analysis failed.'); return; }

    const { score, level, recs, patient } = data;

    // Color map
    const colorMap = {
      'Low Risk':      { color: 'rgba(39,174,96,0.08)',   text: '#2ecc71' },
      'Moderate Risk': { color: 'rgba(184,144,42,0.08)',  text: '#c9a040' },
      'High Risk':     { color: 'rgba(230,126,34,0.1)',   text: '#e67e22' },
      'Critical Risk': { color: 'rgba(192,57,43,0.12)',   text: '#e74c3c' },
    };
    const { color: rColor, text: rText } = colorMap[level] || colorMap['Moderate Risk'];

    // Update hero
    const hero = document.getElementById('riskHero');
    hero.style.setProperty('--risk-color', rColor);
    hero.style.setProperty('--risk-text',  rText);
    hero.style.borderLeftColor = rText;
    document.getElementById('riskLabel').textContent  = level;
    document.getElementById('riskLabel').style.color  = rText;
    document.getElementById('riskScore').textContent  = score;
    document.getElementById('riskScore').style.color  = rText;

    // Animated bar
    setTimeout(() => {
      document.getElementById('scoreBar').style.width = score + '%';
    }, 50);

    // Metrics grid
    const metrics = [
      { label: 'Fasting Sugar', val: sugar + ' mg/dL' },
      { label: 'HbA1c',        val: hba1c + ' %' },
      { label: 'Blood Pressure',val: bp + ' mmHg' },
      { label: 'BMI',           val: bmi },
      { label: 'Heart Rate',    val: hr + ' bpm' },
      { label: 'Age',           val: age + ' yrs' },
    ];
    document.getElementById('metricsGrid').innerHTML = metrics.map(m =>
      `<div class="metric-tile"><div class="m-label">${m.label}</div><div class="m-val">${m.val}</div></div>`
    ).join('');

    // Recommendations
    document.getElementById('recsList').innerHTML = recs.map(r =>
      `<div class="rec-item">${r}</div>`
    ).join('');

    // Store for PDF
    lastResult = { age, gender, sugar, bp, bmi, hr, hba1c, family, score, level, recs, patient };

    document.getElementById('resultEmpty').style.display = 'none';
    document.getElementById('resultCard').classList.add('show');

  } catch (e) {
    alert('Network error. Is the server running?');
  }
}

function downloadPDF() {
  if (!lastResult) return;
  const { jsPDF }  = window.jspdf;
  const doc        = new jsPDF({ unit: 'mm', format: 'a4' });
  const W = 210, M = 18;
  const { age, sugar, bp, bmi, hr, hba1c, score, level, recs, patient } = lastResult;

  // Background
  doc.setFillColor(7, 8, 13);
  doc.rect(0, 0, W, 297, 'F');

  // Gold top bar
  doc.setFillColor(184, 144, 42);
  doc.rect(0, 0, W, 1.5, 'F');

  // Red accent bar
  doc.setFillColor(192, 57, 43);
  doc.rect(0, 1.5, W, 1, 'F');

  // Title
  doc.setTextColor(184, 144, 42);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('HealthRiskPrediction', M, 22);

  doc.setTextColor(160, 152, 128);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('SUGAR RISK ANALYSIS REPORT', M, 28);

  const now = new Date();
  doc.text(`Generated: ${now.toLocaleString()}  |  Patient: ${patient || '—'}`, M, 33);

  // Divider
  doc.setDrawColor(184, 144, 42);
  doc.setLineWidth(0.3);
  doc.line(M, 37, W - M, 37);

  // Risk score box
  const riskColors = {
    'Low Risk':      [46, 204, 113],
    'Moderate Risk': [201, 160, 64],
    'High Risk':     [230, 126, 34],
    'Critical Risk': [231, 76, 60],
  };
  const [r2, g2, b2] = riskColors[level] || [201, 160, 64];

  doc.setFillColor(20, 15, 10);
  doc.rect(M, 42, W - M*2, 30, 'F');
  doc.setDrawColor(r2, g2, b2);
  doc.setLineWidth(0.5);
  doc.rect(M, 42, W - M*2, 30);
  doc.setLineWidth(2);
  doc.line(M, 42, M, 72);

  doc.setTextColor(160, 152, 128);
  doc.setFontSize(7);
  doc.text('RISK CLASSIFICATION', M + 6, 50);

  doc.setTextColor(r2, g2, b2);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(level, M + 6, 61);

  doc.setFontSize(28);
  doc.text(String(score), W - M - 25, 62);
  doc.setFontSize(8);
  doc.setTextColor(160, 152, 128);
  doc.setFont('helvetica', 'normal');
  doc.text('/ 100', W - M - 12, 66);

  // Score bar
  doc.setFillColor(30, 25, 20);
  doc.rect(M, 75, W - M*2, 4, 'F');
  doc.setFillColor(r2, g2, b2);
  doc.rect(M, 75, (W - M*2) * score / 100, 4, 'F');

  // Biomarker table
  doc.setTextColor(184, 144, 42);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('BIOMARKER SUMMARY', M, 90);
  doc.setDrawColor(184, 144, 42);
  doc.setLineWidth(0.2);
  doc.line(M, 92, W - M, 92);

  const mData = [
    ['Fasting Blood Sugar', sugar + ' mg/dL', +sugar >= 126 ? 'Diabetic' : +sugar >= 100 ? 'Pre-diabetic' : 'Normal'],
    ['HbA1c',              hba1c + ' %',      +hba1c >= 6.5 ? 'Diabetic' : +hba1c >= 5.7 ? 'Pre-diabetic' : 'Normal'],
    ['Blood Pressure',     bp + ' mmHg',      +bp >= 140 ? 'High' : +bp >= 120 ? 'Elevated' : 'Normal'],
    ['BMI',                String(bmi),        +bmi >= 30 ? 'Obese' : +bmi >= 25 ? 'Overweight' : 'Normal'],
    ['Heart Rate',         hr + ' bpm',        (+hr > 100 || +hr < 50) ? 'Abnormal' : 'Normal'],
    ['Age',                age + ' years',     '—'],
  ];

  let my = 100;
  mData.forEach(([label, val, status]) => {
    doc.setFillColor(15, 12, 8);
    doc.rect(M, my - 4, W - M*2, 11, 'F');
    doc.setDrawColor(50, 40, 25);
    doc.setLineWidth(0.1);
    doc.rect(M, my - 4, W - M*2, 11);
    doc.setTextColor(160, 152, 128);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text(label.toUpperCase(), M + 4, my + 2);
    doc.setTextColor(184, 144, 42);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(val, W / 2, my + 2, { align: 'center' });
    const sc = status === 'Normal' ? [46, 204, 113] : status === '—' ? [160, 152, 128] : [231, 76, 60];
    doc.setTextColor(sc[0], sc[1], sc[2]);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text(status, W - M - 4, my + 2, { align: 'right' });
    my += 13;
  });

  // Recommendations
  my += 4;
  doc.setTextColor(184, 144, 42);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('CLINICAL RECOMMENDATIONS', M, my);
  doc.setLineWidth(0.2);
  doc.line(M, my + 2, W - M, my + 2);
  my += 9;

  recs.forEach(rec => {
    doc.setFillColor(15, 10, 5);
    doc.rect(M, my - 3, W - M*2, 9, 'F');
    doc.setDrawColor(50, 30, 10);
    doc.setLineWidth(0.1);
    doc.rect(M, my - 3, W - M*2, 9);
    doc.setFillColor(192, 57, 43);
    doc.rect(M, my - 3, 2, 9, 'F');
    doc.setTextColor(200, 190, 170);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(rec, M + 6, my + 2);
    my += 11;
  });

  // Footer
  doc.setDrawColor(184, 144, 42);
  doc.setLineWidth(0.2);
  doc.line(M, 283, W - M, 283);
  doc.setTextColor(100, 90, 70);
  doc.setFontSize(6.5);
  doc.text('HealthRiskPrediction — For informational purposes only. Consult a qualified physician for medical advice.', M, 289);

  doc.save('HealthRiskPrediction_Sugar_Report.pdf');
}


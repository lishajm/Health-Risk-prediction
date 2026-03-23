// ── AUTH ──
let currentUser = null;
let currentName = null;

function switchTab(tab) {
  document.querySelectorAll('.tab-btn').forEach((b, i) =>
    b.classList.toggle('active', tab === 'login' ? i === 0 : i === 1)
  );
  document.getElementById('loginTab').classList.toggle('active', tab === 'login');
  document.getElementById('registerTab').classList.toggle('active', tab === 'register');
}

async function doLogin() {
  const username = document.getElementById('loginUser').value.trim();
  const password = document.getElementById('loginPass').value;
  const err      = document.getElementById('loginErr');

  if (!username || !password) { err.textContent = 'Please fill in all fields.'; return; }

  try {
    const res  = await fetch('/api/login', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ username, password }),
    });
    const data = await res.json();

    if (data.success) {
      err.textContent = '';
      currentUser     = username;
      currentName     = data.name;
      document.getElementById('navUser').textContent = data.name || username;
      showPage('dashPage');
    } else {
      err.textContent = data.message || 'Login failed.';
    }
  } catch (e) {
    err.textContent = 'Network error. Is the server running?';
  }
}

async function doRegister() {
  const name     = document.getElementById('regName').value.trim();
  const username = document.getElementById('regUser').value.trim();
  const password = document.getElementById('regPass').value;
  const err      = document.getElementById('regErr');

  if (!name || !username || !password) { err.textContent = 'All fields are required.'; return; }

  try {
    const res  = await fetch('/api/register', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ name, username, password }),
    });
    const data = await res.json();

    if (data.success) {
      err.style.color     = 'var(--gold)';
      err.textContent     = data.message;
      setTimeout(() => {
        err.textContent   = '';
        err.style.color   = '';
        switchTab('login');
      }, 1600);
    } else {
      err.style.color = '';
      err.textContent = data.message || 'Registration failed.';
    }
  } catch (e) {
    err.textContent = 'Network error. Is the server running?';
  }
}

async function doLogout() {
  await fetch('/api/logout', { method: 'POST' });
  currentUser = null;
  currentName = null;
  showPage('loginPage');
  document.getElementById('resultCard').classList.remove('show');
  document.getElementById('resultEmpty').style.display = 'flex';
  document.getElementById('scoreBar').style.width = '0%';
}

function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

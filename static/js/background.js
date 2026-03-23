// ── ANIMATED BACKGROUND ──
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const COLORS = ['rgba(192,57,43,', 'rgba(184,144,42,', 'rgba(180,50,60,'];

const waves = [
  { y: 0.25, color: 'rgba(192,57,43,0.18)', speed: 0.4 },
  { y: 0.55, color: 'rgba(184,144,42,0.12)', speed: 0.3 },
  { y: 0.78, color: 'rgba(150,40,40,0.12)',  speed: 0.25 },
];

function drawECG(wave, t) {
  const W = canvas.width, H = canvas.height;
  const yBase = H * wave.y;
  const seg   = W / 8;
  const x0    = -((t * wave.speed * 60) % (seg * 8));
  ctx.beginPath();
  ctx.strokeStyle = wave.color;
  ctx.lineWidth   = 1.5;
  for (let i = -1; i < 12; i++) {
    const bx = x0 + i * seg * 8;
    ctx.moveTo(bx,              yBase);
    ctx.lineTo(bx + seg * 1.5,  yBase);
    ctx.lineTo(bx + seg * 1.8,  yBase - 18);
    ctx.lineTo(bx + seg * 2.1,  yBase + 35);
    ctx.lineTo(bx + seg * 2.4,  yBase - 22);
    ctx.lineTo(bx + seg * 2.7,  yBase + 12);
    ctx.lineTo(bx + seg * 3.0,  yBase);
    ctx.lineTo(bx + seg * 8,    yBase);
  }
  ctx.stroke();
}

const particles = Array.from({ length: 55 }, () => ({
  x:  Math.random(),
  y:  Math.random(),
  vx: (Math.random() - 0.5) * 0.0003,
  vy: (Math.random() - 0.5) * 0.0003,
  r:  Math.random() * 2 + 0.5,
  c:  COLORS[Math.floor(Math.random() * COLORS.length)],
  a:  Math.random() * 0.5 + 0.2,
}));

const rings = [];
function spawnRing() {
  rings.push({
    x: Math.random(), y: Math.random(),
    r: 0, maxR: 80 + Math.random() * 80,
    a: 0.4,
    c: COLORS[Math.floor(Math.random() * COLORS.length)],
  });
}
setInterval(spawnRing, 1800);

let lastTime = 0;
function draw(ts) {
  const t  = ts / 1000;
  lastTime = t;
  const W  = canvas.width, H = canvas.height;

  ctx.clearRect(0, 0, W, H);

  // Ambient orbs
  [
    { x: 0.1,  y: 0.2,  r: 280, c: 'rgba(192,57,43,0.07)' },
    { x: 0.85, y: 0.75, r: 320, c: 'rgba(184,144,42,0.05)' },
    { x: 0.5,  y: 0.5,  r: 200, c: 'rgba(120,20,20,0.06)' },
  ].forEach(o => {
    const g = ctx.createRadialGradient(o.x*W, o.y*H, 0, o.x*W, o.y*H, o.r);
    g.addColorStop(0, o.c);
    g.addColorStop(1, 'transparent');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  });

  waves.forEach(w => drawECG(w, t));

  // Particles + connections
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0) p.x = 1; if (p.x > 1) p.x = 0;
    if (p.y < 0) p.y = 1; if (p.y > 1) p.y = 0;
    ctx.beginPath();
    ctx.arc(p.x*W, p.y*H, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.c + p.a + ')';
    ctx.fill();
  });

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx   = (particles[i].x - particles[j].x) * W;
      const dy   = (particles[i].y - particles[j].y) * H;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(184,144,42,${0.06 * (1 - dist / 100)})`;
        ctx.lineWidth   = 0.5;
        ctx.moveTo(particles[i].x*W, particles[i].y*H);
        ctx.lineTo(particles[j].x*W, particles[j].y*H);
        ctx.stroke();
      }
    }
  }

  // Pulse rings
  for (let i = rings.length - 1; i >= 0; i--) {
    const ring = rings[i];
    ring.r += 0.6;
    ring.a -= 0.005;
    if (ring.a <= 0) { rings.splice(i, 1); continue; }
    ctx.beginPath();
    ctx.arc(ring.x*W, ring.y*H, ring.r, 0, Math.PI * 2);
    ctx.strokeStyle = ring.c + ring.a + ')';
    ctx.lineWidth   = 1;
    ctx.stroke();
  }

  requestAnimationFrame(draw);
}
requestAnimationFrame(draw);

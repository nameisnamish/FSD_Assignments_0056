/* ==========================================================================
   KINETIC // 4D Hyperspace Matrix & Interactions
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  init4DCanvas();
  initSlider();
  animateUptime();
});

/* --------------------------------------------------------------------------
   4D Floating Hyper-Sphere Mesh (Three.js WebGL Engine)
   -------------------------------------------------------------------------- */
function init4DCanvas() {
  const canvas = document.getElementById('bg-4d-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 18;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Create 4D Torus Knot Geometry
  const geometry = new THREE.TorusKnotGeometry(6, 1.8, 120, 16, 2, 3);
  const material = new THREE.MeshBasicMaterial({
    color: 0x818cf8,
    wireframe: true,
    transparent: true,
    opacity: 0.35
  });
  window.kineticMeshMaterial = material;

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // Background Starfield Particles
  const particlesGeo = new THREE.BufferGeometry();
  const particleCount = 450;
  const posArray = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 40;
  }
  particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

  const particleMat = new THREE.PointsMaterial({
    size: 0.06,
    color: 0x60a5fa,
    transparent: true,
    opacity: 0.65
  });

  const particlesMesh = new THREE.Points(particlesGeo, particleMat);
  scene.add(particlesMesh);

  // Mouse Interactivity & Liquid Glass Light Reflection
  let mouseX = 0;
  let mouseY = 0;
  window.addEventListener('pointermove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 0.5;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 0.5;

    // Update specular highlight positions on bento cards
    document.querySelectorAll('.bento-card').forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // Render Loop
  let clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // 4D W-axis Morph Rotation
    mesh.rotation.x = elapsedTime * 0.1 + mouseY * 0.5;
    mesh.rotation.y = elapsedTime * 0.15 + mouseX * 0.5;
    mesh.rotation.z = Math.sin(elapsedTime * 0.2) * 0.1;

    particlesMesh.rotation.y = elapsedTime * 0.03;

    renderer.render(scene, camera);
  }

  animate();

  // Resize Handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

/* Slider Math */
function initSlider() {
  const slider = document.getElementById('req-slider');
  const reqVal = document.getElementById('req-val');
  const latencyVal = document.getElementById('latency-val');
  const podsVal = document.getElementById('pods-val');
  const savingsVal = document.getElementById('savings-val');

  if (!slider) return;

  slider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    reqVal.textContent = `${val.toLocaleString()} req/s`;

    const lat = (1.2 - (val / 300000)).toFixed(1);
    latencyVal.textContent = `${Math.max(0.3, lat)}ms`;

    const pods = Math.ceil(val / 12000);
    podsVal.textContent = pods;

    const savings = Math.min(88, Math.floor(45 + (val / 4000)));
    savingsVal.textContent = `${savings}%`;
  });
}

/* Audio Visualizer Simulator */
let isPlaying = false;
function toggleAudio() {
  const icon = document.getElementById('play-icon');
  const strip = document.getElementById('eq-strip');

  isPlaying = !isPlaying;

  if (isPlaying) {
    icon.className = 'fa-solid fa-pause';
    strip.classList.add('active');
  } else {
    icon.className = 'fa-solid fa-play';
    strip.classList.remove('active');
  }
}

/* Code Copy */
function copyCode() {
  const btn = document.getElementById('btn-copy');
  navigator.clipboard.writeText(`import { Kinetic } from '@kinetic/sdk';\nconst client = new Kinetic({ key: process.env.KINETIC_KEY });\nawait client.stream('telemetry', console.log);`);
  btn.innerHTML = `<i class="fa-solid fa-check"></i> Copied`;
  setTimeout(() => {
    btn.innerHTML = `<i class="fa-regular fa-copy"></i> Copy`;
  }, 2000);
}

/* Animate Uptime Stat */
function animateUptime() {
  const el = document.getElementById('uptime-num');
  if (!el) return;
  
  let current = 90.00;
  const target = 99.99;
  const timer = setInterval(() => {
    current += 0.45;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = current.toFixed(2);
  }, 30);
}

/* Modal Controls */
function openModal() {
  const dialog = document.getElementById('app-modal');
  if (dialog) dialog.showModal();
}

function closeModal() {
  const dialog = document.getElementById('app-modal');
  if (dialog) dialog.close();
}

/* Light / Dark Mode Toggle Function */
function toggleTheme() {
  const isLight = document.body.classList.toggle('light-mode');
  const icon = document.getElementById('theme-icon');

  if (icon) {
    if (isLight) {
      icon.className = 'fa-solid fa-sun';
      icon.style.color = '#f59e0b';
    } else {
      icon.className = 'fa-solid fa-moon';
      icon.style.color = '';
    }
  }

  // Update WebGL Three.js background colors smoothly
  if (window.kineticMeshMaterial) {
    window.kineticMeshMaterial.color.setHex(isLight ? 0x3b82f6 : 0x818cf8);
    window.kineticMeshMaterial.opacity = isLight ? 0.2 : 0.35;
  }
}

const input = document.getElementById('manifestation-input');
const addBtn = document.getElementById('add-btn');


addBtn.addEventListener('click', () => {
  const text = input.value.trim();
  if (!text) return;
  createCloud(text);
  input.value = '';
});


function createCloud(text) {
  const cloud = document.createElement('div');
  cloud.className = 'cloud';


  const cloudText = document.createElement('div');
  cloudText.className = 'cloud-text';
  cloudText.textContent = text;
  cloud.appendChild(cloudText);


  document.body.appendChild(cloud);


  // Wait a frame for correct sizes
  requestAnimationFrame(() => {
    const rect = cloudText.getBoundingClientRect();
    const paddingX = 40;
    const paddingY = 30;
    const width = Math.min(Math.max(rect.width + paddingX * 2, 150), 300);
    const height = Math.min(Math.max(rect.height + paddingY * 2, 80), 400);
    cloud.style.width = width + 'px';
    cloud.style.height = height + 'px';


    const inputRect = input.getBoundingClientRect();
    cloud.style.left = `${inputRect.left + inputRect.width / 2 - width / 2}px`;
    cloud.style.top = `${inputRect.top + inputRect.height / 2 - height / 2}px`;


    const ellipsesCount = 6 + Math.floor(Math.random() * 5);
    for (let i = 0; i < ellipsesCount; i++) {
      const ellipse = document.createElement('div');
      ellipse.className = 'cloud-ellipse';


      const baseSize = Math.min(width, height);
      const ew = baseSize * (0.5 + Math.random() * 0.3);
      const eh = ew * (0.7 + Math.random() * 0.3);


      ellipse.style.width = ew + 'px';
      ellipse.style.height = eh + 'px';


      const offsetX = (Math.random() - 0.5) * width * 0.4;
      const offsetY = (Math.random() - 0.5) * height * 0.4;
      ellipse.style.left = `calc(50% + ${offsetX}px - ${ew / 2}px)`;
      ellipse.style.top = `calc(50% + ${offsetY}px - ${eh / 2}px)`;


      cloud.appendChild(ellipse);
    }


    animateCloud(cloud);
    cloud.addEventListener('click', () => popCloud(cloud));
  });
}


// POP CLOUD INTO MINI CIRCLE PIECES WITH FADE
function popCloud(cloud) {
  const rect = cloud.getBoundingClientRect();
  const pieceCount = 10;


  for (let i = 0; i < pieceCount; i++) {
    const piece = document.createElement('div');
    piece.className = 'cloud-ellipse';
    const size = Math.random() * 15 + 10;
    piece.style.width = size + 'px';
    piece.style.height = size + 'px';
    piece.style.left = rect.left + rect.width / 2 - size / 2 + 'px';
    piece.style.top = rect.top + rect.height / 2 - size / 2 + 'px';
    piece.style.position = 'absolute';
    piece.style.borderRadius = '50%';
    piece.style.background = '#fff';
    piece.style.opacity = '0.9';
    piece.style.boxShadow = '0 2px 10px rgba(255,255,255,0.6)';
    piece.style.transition = 'opacity 2s ease-out';


    document.body.appendChild(piece);


    const angle = Math.random() * 2 * Math.PI;
    const speed = Math.random() * 3 + 2;
    let px = 0;
    let py = 0;


    function move() {
      px += Math.cos(angle) * speed * 0.5;
      py += Math.sin(angle) * speed * 0.5;
      piece.style.transform = `translate(${px}px, ${py}px)`;
    }


    const interval = setInterval(move, 16);


    // Trigger fade
    requestAnimationFrame(() => {
      piece.style.opacity = '0';
    });


    setTimeout(() => {
      clearInterval(interval);
      piece.remove();
    }, 2000);
  }


  cloud.remove();
}


// CLOUD FLOATING FUNCTION WITH EDGE BOUNCE
function animateCloud(cloud) {
  // Get initial position
  const rect = cloud.getBoundingClientRect();
  let x = rect.left;
  let y = rect.top;
  let dx = (Math.random() * 0.3 + 0.1) * (Math.random() < 0.5 ? 1 : -1);
  let dy = (Math.random() * 0.3 + 0.1) * (Math.random() < 0.5 ? 1 : -1);


  const width = cloud.offsetWidth;
  const height = cloud.offsetHeight;


  function move() {
    const winWidth = window.innerWidth;
    const winHeight = window.innerHeight;


    dx += (Math.random() - 0.5) * 0.02;
    dy += (Math.random() - 0.5) * 0.02;


    x += dx;
    y += dy;


    // Clamp inside screen
    if (x < 0) { x = 0; dx = Math.abs(dx); }
    if (y < 0) { y = 0; dy = Math.abs(dy); }
    if (x + width > winWidth) { x = winWidth - width; dx = -Math.abs(dx); }
    if (y + height > winHeight) { y = winHeight - height; dy = -Math.abs(dy); }


    cloud.style.left = x + 'px';
    cloud.style.top = y + 'px';


    requestAnimationFrame(move);
  }


  move();
}
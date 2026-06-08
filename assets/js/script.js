window.addEventListener("load", function() {
  
  gsap.registerPlugin(ScrollTrigger);

  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".contenedor-scroll",
      start: "top top",
      end: "+=300%", 
      scrub: 1,
      pin: true,
      anticipatePin: 1,
      onUpdate: (self) => {
    const indicador = document.querySelector('.scroll-indicador');
    if (indicador) {
      // Si el usuario scrolleó más de un 5%, el mouse se desvanece
      if (self.progress > 0.03) {
        indicador.style.opacity = "0.2";
        indicador.style.pointerEvents = "none";
      } else {
        indicador.style.opacity = "1";
      }
    }
  }
      
    }
  });

  // Lo que se desplaza hacia la izquierda es la cinta completa (.contenedor-scroll)
  tl.to(".section-01", { opacity: 0, duration: 0.5 })
    .to(".contenedor-scroll", { x: "-100vw", duration: 1 }, "<")

  tl.to(".section-02", { opacity: 0, duration: 0.5 })
    .to(".contenedor-scroll", { x: "-200vw", duration: 1 }, "<")

  tl.to(".section-03", { opacity: 0, duration: 0.5 })
    .to(".contenedor-scroll", { x: "-300vw", duration: 1 }, "<");

// Coordenadas reales del mouse
let mouseX = 0;
let mouseY = 0;

// Coordenadas de la "estela" que persigue al mouse
let trailX = 0;
let trailY = 0;

// movimiento del mouse para actualizar su posición real
document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Bucle de animación constante (render)
function animate() {
  // calculamos la posición de la "estela" del mouse.
  // Sumamos píxeles en X y en Y para empujar el origen hacia la esquina inferior derecha de la flecha.
  const colaMouseX = mouseX + 15; // 15 píxeles a la derecha
  const colaMouseY = mouseY + 20; // 20 píxeles hacia abajo

  // La estela persigue a la COLA del mouse, no a la punta punta
  trailX += (colaMouseX - trailX) * 0.12; //  0.12 para que flote un poco más atrás
  trailY += (colaMouseY - trailY) * 0.12;

  // Calculamos la distancia respecto a la cola del mouse
  const distance = Math.hypot(colaMouseX - trailX, colaMouseY - trailY);

  // Genera partículas solo si se estás moviendo
  if (distance > 4) {
    createParticle(trailX, trailY);
  }

  requestAnimationFrame(animate);
}

function createParticle(x, y) {
  const particle = document.createElement('div');
  particle.classList.add('nebulosa-particle');
  
// En lugar de left/top, usamos translate3d para moverlo por hardware (GPU) OPTIMIZACIÓN IMPORTANTE
  particle.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  
  const size = Math.random() * 8 + 6; 
  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;

  document.body.appendChild(particle);

// requestAnimationFrame para el cambio visual en lugar de un setTimeout tan corto
  requestAnimationFrame(() => {
    particle.style.transform = `translate3d(${x}px, ${y}px, 0) scale(0)`;
    particle.style.opacity = '0';
  });

  setTimeout(() => {
    particle.remove();
  }, 400); // Desaparecen un poquito más rápido
}
// Iniciamos bucle
//animate(); COMENTADO MIENTRAS BUSCO MANERAS DE OPTIMIZAR LA ANIMACION


//SELECT
const select = document.querySelector("select");

select.addEventListener("change", () => {
  // Le damos 10ms al navegador para que cierre el desplegable pacíficamente
  setTimeout(() => {
   // select.classList.add("bounce");
  }, 320);
});

select.addEventListener("animationend", () => {
  //select.classList.remove("bounce");
});

});
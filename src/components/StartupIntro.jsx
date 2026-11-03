import { useRef } from 'react';
import { Icon } from './Icons.jsx';

// Líneas de una cancha, centradas en el logo. pathLength permite dibujarlas una sola vez al cargar.
function Court() {
  return <svg className="court" viewBox="-300 -300 600 600" aria-hidden="true" focusable="false">
    <path pathLength="1" d="M-640 0H640" />
    <circle pathLength="1" r="268" />
    <path pathLength="1" d="M-286 -640V640M286 -640V640" />
    <path pathLength="1" d="M-90 -470V-318H90V-470M-90 470V318H90V470" />
    <path pathLength="1" d="M-250 -470A250 250 0 0 0 250 -470M-250 470A250 250 0 0 1 250 470" />
  </svg>;
}

// Inclinación máxima, en grados, al mover el cursor sobre el disco.
const MAX_TILT = 4;

// Reacción al cursor: solo capas alrededor del disco y una inclinación del conjunto. La imagen no cambia.
// La zona activa no se mueve con el disco, así el hover no parpadea en el borde.
function LogoStage() {
  const frameRef = useRef(null);
  const onPointerMove = event => {
    if (event.pointerType !== 'mouse') return;
    const box = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - .5;
    const y = (event.clientY - box.top) / box.height - .5;
    frameRef.current.style.setProperty('--tilt-x', `${(-y * 2 * MAX_TILT).toFixed(2)}deg`);
    frameRef.current.style.setProperty('--tilt-y', `${(x * 2 * MAX_TILT).toFixed(2)}deg`);
  };
  const onPointerLeave = () => {
    frameRef.current.style.removeProperty('--tilt-x');
    frameRef.current.style.removeProperty('--tilt-y');
  };
  return <div className="logo-stage"><Court />
    <div className="logo-hot" onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
      <div className="logo-frame" ref={frameRef}><img src="/images/S05.webp" alt="Logo original de FUL Y VALE APP: balón de básquet y siglas FYV APP" width="486" height="441" /><span className="logo-glint" aria-hidden="true" /></div>
    </div>
    <span className="logo-orbit" aria-hidden="true" />
  </div>;
}

export default function StartupIntro() {
  return <section id="inicio" className="hero wrap" aria-labelledby="hero-title">
    <div className="hero-copy"><p className="eyebrow"><span className="dot" /> S05-B · INSCRIPCIÓN Y PAGO</p>
      <h1 id="hero-title">El próximo<br />paso está en<br /><em>la cancha.</em></h1>
      <p className="hero-description"><strong>El problema:</strong> quien quiere jugar al básquet necesita encontrar un partido que coincida con su zona, su horario y su nivel y, al anotarse, saber en qué estado queda su inscripción.</p>
      <p className="hero-description">Dos propuestas agénticas para entender la inscripción y el pago en <strong>FUL Y VALE APP</strong>, la aplicación para encontrar partidos de básquet según zona, horario y nivel.</p>
      <a className="button" href="#r3">Explorar las propuestas <span><Icon name="arrowDownRight" size={20} /></span></a>
      <p className="hero-note">TP3 · IFTS 29 · Grupo 04 AACMP</p>
    </div>
    <div className="hero-art"><span className="art-label">DEPORTES & ENCUENTROS RECREATIVOS</span><LogoStage /><div className="art-bottom"><span>IDENTIDAD ORIGINAL<br /><strong>Startup del IFTS 16</strong></span><span className="jersey-number" aria-hidden="true"><span className="jersey-digit">0</span><span className="jersey-digit">5</span></span></div></div>
    <div className="hero-strip"><span><b>01 /</b> SOLICITAR</span><span><b>02 /</b> VERIFICAR</span><span><b>03 /</b> MANTENER PENDIENTE</span></div>
    <p className="presentation-note">Propuestas conceptuales: esta página explica los flujos; no ejecuta agentes ni procesa inscripciones o pagos.</p>
  </section>;
}

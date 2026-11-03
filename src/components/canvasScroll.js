// Desplazamiento horizontal del lienzo de los diagramas. Nunca mueve la página.

// Devuelve a dónde desplazar, o null si el nodo ya se ve con margen suficiente.
export function revealTarget({ left, right, scrollLeft, clientWidth, scrollWidth }) {
  const margin = Math.min(56, clientWidth * .14);
  if (left >= scrollLeft + margin && right <= scrollLeft + clientWidth - margin) return null;
  const target = Math.max(0, Math.min((left + right) / 2 - clientWidth / 2, scrollWidth - clientWidth));
  return Math.abs(target - scrollLeft) < 1 ? null : target;
}

const easeInOut = t => t < .5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;

// Desliza hasta el destino con una duración acotada. Si la persona toma el lienzo, se cancela.
// Devuelve la función para cancelar.
export function glideTo(canvas, target) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    canvas.scrollLeft = target;
    return () => {};
  }
  const from = canvas.scrollLeft;
  const duration = Math.max(240, Math.min(460, 220 + Math.abs(target - from) * .35));
  const start = performance.now();
  let frame = requestAnimationFrame(function step(now) {
    const progress = Math.min(1, (now - start) / duration);
    canvas.scrollLeft = from + (target - from) * easeInOut(progress);
    if (progress < 1) frame = requestAnimationFrame(step);
  });
  const cancel = () => {
    cancelAnimationFrame(frame);
    ['pointerdown', 'wheel', 'touchstart'].forEach(type => canvas.removeEventListener(type, cancel));
  };
  ['pointerdown', 'wheel', 'touchstart'].forEach(type => canvas.addEventListener(type, cancel, { passive: true }));
  return cancel;
}

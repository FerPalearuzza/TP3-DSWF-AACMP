// Set único de íconos: grilla de 24, trazo 1.8, extremos redondeados y color heredado.
// Son decorativos: el texto que acompañan ya comunica su significado.
const PATHS = {
  arrowDownRight: 'M7 7l10 10M17 8v9H8',
  arrowUp: 'M12 19V5M6 11l6-6 6 6',
  arrowRight: 'M5 12h14M13 6l6 6-6 6',
  users: 'M9 11.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4zM3.5 19a5.5 5.5 0 0 1 11 0M16 5.4a3.2 3.2 0 0 1 0 5.2M17.5 14.2a5.5 5.5 0 0 1 3 4.8',
  data: 'M12 9c3.9 0 7-1.3 7-3s-3.1-3-7-3-7 1.3-7 3 3.1 3 7 3zM5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3',
  route: 'M6 20.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM18 8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM8.5 18H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6.5',
  tools: 'M14.5 6.5a4 4 0 0 0-5.3 5.3L4 17v3h3l5.2-5.2a4 4 0 0 0 5.3-5.3l-2.6 2.6-2.5-.6-.6-2.5z',
  checklist: 'M10 6h10M10 12h10M10 18h10M3.5 6l1.2 1.2L7 5M3.5 12l1.2 1.2L7 11M3.5 18l1.2 1.2L7 17',
  scale: 'M12 4v16M8 20h8M5 7h14M5 7l-2.5 6a2.5 2.5 0 0 0 5 0zM19 7l-2.5 6a2.5 2.5 0 0 0 5 0z',
  text: 'M5 6h14M5 11h14M5 16h9',
  flag: 'M6 21V4M6 5h11l-2 4 2 4H6',
  alert: 'M12 4l9 16H3zM12 10v4M12 17.2v.1',
  rule: 'M7 3h7l4 4v14H7zM14 3v4h4M10 12h5M10 16h5',
  sun: 'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4',
  moon: 'M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z',
  arrowLeft: 'M19 12H5M11 6l-6 6 6 6',
  arrowDown: 'M12 5v14M6 13l6 6 6-6',
  close: 'M6 6l12 12M18 6L6 18',
  compass: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM15.5 8.5l-2 5-5 2 2-5z',
};

export function Icon({ name, size = 18 }) {
  return <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d={PATHS[name]} /></svg>;
}

// Indicador de los desplegables: la línea vertical se oculta al abrir (de + a −).
export function ToggleIcon() {
  return <span className="toggle" aria-hidden="true"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" focusable="false"><path d="M1.5 6h9" /><path className="toggle-v" d="M6 1.5v9" /></svg></span>;
}

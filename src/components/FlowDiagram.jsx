// Punto de extensión para los diagramas SVG definitivos de la etapa 3.
// No representa todavía nodos, decisiones ni conexiones del flujo.
export default function FlowDiagram({ proposal }) {
  return <figure className="diagram-placeholder" aria-labelledby={`${proposal.id}-diagram-title`}>
    <svg width="52" height="40" viewBox="0 0 52 40" fill="none" aria-hidden="true"><rect x="1" y="12" width="14" height="16" rx="3" stroke="currentColor" /><path d="M17 20h16m-4-4 4 4-4 4" stroke="currentColor" /><path d="m42 11 9 9-9 9-9-9 9-9Z" stroke="currentColor" /></svg>
    <figcaption><h3 id={`${proposal.id}-diagram-title`}>Diagrama {proposal.rule} · Próxima etapa</h3><p>Espacio preparado para el recorrido SVG. La lógica aprobada está disponible en «Recorrido propuesto».</p></figcaption><span className="status">EN PREPARACIÓN</span>
  </figure>;
}

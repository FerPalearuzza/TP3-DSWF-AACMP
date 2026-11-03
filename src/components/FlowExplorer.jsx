import { useEffect, useRef } from 'react';
import { Icon } from './Icons.jsx';
import { kicker, nodeText, originLabel } from './flowText.js';

// Panel HTML de los diagramas. Es el equivalente de teclado y lector de pantalla del SVG,
// que sigue siendo una imagen: todo se maneja con botones nativos y pocas tabulaciones.
export default function FlowExplorer({ flow, rule, selected, onSelect, onClose }) {
  const panelRef = useRef(null);
  const pendingFocus = useRef(null);
  const byId = Object.fromEntries(flow.nodes.map(node => [node.id, node]));
  const node = selected ? byId[selected] : null;

  // El botón con el foco puede desaparecer al cambiar de estado: se pasa al siguiente sin mover la página.
  useEffect(() => {
    if (!pendingFocus.current) return;
    const panel = panelRef.current;
    (panel.querySelector(pendingFocus.current) ?? panel.querySelector('[data-close]'))?.focus({ preventScroll: true });
    pendingFocus.current = null;
  });

  const go = id => { pendingFocus.current = '[data-primary]'; onSelect(id); };
  const close = () => { pendingFocus.current = '[data-entry]'; onClose(); };
  const onKeyDown = event => { if (event.key === 'Escape' && node) { event.stopPropagation(); close(); } };

  const incoming = node ? flow.edges.filter(edge => edge.to === node.id) : [];
  const outgoing = node ? flow.edges.filter(edge => edge.from === node.id) : [];
  const announcement = node ? `${kicker(node, rule)}: ${nodeText(node)}` : '';

  return <div ref={panelRef} className={`flow-explorer${node ? ' is-active' : ''}`} role="group" aria-label={`Explorar el diagrama ${rule}`} onKeyDown={onKeyDown}>
    <p className="visually-hidden" aria-live="polite" aria-atomic="true">{announcement}</p>
    {!node && <div className="explorer-idle">
      <div><h4><Icon name="compass" size={17} />Explorar el diagrama</h4><p>Pasá el cursor, hacé clic o tocá un nodo para resaltar sus conexiones directas.</p></div>
      <div className="explorer-actions"><button className="explorer-button" type="button" data-entry onClick={() => go(flow.nodes[0].id)}>Explorar desde el inicio</button></div>
    </div>}
    {node && <div className="explorer-node">
      <div className="explorer-info"><p className={`explorer-kicker explorer-${node.origin}`}>{kicker(node, rule)}</p><h4>{nodeText(node)}</h4><p className="explorer-origin">{originLabel(node, rule)}</p></div>
      <div className="explorer-links">
        <div><h5>{incoming.length > 1 ? `Puede llegar desde ${incoming.length} nodos` : 'Llega desde'}</h5>
          {incoming.length ? <ul>{incoming.map(edge => <li key={edge.from}>{nodeText(byId[edge.from])}{edge.label ? ` (${edge.label})` : ''}</li>)}</ul> : <p>Es el inicio del recorrido.</p>}
        </div>
        <div><h5>Sale hacia</h5>
          {outgoing.length ? <div className="explorer-exits">{outgoing.map((edge, index) => <button className="explorer-button explorer-exit" type="button" key={edge.to} data-primary={index === 0 ? '' : undefined} onClick={() => go(edge.to)}><b>{edge.label ?? 'Sigue en'}</b> {nodeText(byId[edge.to])}</button>)}</div> : <p>Es un resultado final.</p>}
        </div>
      </div>
      <button className="explorer-button explorer-icon explorer-close" type="button" aria-label="Cerrar la exploración" data-close onClick={close}><Icon name="close" size={18} /></button>
    </div>}
  </div>;
}

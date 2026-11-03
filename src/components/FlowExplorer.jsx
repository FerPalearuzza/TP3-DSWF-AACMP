import { useEffect, useRef } from 'react';
import { Icon } from './Icons.jsx';
import { kicker, nodeText, originLabel } from './flowText.js';

function routeAnnouncement({ route, step, flowCase, rule }) {
  const { node, exit, assumed } = route[step];
  const parts = [`Paso ${step + 1} de ${route.length}. ${kicker(node, rule)}: ${nodeText(node)}.`];
  if (node.type === 'decision') parts.push(`Salida: ${exit.label}.`);
  if (assumed) parts.push('Supuesto AACMP.');
  if (step === route.length - 1) parts.push(`Resultado del caso: ${flowCase.result}`);
  return parts.join(' ');
}

function RouteStep({ route, step, flowCase, rule, onStep, onExit }) {
  const { node, exit, assumed } = route[step];
  const isFirst = step === 0;
  const isLast = step === route.length - 1;
  return <div className="explorer-route">
    <div className="explorer-route-head">
      <p className="explorer-progress"><Icon name="route" size={16} /><strong>{flowCase.name}</strong><span>Paso {step + 1} de {route.length}</span></p>
      <p className="explorer-case">{flowCase.input}</p>
    </div>
    <div className="explorer-route-body">
      <div className="explorer-info"><p className={`explorer-kicker explorer-${node.origin}`}>{kicker(node, rule)}</p><h4>{nodeText(node)}</h4><p className="explorer-origin">{originLabel(node, rule)}</p></div>
      <div className="explorer-route-notes">
        {node.type === 'decision' && <p>Salida en este recorrido: <b className="explorer-answer">{exit.label}</b></p>}
        {assumed && <p className="explorer-assumption"><strong>Supuesto AACMP:</strong> el caso no define esta decisión; el recorrido toma la salida «{exit.label}» para poder continuar.</p>}
        {isLast && <p className="explorer-result"><strong>Resultado del caso:</strong> {flowCase.result}</p>}
      </div>
    </div>
    <div className="explorer-actions">
      <button className="explorer-button" type="button" aria-disabled={isFirst} onClick={() => { if (!isFirst) onStep(-1); }}><Icon name="arrowLeft" size={16} />Anterior</button>
      <button className="explorer-button explorer-next" type="button" data-next aria-disabled={isLast} onClick={() => { if (!isLast) onStep(1); }}>Siguiente<Icon name="arrowRight" size={16} /></button>
      <button className="explorer-button" type="button" onClick={onExit}><Icon name="close" size={16} />Salir del recorrido</button>
    </div>
  </div>;
}

// Panel HTML de los diagramas. Es el equivalente de teclado y lector de pantalla del SVG,
// que sigue siendo una imagen: todo se maneja con botones nativos y pocas tabulaciones.
export default function FlowExplorer({ flow, rule, cases, walkthroughs, selected, tour, route, onSelect, onClose, onStartTour, onStep, onExitTour }) {
  const panelRef = useRef(null);
  const pendingFocus = useRef(null);
  const byId = Object.fromEntries(flow.nodes.map(node => [node.id, node]));
  const node = selected ? byId[selected] : null;
  const flowCase = tour ? cases[walkthroughs[tour.index].caseIndex] : null;

  // El botón con el foco puede desaparecer al cambiar de estado: se pasa al siguiente sin mover la página.
  useEffect(() => {
    if (!pendingFocus.current) return;
    const panel = panelRef.current;
    (panel.querySelector(pendingFocus.current) ?? panel.querySelector('[data-close]'))?.focus({ preventScroll: true });
    pendingFocus.current = null;
  });

  const go = id => { pendingFocus.current = '[data-primary]'; onSelect(id); };
  const close = () => { pendingFocus.current = '[data-entry]'; onClose(); };
  const startTour = index => { pendingFocus.current = '[data-next]'; onStartTour(index); };
  const exitTour = () => { pendingFocus.current = `[data-start="${tour.index}"]`; onExitTour(); };
  const onKeyDown = event => {
    if (event.key !== 'Escape') return;
    if (tour) exitTour();
    else if (node) close();
  };

  const incoming = node ? flow.edges.filter(edge => edge.to === node.id) : [];
  const outgoing = node ? flow.edges.filter(edge => edge.from === node.id) : [];
  const announcement = tour ? routeAnnouncement({ route, step: tour.step, flowCase, rule }) : node ? `${kicker(node, rule)}: ${nodeText(node)}` : '';

  return <div ref={panelRef} className={`flow-explorer${node || tour ? ' is-active' : ''}`} role="group" aria-label={`Explorar el diagrama ${rule}`} onKeyDown={onKeyDown}>
    <p className="visually-hidden" aria-live="polite" aria-atomic="true">{announcement}</p>
    {!node && !tour && <div className="explorer-idle">
      <div className="explorer-intro"><h4><Icon name="compass" size={17} />Explorar el diagrama</h4><p>Pasá el cursor, hacé clic o tocá un nodo para resaltar sus conexiones directas.</p>
        <div className="explorer-actions"><button className="explorer-button" type="button" data-entry onClick={() => go(flow.nodes[0].id)}>Explorar desde el inicio</button></div>
      </div>
      <div className="explorer-intro"><h4><Icon name="route" size={17} />Iniciar recorrido</h4><p>Seguí un caso paso a paso, a tu ritmo.</p>
        <div className="explorer-actions">{walkthroughs.map((walkthrough, index) => <button className="explorer-button" type="button" key={walkthrough.caseIndex} data-start={index} aria-label={`Iniciar recorrido: ${cases[walkthrough.caseIndex].name}`} onClick={() => startTour(index)}>{cases[walkthrough.caseIndex].name}</button>)}</div>
      </div>
    </div>}
    {tour && <RouteStep route={route} step={tour.step} flowCase={flowCase} rule={rule} onStep={onStep} onExit={exitTour} />}
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

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
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

// Contenido desplazable del panel. Vuelve arriba al cambiar de paso o de nodo, avisa si hay más
// abajo y, solo si desborda, se puede enfocar para desplazarlo con el teclado.
function ScrollArea({ resetKey, label, children }) {
  const areaRef = useRef(null);
  const [state, setState] = useState({ overflow: false, more: false });
  const measure = useCallback(() => {
    const area = areaRef.current;
    if (!area) return;
    const overflow = area.scrollHeight > area.clientHeight + 1;
    const more = overflow && area.scrollTop + area.clientHeight < area.scrollHeight - 4;
    setState(current => current.overflow === overflow && current.more === more ? current : { overflow, more });
  }, []);
  useLayoutEffect(() => {
    areaRef.current.scrollTop = 0;
    measure();
  }, [resetKey, measure]);
  useEffect(() => {
    const observer = new ResizeObserver(measure);
    observer.observe(areaRef.current);
    return () => observer.disconnect();
  }, [measure]);
  return <div className={`explorer-scroll-wrap${state.more ? ' has-more' : ''}`}>
    <div className="explorer-scroll" ref={areaRef} onScroll={measure} tabIndex={state.overflow ? 0 : undefined} role={state.overflow ? 'group' : undefined} aria-label={state.overflow ? label : undefined}>{children}</div>
    <span className="explorer-more" aria-hidden="true"><Icon name="arrowDown" size={16} /></span>
  </div>;
}

function NodeInfo({ node, rule }) {
  return <div className="explorer-info"><p className={`explorer-kicker explorer-${node.origin}`}>{kicker(node, rule)}</p><h4>{nodeText(node)}</h4><p className={`explorer-origin${node.type === 'data' ? '' : ' explorer-origin-repeat'}`}>{originLabel(node, rule)}</p></div>;
}

function RouteStep({ route, step, flowCase, rule, onStep, onExit }) {
  const { node, exit, assumed } = route[step];
  const isFirst = step === 0;
  const isLast = step === route.length - 1;
  return <div className="explorer-route">
    <div className="explorer-progress"><Icon name="route" size={16} /><strong>{flowCase.name}</strong><span>Paso {step + 1} de {route.length}</span><i className="explorer-bar" aria-hidden="true" style={{ '--progress': (step + 1) / route.length }} /></div>
    <ScrollArea resetKey={step} label="Detalle del paso">
      <div className="explorer-route-content">
        <p className="explorer-case">{flowCase.input}</p>
        <div className="explorer-route-body explorer-fade" key={step}>
          <NodeInfo node={node} rule={rule} />
          <div className="explorer-route-notes">
            {node.type === 'decision' && <p>Salida en este recorrido: <b className="explorer-answer">{exit.label}</b></p>}
            {assumed && <p className="explorer-assumption"><strong>Supuesto AACMP:</strong> el caso no define esta decisión; el recorrido toma la salida «{exit.label}» para poder continuar.</p>}
            {isLast && <p className="explorer-result"><strong>Resultado del caso:</strong> {flowCase.result}</p>}
          </div>
        </div>
      </div>
    </ScrollArea>
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
  // Con teclado, si queda oculto dentro del panel, se desplaza solo el panel.
  useEffect(() => {
    if (!pendingFocus.current) return;
    const panel = panelRef.current;
    const target = panel.querySelector(pendingFocus.current) ?? panel.querySelector('[data-close]');
    pendingFocus.current = null;
    if (!target) return;
    target.focus({ preventScroll: true });
    const area = target.closest('.explorer-scroll');
    if (!area || !target.matches(':focus-visible')) return;
    const overflow = target.getBoundingClientRect().bottom - area.getBoundingClientRect().bottom;
    if (overflow > 0) area.scrollTop += overflow + 8;
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
      <ScrollArea resetKey={node.id} label="Detalle del nodo">
        <div className="explorer-node-body explorer-fade" key={node.id}>
          <NodeInfo node={node} rule={rule} />
          <div className="explorer-links">
            <div><h5>{incoming.length > 1 ? `Puede llegar desde ${incoming.length} nodos` : 'Llega desde'}</h5>
              {incoming.length ? <ul>{incoming.map(edge => <li key={edge.from}>{nodeText(byId[edge.from])}{edge.label ? ` (${edge.label})` : ''}</li>)}</ul> : <p>Es el inicio del recorrido.</p>}
            </div>
            <div><h5>Sale hacia</h5>
              {outgoing.length ? <div className="explorer-exits">{outgoing.map((edge, index) => <button className="explorer-button explorer-exit" type="button" key={edge.to} data-primary={index === 0 ? '' : undefined} onClick={() => go(edge.to)}><b>{edge.label ?? 'Sigue en'}</b> {nodeText(byId[edge.to])}</button>)}</div> : <p>Es un resultado final.</p>}
            </div>
          </div>
        </div>
      </ScrollArea>
      <button className="explorer-button explorer-icon explorer-close" type="button" aria-label="Cerrar la exploración" data-close onClick={close}><Icon name="close" size={18} /></button>
    </div>}
  </div>;
}

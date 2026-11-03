import { useEffect, useRef, useState } from 'react';
import { flows } from '../data/flows.js';
import { Icon, ToggleIcon } from './Icons.jsx';
import FlowExplorer from './FlowExplorer.jsx';
import { kicker, nodeText, sceneAround } from './flowText.js';
import '../styles/flow-diagram.css';

const LINE_HEIGHT = 16;
const KICKER_HEIGHT = 14;

const CORNER = 10;
const VIEW_WIDTH = 1180;

// Convierte la ruta ortogonal de una arista en un trazo con esquinas redondeadas.
function edgePath(points) {
  return points.map(([x, y], index) => {
    if (index === 0) return `M${x} ${y}`;
    const next = points[index + 1];
    if (!next) return `L${x} ${y}`;
    const [px, py] = points[index - 1];
    const inX = Math.sign(x - px), inY = Math.sign(y - py), outX = Math.sign(next[0] - x), outY = Math.sign(next[1] - y);
    return `L${x - inX * CORNER} ${y - inY * CORNER}Q${x} ${y} ${x + outX * CORNER} ${y + outY * CORNER}`;
  }).join('');
}

// Contorno del nodo. También se usa, sin relleno, para el resaltado que va detrás.
function Outline({ node, className }) {
  const { type, cx, cy, w, h } = node;
  const x = cx - w / 2;
  const y = cy - h / 2;
  if (type === 'decision') return <polygon className={className} points={`${cx},${y} ${x + w},${cy} ${cx},${y + h} ${x},${cy}`} />;
  if (type === 'data') {
    const slant = 14;
    return <polygon className={className} points={`${x + slant},${y} ${x + w},${y} ${x + w - slant},${y + h} ${x},${y + h}`} />;
  }
  const radius = type === 'start' || type === 'result' ? Math.min(h / 2, 30) : type === 'human' ? 12 : 10;
  return <rect className={className} x={x} y={y} width={w} height={h} rx={radius} />;
}

function NodeShape({ node }) {
  const { type, cx, cy, w, h } = node;
  const x = cx - w / 2;
  const y = cy - h / 2;
  if (type === 'query') return <><Outline node={node} className="flow-shape" /><path className="flow-band" d={`M${x + 7} ${y}h-1a6 6 0 0 0-6 6v${h - 12}a6 6 0 0 0 6 6h1z`} /></>;
  if (type === 'human') return <>
    <Outline node={node} className="flow-shape" />
    <rect className="flow-inner" x={x + 4} y={y + 4} width={w - 8} height={h - 8} rx="9" />
    <circle className="flow-icon" cx={x + 19} cy={y + 16} r="3.4" />
    <path className="flow-icon" d={`M${x + 12.5} ${y + 27.5}a6.5 6.5 0 0 1 13 0`} />
  </>;
  return <Outline node={node} className="flow-shape" />;
}

function FlowNode({ node, rule, dim }) {
  const textX = node.type === 'query' ? node.cx + 3 : node.cx;
  const top = node.cy - (KICKER_HEIGHT + node.lines.length * LINE_HEIGHT) / 2;
  return <g className={`flow-node flow-${node.type} flow-${node.origin}${dim ? ' is-dim' : ''}`} data-node={node.id}>
    <NodeShape node={node} />
    <text className="flow-kicker" x={textX} y={top + 9} textAnchor="middle">{kicker(node, rule)}</text>
    {node.lines.map((line, index) => <text className="flow-line" key={line} x={textX} y={top + KICKER_HEIGHT + 12 + index * LINE_HEIGHT} textAnchor="middle">{line}</text>)}
  </g>;
}

function FlowNote({ note }) {
  const top = note.y - (KICKER_HEIGHT + note.lines.length * LINE_HEIGHT) / 2;
  return <g className="flow-note">
    <text className="flow-kicker" x={note.x} y={top + 9} textAnchor="middle">NOTA · AACMP</text>
    {note.lines.map((line, index) => <text className="flow-line" key={line} x={note.x} y={top + KICKER_HEIGHT + 12 + index * LINE_HEIGHT} textAnchor="middle">{line}</text>)}
  </g>;
}

function EdgeLabel({ edge }) {
  const [x, y] = edge.labelAt;
  const width = edge.label.length * 6.4 + 10;
  return <g>
    <rect className="flow-label-bg" x={x - width / 2} y={y - 9} width={width} height="18" rx="9" />
    <text className="flow-label" x={x} y={y + 4} textAnchor="middle">{edge.label}</text>
  </g>;
}

function Legend() {
  return <ul className="flow-legend">
    <li><svg viewBox="0 0 30 18" aria-hidden="true"><rect className="flow-swatch-dark" x="1" y="2" width="28" height="14" rx="7" /></svg><svg viewBox="0 0 30 18" aria-hidden="true"><rect className="flow-swatch-green" x="1" y="2" width="28" height="14" rx="7" /></svg>Inicio / Resultado</li>
    <li><svg viewBox="0 0 30 18" aria-hidden="true"><polygon className="flow-swatch" points="6,2 29,2 24,16 1,16" /></svg>Datos</li>
    <li><svg viewBox="0 0 30 18" aria-hidden="true"><rect className="flow-swatch" x="1" y="2" width="28" height="14" /><rect className="flow-swatch-band" x="1" y="2" width="5" height="14" /></svg>Consulta</li>
    <li><svg viewBox="0 0 30 18" aria-hidden="true"><polygon className="flow-swatch" points="15,1 29,9 15,17 1,9" /></svg>Decisión</li>
    <li><svg viewBox="0 0 30 18" aria-hidden="true"><rect className="flow-swatch-action" x="1" y="2" width="28" height="14" /></svg>Acción</li>
    <li><svg viewBox="0 0 30 18" aria-hidden="true"><rect className="flow-swatch-human" x="1" y="1" width="28" height="16" /><rect className="flow-swatch-human" x="4" y="4" width="22" height="10" /></svg>Persona (siempre AACMP)</li>
    <li><svg viewBox="0 0 30 18" aria-hidden="true"><line className="flow-swatch-rule" x1="1" y1="9" x2="29" y2="9" /></svg>Naranja o alto contraste, rótulo R3/R4: regla original</li>
    <li><svg viewBox="0 0 30 18" aria-hidden="true"><line className="flow-swatch-aacmp" x1="1" y1="9" x2="29" y2="9" /></svg>Verde o rótulo AACMP: agregado del equipo</li>
  </ul>;
}

function TextVersion({ flow, rule }) {
  const byId = Object.fromEntries(flow.nodes.map(node => [node.id, node]));
  return <details className="flow-text">
    <summary><Icon name="text" />Leer el recorrido como texto <ToggleIcon /></summary>
    <div className="detail-content"><ol>{flow.nodes.map(node => {
      const exits = flow.edges.filter(edge => edge.from === node.id);
      return <li key={node.id}>
        <strong>{kicker(node, rule)}:</strong> {nodeText(node)}
        {exits.length > 0 && <ul>{exits.map(edge => <li key={edge.to}>{edge.label ?? 'Sigue en'} → {nodeText(byId[edge.to])}</li>)}</ul>}
      </li>;
    })}</ol>
    {flow.notes?.map(note => <p key={nodeText(note)}><strong>Nota AACMP:</strong> {nodeText(note)}</p>)}
    </div>
  </details>;
}

// Capa de resaltado: se dibuja encima del diagrama completo, que nunca se oculta.
function FlowHighlight({ flow, scene, arrowId }) {
  const nodes = flow.nodes.filter(node => scene.lit.has(node.id));
  const edges = flow.edges.filter(edge => scene.edges.has(edge));
  return <g className="flow-highlight">
    {edges.map(edge => <path className="flow-trace-mark" key={`${edge.from}-${edge.to}-m`} d={edgePath(edge.points)} />)}
    {edges.map(edge => <path className={`flow-trace-line${scene.drawing === edge ? ' is-drawing' : ''}`} key={`${edge.from}-${edge.to}`} d={edgePath(edge.points)} markerEnd={`url(#${arrowId})`} pathLength="1" />)}
    {nodes.map(node => <g key={node.id} className={node.id === scene.active ? 'is-active' : 'is-near'}><Outline node={node} className="flow-halo-mark" /><Outline node={node} className="flow-halo-ring" /></g>)}
  </g>;
}

export default function FlowDiagram({ proposal }) {
  const { id, rule } = proposal;
  const flow = flows[id];
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);
  const canvasRef = useRef(null);
  const svgRef = useRef(null);
  const scene = sceneAround(flow, hovered ?? selected);

  // Centra el nodo elegido desplazando solo el lienzo: la página no se mueve.
  useEffect(() => {
    const canvas = canvasRef.current;
    const node = flow.nodes.find(item => item.id === selected);
    if (!node || canvas.scrollWidth <= canvas.clientWidth) return;
    const scale = svgRef.current.getBoundingClientRect().width / VIEW_WIDTH;
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    canvas.scrollTo({ left: node.cx * scale - canvas.clientWidth / 2, behavior: calm ? 'auto' : 'smooth' });
  }, [flow, selected]);

  const nodeAt = target => target.closest('[data-node]')?.dataset.node ?? null;
  // Solo el cursor resalta al pasar; en pantallas táctiles se elige con un toque.
  const onPointerOver = event => { if (event.pointerType !== 'touch') setHovered(nodeAt(event.target)); };
  const onClick = event => setSelected(nodeAt(event.target));

  const limitCase = proposal.cases[2];
  const headingId = `${id}-diagram-title`;
  const svgTitleId = `${id}-diagram-svg-title`;
  const svgDescId = `${id}-diagram-svg-desc`;
  const arrowId = `${id}-diagram-arrow`;
  const traceArrowId = `${id}-diagram-arrow-trace`;

  return <figure className="flow" aria-labelledby={headingId}>
    <h3 id={headingId} className="flow-title">Diagrama {rule} · {flow.title}</h3>
    <Legend />
    <p className="flow-scroll-hint" aria-hidden="true">Deslizá hacia los costados para ver todo el diagrama <Icon name="arrowRight" size={15} /></p>
    <div className="flow-canvas" ref={canvasRef} tabIndex="0" role="region" aria-label={`Diagrama de flujo de ${rule}, desplazable en pantallas angostas`}>
      <svg className={`flow-svg${scene ? ' is-lit' : ''}`} ref={svgRef} viewBox={`0 0 ${VIEW_WIDTH} ${flow.height}`} role="img" aria-labelledby={svgTitleId} aria-describedby={svgDescId} onPointerOver={onPointerOver} onPointerLeave={() => setHovered(null)} onClick={onClick}>
        <title id={svgTitleId}>{`Diagrama de flujo de ${rule}: ${flow.title}`}</title>
        <desc id={svgDescId}>{flow.description}</desc>
        <defs>
          <marker id={arrowId} markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path className="flow-arrow-head" d="M0 0 10 5 0 10z" /></marker>
          <marker id={traceArrowId} markerUnits="userSpaceOnUse" markerWidth="13" markerHeight="13" refX="11" refY="6.5" orient="auto"><path className="flow-trace-head" d="M0 0 13 6.5 0 13z" /></marker>
        </defs>
        {flow.edges.map(edge => <path className={`flow-edge${scene && !scene.edges.has(edge) ? ' is-dim' : ''}`} key={`${edge.from}-${edge.to}`} d={edgePath(edge.points)} markerEnd={`url(#${arrowId})`} />)}
        {scene && <FlowHighlight flow={flow} scene={scene} arrowId={traceArrowId} />}
        {flow.nodes.map(node => <FlowNode key={node.id} node={node} rule={rule} dim={scene && !scene.lit.has(node.id)} />)}
        {flow.notes?.map(note => <FlowNote key={nodeText(note)} note={note} />)}
        {flow.edges.filter(edge => edge.label).map(edge => <EdgeLabel key={`${edge.from}-${edge.to}`} edge={edge} />)}
      </svg>
    </div>
    <FlowExplorer flow={flow} rule={rule} selected={selected} onSelect={setSelected} onClose={() => setSelected(null)} />
    <figcaption className="flow-caption">
      <div className="flow-notes">
        <div className="flow-tile"><h4><Icon name="flag" size={16} />Caso límite</h4><p>{limitCase.input}</p><p><strong>Resultado:</strong> {limitCase.result}</p><p><strong>Límite de interpretación:</strong> {proposal.limit}</p></div>
        <div className="flow-tile"><h4><Icon name="alert" size={16} />Excepción resuelta</h4><p>{proposal.exceptions[flow.exceptionIndex]}</p></div>
      </div>
      <div className="flow-assumption-box"><p className="flow-assumptions"><strong>Supuestos AACMP:</strong> todo lo marcado en verde o como AACMP lo agrega el equipo; la sentencia no lo define.</p>
      <ul className="flow-assumption-list">{flow.assumptions.map(assumption => <li key={assumption}>{assumption}</li>)}</ul></div>
      <TextVersion flow={flow} rule={rule} />
    </figcaption>
  </figure>;
}
